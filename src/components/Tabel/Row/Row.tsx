import styles from './Row.module.scss';
import clsx from "clsx";
import { Row } from "../Tabel";
import {FunctionComponent} from "react";
import {Diagnostic} from "../Diagnostic/Diagnostic";

interface IProps {
    row: Row;
}

export const TableRow: FunctionComponent<IProps> = (props) => {
    const { row } = props;

    return (<div className={styles.tableRow}>
        <div className={clsx(styles.tableCell, styles.pacient)}>
            {row?.pacient}
        </div>
        <div className={styles.tableCell}>
            {row?.diagnosis?.map((diagnosis, index) => (<Diagnostic name={diagnosis} />))}
        </div>
        <div className={styles.tableCell}>
            {row?.treatment?.map((treatment, index) => {
                return (<div key={index}>
                    {treatment}
                </div>);
            })}
        </div>
    </div>);
}