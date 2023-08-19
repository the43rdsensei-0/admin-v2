import genStyles from "../loader.module.css";
import styles from "./swingingdotsloader.module.css";

export default function SwingingDotsLoader(props:{ color:string }) {
    return (
        <div className={`${styles.lds_ellipsis} ${genStyles.lds_wrapper}`} style={{background: props.color}}>
            <div style={{background: props.color}}></div>
            <div style={{background: props.color}}></div>
            <div style={{background: props.color}}></div>
            <div style={{background: props.color}}></div>
        </div>
    );
}