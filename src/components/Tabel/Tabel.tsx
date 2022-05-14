import {FunctionComponent, useEffect, useState} from "react";
import styles from "./Tabel.module.scss";
import {
    Formik,
    FieldArray,
    FormikHelpers,
    FormikProps,
    Form,
    Field,
    FieldProps,
} from 'formik';
import clsx from "clsx";

interface Row {
    pacient: string;
    diagnosis: string[];
    treatment: string[];
}

export const Tabel: FunctionComponent = () => {
    const [rows, setRows] = useState<Row[]>([]);
    const [csv, setCsv] = useState<string>('');
    const [useLocalStorage, setUseLocalStorage] = useState(false);
    const initialValues = {
        pacient: '',
        diagnosis: [],
        treatment: [],
    }

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
            const data = csv?.replaceAll(" ","").split(/\r?\n/).map(row => row.split(','));
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
                    row[1] !== "" && tempRow.diagnosis.push(row[1]);
                    row[2] !== "" && tempRow.treatment.push(row[2]);
                }
                if (row[0] !== '') {
                    tempRow.pacient !== "" && csvRows.push({...tempRow});
                    tempRow.pacient = row[0];
                    tempRow.diagnosis = [row[1]];
                    tempRow.treatment = [row[2]];
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
        useLocalStorage && localStorage.setItem('rows', JSON.stringify(rows));
        useLocalStorage && localStorage.setItem('useLocalStorage', JSON.stringify(useLocalStorage));
    }, [rows]);

    return (<div className={styles.wrapper}>
        <div className={styles.form}>
            <Formik
                initialValues={initialValues}
                onSubmit={(values, actions) => {
                    addRow(values);
                    actions.setSubmitting(false);
                    // @ts-ignore
                    actions.resetForm(initialValues);
                }}
                render={({values}) => (
                    <Form>
                        <h4>Nume pacient: </h4>
                        <Field id="pacient" name="pacient" placeholder="Nume pacient"/>
                        <FieldArray
                            name="diagnosis"
                            render={arrayHelpers => (
                                <div>
                                    {values.diagnosis && values.diagnosis.length > 0 ? (
                                        values.diagnosis.map((friend, index) => (
                                            <div className={styles.formRow} key={index}>
                                                <h4>Diagnostic {index}:</h4>
                                                <Field name={`diagnosis.${index}`}/>
                                                <button
                                                    type="button"
                                                    onClick={() => arrayHelpers.remove(index)} // remove a friend from the list
                                                >
                                                    -
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => arrayHelpers.insert(index, '')} // insert an empty string at a position
                                                >
                                                    +
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <button type="button" onClick={() => arrayHelpers.push('')}>
                                            {/* show this when user has removed all friends from the list */}
                                            Adauga diagnoza
                                        </button>
                                    )}
                                </div>
                            )}
                        />
                        <div className={styles.formColumn}>
                            <FieldArray
                                name="treatment"
                                render={arrayHelpers => (
                                    <div>
                                        {values.treatment && values.treatment.length > 0 ? (
                                            values.treatment.map((friend, index) => (
                                                <div className={styles.formRow} key={index}>
                                                    <h4>Tratament {index}:</h4>
                                                    <Field name={`treatment.${index}`}/>
                                                    <button
                                                        type="button"
                                                        onClick={() => arrayHelpers.remove(index)} // remove a friend from the list
                                                    >
                                                        -
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => arrayHelpers.insert(index, '')} // insert an empty string at a position
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <button type="button" onClick={() => arrayHelpers.push('')}>
                                                {/* show this when user has removed all friends from the list */}
                                                Adauga tratament
                                            </button>
                                        )}
                                    </div>
                                )}
                            />
                        </div>

                        <div>
                            <button type="submit">Submit</button>
                        </div>
                    </Form>
                )}>

            </Formik>
        </div>

        <div className={styles.useLocalWrapper}>
            Salveaza datele in localStorage pentru a putea fi accesate mai tarziu: <div
            className={clsx(styles.localStorageFlag, {[styles.active]: useLocalStorage})}
            onClick={() => setUseLocalStorage(!useLocalStorage)}/>
        </div>

        <div className={styles.uploadCSVWrapper}>
            <label htmlFor={"uploadCSV"}>{csv !== "" ? csv : "Upload a csv file"}</label>
            <input type="file" id={"uploadCSV"} onChange={handleFileUpload} />
        </div>

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
                return (<div className={styles.tableRow} key={index}>
                    <div className={clsx(styles.tableCell, styles.pacient)}>
                        {row?.pacient}
                    </div>
                    <div className={styles.tableCell}>
                        {row?.diagnosis?.map((diagnosis, index) => {
                            return (<div key={index}>
                                {diagnosis}
                            </div>);
                        })}
                    </div>
                    <div className={styles.tableCell}>
                        {row?.treatment?.map((treatment, index) => {
                            return (<div key={index}>
                                {treatment}
                            </div>);
                        })}
                    </div>
                </div>);
            })}
        </div>
    </div>);
};