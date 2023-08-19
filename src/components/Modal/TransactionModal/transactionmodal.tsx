import TextButton from "../../Buttons/TextButton/textbutton";
import styles from "./transactionmodal.module.css";
import { MdCheckCircleOutline } from "react-icons/md"

export default function TransactionModal(props:{type:string, close:Function}) {

    const detModal = ()=> {
        switch (props.type) {
            case "PENDING": return <PendingModal close={()=> props.close()} />
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.modal_container}>
                { detModal() }
            </div>
        </div>
    );
}

function PendingModal(props:{ close:Function }) {
    return (
        <div className={styles.modal}>
            <MdCheckCircleOutline className={styles.check_icon} />
            <div className={styles.status_head}>
                Transaction in progress
            </div>
            <div className={styles.status_info}>
                You will be notified if your transaction is successful
            </div>

            <div className={styles.modal_btn_wrapper}>
                <TextButton 
                    label="Okay" 
                    isLoading={false} 
                    onClick={()=> props.close()} 
                />
            </div>
        </div>
    );
}