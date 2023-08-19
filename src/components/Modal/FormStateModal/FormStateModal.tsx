import styles from "./formstatemodal.module.css";
import { FaTimes } from "react-icons/fa";
import { useEffect } from "react";

export default function FormStateModal ({ 
    state,
    setState
}:{ 
    state:{
        status: 'failed'|'succeeded'|'idle'|'loading',
        message:string
    }, 
    setState:Function 
}) {

    const close = ()=> {
        setState((state:any) => {
            return {
                ...state,
                status: 'idle',
                error:false,
                messge:''
            }
        })
    }

    useEffect(()=> {
        return ()=> {
            setState((state:any) => {
                return {
                    ...state,
                    status: 'idle',
                    error:false,
                    messge:''
                }
            })
        }
    }, [setState])

    if(state.status === 'failed')
    return (
        <div className={`${styles.modal_container} ${styles.error}`}>
            <div className={styles.text}> { state.message } </div>
            <FaTimes onClick={()=> close()} className={styles.close_icon} />
        </div>
    )

    if(state.status === 'succeeded') 
    return (
        <div className={`${styles.modal_container} ${styles.success}`}>
            <div className={styles.text}> { state.message } </div>
            <FaTimes onClick={()=> close()} className={styles.close_icon} />
        </div>
    )

    return null;
}