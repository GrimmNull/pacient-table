import styles from "./Diagnostic.module.scss"
import {FunctionComponent, useState} from "react";
import {diagnostics} from "../../../utils/diagnostics";
import clsx from "clsx";
import {Tooltip} from "../Tooltip/Tooltip";

interface IProps {
    name: string;
}

export const Diagnostic:FunctionComponent<IProps> = (props) => {
    const name = props.name.replaceAll("\"", "");
    const description = name && diagnostics[name];
    const [hover, setHover] = useState(false);

    return (<div className={clsx(styles.wrapper, {[styles.active]: description})} onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
    >
        {name} {description && <Tooltip active={hover} description={description}/>}
    </div>)
}