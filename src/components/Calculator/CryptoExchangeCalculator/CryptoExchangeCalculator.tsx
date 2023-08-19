import convertCurrency from "../../../utils/currencyConverter";
import displayTransactionTotal from "../../../utils/displayTransactionTotal";
import Card from "../../Cards/card";
import styles from "./cryptoexchangecalculator.module.css";
import { ExchangeCalculatorProps } from "./types";

export default function CryptoExchangeCalculator ({
    rate,
    amount,
    currency
}:ExchangeCalculatorProps) {


    return (
        <Card>
            <div className={styles.container}>
                <div className={styles.exchange_rate}>
                    <div className={styles.label}>Exchange rate</div>
                    <div className={styles.rate}>{convertCurrency(rate.inDollar, currency, 2)}/crypto</div>
                </div>

                <div className={styles.amnt_received}>
                    <div className={styles.label}>Amount you receive</div>
                    <div className={styles.amount}>
                            {displayTransactionTotal(rate.inNaira, amount, 2)}
                    </div>
                </div>
            </div>
        </Card>
    );
}