import styles from "./transactiondeferbutton.module.css";
import TextButton from "src/components/Buttons/TextButton/textbutton";
import { deferTransactionAction } from "src/features/transactions/actions";
import { useTransactionSetState } from "src/features/transactions/atom";
import formatTransaction, { transactionDetailsType } from "src/features/transactions/utils/formatTransaction";
import { useUserStateValue } from "src/features/user/atom";

export default function TransactionDeferButton({transactionId}:{transactionId:string}) {

    const setTransactionState = useTransactionSetState();
    const userState = useUserStateValue();
 
    const deferTransaction =()=> {
        deferTransactionAction(transactionId)
        .then((response:any)=> {
            formatTransaction(response?.transaction, userState.userData.role)
            .then((formattedTransaction:transactionDetailsType)=> {
                setTransactionState(state => {
                    return {
                        ...state,
                        details: formattedTransaction
                    }
                })
            })
            .catch((error)=> {
                console.log(error)
            })
            .finally(()=> {
                
            })
        })
        .catch((error)=> {
            console.log(error);
        })
    }

    return  <TextButton 
                className={styles.defer_button} 
                label={"Defer"}
                onClick={()=> deferTransaction()}
            />
}