import styles from "./activestatus.module.css";

export default function ActiveStatus({status}:{status:boolean}) {
    return(
        <div className={styles.active_status_container}>
            {
                status
                ?   <div className={styles.active}>Active</div>
                :   <div className={styles.in_active}>Deactivated</div>
            }
        </div>
    );
}