import { bankAccountType } from "src/features/assets/bankAccounts/atom";
import styles from "./bankaccountcard.module.css";

export default function BankAccountCard({
    active,
    name,
    acctName,
    shortCode,
    nuban
}:bankAccountType) {
    return (
        <div className={styles.bank_account_card}>
            <div className={styles.bank}>{acctName}</div>
            <div className={styles.acct_number}>{nuban}</div>
            <div className={styles.acct_name}>{name}</div>
        </div>
    )
}