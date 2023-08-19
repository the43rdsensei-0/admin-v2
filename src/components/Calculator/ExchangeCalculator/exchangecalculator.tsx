import convertCurrency from "../../../utils/currencyConverter";
import displayTransactionTotal from "../../../utils/displayTransactionTotal";
import { ExchangeCalculatorProps } from "../CryptoExchangeCalculator/types";
import styles from "./exchangecalculator.module.css";

export default function ExchangeCalculator ({
    rate,
    amount,
    currency
}: ExchangeCalculatorProps) {

    return (
        <div className={styles.container}>
            <div className={styles.exchange_rate}>
                <div className={styles.label}>Exchange rate</div>
                <div className={styles.rate}>{convertCurrency(rate.inDollar, currency, 2)}/$</div>
            </div>

            <div className={styles.amnt_received}>
                <div className={styles.label}>Amount you receive</div>
                <div className={styles.amount}>N{displayTransactionTotal(rate.inNaira, amount, 2)}</div>
            </div>
        </div>
    );
}