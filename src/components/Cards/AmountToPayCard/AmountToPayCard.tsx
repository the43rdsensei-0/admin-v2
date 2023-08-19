import convertCurrency from "src/utils/currencyConverter";
import Card from "../card";
import styles from "./amounttopaycard.module.css";

export default function AmountToPayCard({currency, amount}:{currency:'₦'|'$', amount:number}) {
    return (
        <Card extraStyle={styles.total_value_container}>
            <div className={styles.label}>Amount to pay</div>
            <div className={styles.total_amount}> { convertCurrency(amount, currency, 2) } </div>
        </Card>
    )
}