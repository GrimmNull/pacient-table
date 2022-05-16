import {
    Formik,
    FieldArray,
    FormikHelpers,
    FormikProps,
    Form,
    Field,
    FieldProps,
} from 'formik';
import styles from './Form.module.scss';
import {FunctionComponent, useEffect, useState} from "react";
import {Row} from "../Tabel/Tabel";
import clsx from "clsx";

interface IProps {
    onSubmit: (values: Row) => void;
}

const initialValues = {
    pacient: '',
    diagnosis: [],
    treatment: [],
}

export const PatientForm: FunctionComponent<IProps> = (props) => {
    const { onSubmit } = props;
    const [visible, setVisible] = useState(false);

    const clickListener = (e) => {
        let localVisible = false;
        // @ts-ignore
        if (document.getElementById('patient-form').contains(e.target)){
            // Clicked in box
        } else{
            !localVisible && setVisible(false);
            localVisible = !localVisible;
        }
    };

    useEffect(() => {
        console.log("Change visible");
        if(!visible) {
            window.removeEventListener("click", clickListener);
            window.addEventListener('click', clickListener);
        }

    }, [visible]);

    return (<>
        <button className={styles.button} onClick={() => setVisible(true)}>
            Add a new patient </button>
        <div className={clsx(styles.wrapper, {[styles.visible]: visible})}>

            <div id={"patient-form"} className={clsx(styles.form)}>
                <Formik
                    initialValues={initialValues}
                    onSubmit={(values: Row, actions: FormikHelpers<Row>) => {
                        onSubmit(values as Row);
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
                                                    Add patient to the list
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
        </div>
        </>)
}