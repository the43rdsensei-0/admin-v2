import styles from "./transactionaction.module.css";
import { useNavigate } from "react-router-dom";
import ActionTextButton from "../../../../../components/Buttons/ActionButton";

export default function TransactionAction({id, reviewed, paid}:{id:string, reviewed:boolean, paid:boolean}) {
    
    const navigate = useNavigate()

    return (
        <ActionTextButton
            extraStyle={
                reviewed
                ? paid
                    ? styles.paid
                    : styles.payout 
                : styles.review
            }
            label={reviewed ?paid ?"View" :"Pay out" :"Review"}
            action={()=> navigate({pathname: id})}
        />
    )
}