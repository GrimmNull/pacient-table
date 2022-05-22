import {FunctionComponent} from "react";
import {diagnostics} from "../../../utils/diagnostics";
import styles from "./Tooltip.module.scss"
import clsx from "clsx";


interface IProps {
    active: boolean;
    description: string;
}

export const Tooltip: FunctionComponent<IProps> = (props) => {
    const { active, description } = props;

    return (<div className={styles.wrapper}>
        <div className={clsx(styles.message, {[styles.active]: active})} dangerouslySetInnerHTML={{__html: description}}/>
    </div>)
}