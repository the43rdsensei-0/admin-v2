import genStyles from "../loader.module.css";
import styles from "./circularringloader.module.css";

export default function CircularRingLoader(props:{ color:string, size?:number }) {
    return (
        <div className={`${styles.lds_ring} ${genStyles.lds_wrapper}`}>
            <div style={{color: props.color, width:props.size, height:props.size}}></div>
            <div style={{color: props.color, width:props.size, height:props.size}}></div>
            <div style={{color: props.color, width:props.size, height:props.size}}></div>
            <div style={{color: props.color, width:props.size, height:props.size}}></div>
        </div>
    );
}