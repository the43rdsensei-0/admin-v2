import { FaTimes } from "react-icons/fa";
import styles from "./formsuccess.module.css";
import { formErrorType } from "./types";

export default function FormSuccessModal({errorState, setErrorState}:formErrorType) {

    const close = ()=> {
        if(errorState.status !== 'idle') {
            setErrorState((defaultState:any) => {
                return {
                    ...defaultState,
                    status:'idle',
                    error: false,
                    message: ''
                }
            })
        }
    }

    return(
        <div className={styles.container}>
            {
                (!errorState.error && errorState.status === 'succeeded')
                ?   <div className={styles.success_modal}>
                        <div className={styles.text}> { errorState.message } </div>
                        <FaTimes onClick={()=> close()} className={styles.close_icon} />
                    </div>
                : null
            }
        </div>
    );
}