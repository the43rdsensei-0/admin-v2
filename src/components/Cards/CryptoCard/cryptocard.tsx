import { Link } from "react-router-dom";
import convertCurrency from "../../../utils/currencyConverter";
import styles from "./cryptocard.module.css";

export default function CryptoCard (props:{
    name:string, 
    label:string,
    code:string, 
    imageURL:string, 
    rate:number,
    path:string
}) {
    return (
        <Link to={`/${props.path}`}>
            <div className={styles.container}>
                <div className={styles.details}>
                    <img src={props.imageURL} alt="" className={styles.crypto_logo} />
                    <div className={styles.name}>
                        <div className={styles.code}>{props.code}</div>
                        <div className={styles.fullname}>{props.name}</div>
                    </div>
                </div>
                <div className={styles.rate}>
                    <div className={styles.label}>Rate</div>
                    <div className={styles.amount}>: N{convertCurrency(props.rate, "$", 2)} </div>
                </div>
            </div>
        </Link>
    );
}