import Card from "src/components/Cards/card";
import styles from "./transactionnotecard.module.css";
import { ReactComponent as IconAlertCircle } from "src/assets/icons/icon-alert-circle.svg";
import TransactionGallery from "../TransactionGallery";

export default function TransactionNoteCard({message, images}:{message:string, images?:any[]}) {
    return (
        <div>
            <div className={styles.title}>Note to customer</div>
            <Card extraStyle={styles.transaction_note_card}>
                <div className={styles.message_box}>
                    <IconAlertCircle className={styles.success_info_icon} />
                    <div className={styles.info}> { message } </div>
                </div>
                <TransactionGallery images={images!} />
            </Card>
        </div>
    );
}