import {FunctionComponent, useEffect, useState} from "react";
import styles from "./Tabel.module.scss";

import clsx from "clsx";
import {PatientForm} from "../Form/PatientForm";
import {TableRow} from "./Row/Row";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import BigBrain from "../../assets/Parallel_Minds.webp";

ChartJS.register(ArcElement, Tooltip, Legend);

const diagnosisChartInfo = {};
const treatmentChartInfo = {};

export interface Row {
    pacient: string;
    diagnosis: string[];
    treatment: string[];
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

const getChartData = (chartInfo) => {
    const randomVectOfColors = [];
    for (let i = 0 ; i < Object.keys(chartInfo).length; i++) {
        const r = getRandomArbitrary(1, 255);
        const g = getRandomArbitrary(1, 255);
        const b = getRandomArbitrary(1, 255);
        randomVectOfColors.push(`rgba(${r}, ${g}, ${b}, 0.2)`);

    }
    const tempData = {
        labels: Object.keys(chartInfo),
        datasets: [
            {
                label: '# of diagnosis',
                data: Object.values(chartInfo),
                backgroundColor: randomVectOfColors,
                borderColor: chartInfo !== {} ? randomVectOfColors.map(el => el.replace("0.2", "1")) : [],
                borderWidth: 1,
            },
        ],
    }

    return tempData;
}

export const Tabel: FunctionComponent = () => {
    const [rows, setRows] = useState<Row[]>([]);
    const [csv, setCsv] = useState<string>('');
    const [useLocalStorage, setUseLocalStorage] = useState(false);
    const [diagnosisData, setDiagnosisData] = useState({});
    const [treatmentData, setTreatmentData] = useState({});


    const addRow = (values: Row) => {
        setRows([...rows, {
            pacient: values.pacient,
            diagnosis: values.diagnosis,
            treatment: values.treatment,
        }]);
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0];
        setCsv(file.name);
        const reader = new FileReader();
        reader.onload = () => {
            const csv = reader.result as string;
            const data = csv?.split(/\r?\n/).map(row => row.split(','));
            // setRows(data);
            console.log(data);
            let tempRow: Row = {
                pacient: '',
                diagnosis: [],
                treatment: [],
            };
            const csvRows: Row[] = [];
            data.forEach((row, index) => {
                if (index === 0) {
                    return;
                }
                if (row[0] === '') {
                    if(row[1] !== "") {
                        if (diagnosisChartInfo[row[1]]) {
                            diagnosisChartInfo[row[1]]= diagnosisChartInfo[row[1]] + 1;
                        } else {
                            diagnosisChartInfo[row[1]] = 1;
                        }
                    }
                    row[1] !== "" && tempRow.diagnosis.push(row[1]);

                    if(row[2] !== "") {
                        if (treatmentChartInfo[row[2]]) {
                            treatmentChartInfo[row[2]]= treatmentChartInfo[row[2]] + 1;
                        } else {
                            treatmentChartInfo[row[2]] = 1;
                        }
                    }
                    row[2] !== "" && tempRow.treatment.push(row[2]);
                }
                if (row[0] !== '') {
                    tempRow.pacient !== "" && csvRows.push({...tempRow});
                    tempRow.pacient = row[0];
                    tempRow.diagnosis = [row[1]];
                    if(row[1] !== "") {
                        if (diagnosisChartInfo[row[1]]) {
                            diagnosisChartInfo[row[1]]= diagnosisChartInfo[row[1]] + 1;
                        } else {
                            diagnosisChartInfo[row[1]] = 1;
                        }
                    }
                    tempRow.treatment = [row[2]];

                    if(row[2] !== "") {
                        if (treatmentChartInfo[row[2]]) {
                            treatmentChartInfo[row[2]]= treatmentChartInfo[row[2]] + 1;
                        } else {
                            treatmentChartInfo[row[2]] = 1;
                        }
                    }
                }
                index === data.length - 1 && csvRows.push({...tempRow});
            });
            setRows(csvRows);
        }
        reader.readAsText(file);
    }

    useEffect(() => {
        try {
            // @ts-ignore
            const localStorageRows = JSON.parse(localStorage.getItem('rows'));
            const shouldSave = localStorage.getItem("useLocalStorage") === "true";
            localStorageRows && setRows(localStorageRows);
            setUseLocalStorage(shouldSave);
        } catch (e) {
            console.error("There was an error parsing the localStorage");
        }

        return () => {
            if (!useLocalStorage) {
                localStorage.removeItem('rows');
                localStorage.removeItem('useLocalStorage');
            }
        }
    }, []);

    useEffect(() => {
        if(Object.keys(diagnosisChartInfo).length > 0) {
            const tempData = getChartData(diagnosisChartInfo);
            setDiagnosisData(tempData);
        }

        if(Object.keys(treatmentChartInfo).length > 0) {
            const tempData = getChartData(treatmentChartInfo);
            setTreatmentData(tempData);
        }


        useLocalStorage && localStorage.setItem('rows', JSON.stringify(rows));
        useLocalStorage && localStorage.setItem('useLocalStorage', JSON.stringify(useLocalStorage));
    }, [rows]);

    return (<div className={styles.wrapper}>
        <PatientForm onSubmit={addRow} />

        <div className={styles.useLocalWrapper}>
            Salveaza datele in localStorage pentru a putea fi accesate mai tarziu: <div
            className={clsx(styles.localStorageFlag, {[styles.active]: useLocalStorage})}
            onClick={() => setUseLocalStorage(!useLocalStorage)}/>
        </div>

        <div className={styles.uploadCSVWrapper}>
            <label htmlFor={"uploadCSV"}>{csv !== "" ? csv : "Upload a csv file"}</label>
            <input type="file" id={"uploadCSV"} onChange={handleFileUpload} />
        </div>

        <img src={BigBrain} className={styles.bigBrainTime}  />

        <div className={styles.table}>
            <div className={styles.tableHeader}>
                <div className={styles.tableHeaderCell}>
                    Pacient
                </div>
                <div className={styles.tableHeaderCell}>
                    Diagnosis
                </div>
                <div className={styles.tableHeaderCell}>
                    Treatment
                </div>
            </div>
            {rows && rows.length > 0 && rows.map((row, index) => {
                return (<TableRow  row={row} />);
            })}
        </div>
        { /* @ts-ignore */}
        {Object.keys(diagnosisData).length > 0 && <Pie className={styles.chart} data={diagnosisData} />}
        { /* @ts-ignore */}
        {Object.keys(treatmentData).length > 0 && <Pie className={styles.chart} data={treatmentData} />}
    </div>);
};