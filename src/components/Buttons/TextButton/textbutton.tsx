import CircularRingLoader from "../../Loaders/CircularRingLoader";
import styles from "./textbutton.module.css"

export default function TextButton(props:{
    className?:any
    type?:"button"|"submit"|"reset",
    label:string, 
    isLoading?:boolean, 
    loaderColor?:string, 
    onClick:Function,
    disabled?:boolean
}) {

    return(
        <button
            type={props.type ?? "button"}
            className={`${styles.text_btn_container} ${props.className}`} 
            onClick={()=> (!props.isLoading) ?props.onClick?.() :null }
            disabled={props.disabled}
        >
            {
                (props.isLoading)
                ?   <div className={styles.loader_wrapper}> 
                        <CircularRingLoader color={props.loaderColor || "white"} />
                    </div>
                :   props.label
            }
        </button>
    );
}