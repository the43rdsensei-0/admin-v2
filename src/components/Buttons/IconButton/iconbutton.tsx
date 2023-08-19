import CircularRingLoader from "../../Loaders/CircularRingLoader";
import styles from "./iconbutton.module.css";

export default function IconButton(props:{
    extraStyle?:any,
    type?:"button"|"submit"|"reset",
    label:string,
    prefixIcon?:any,
    suffixIcon?:any,
    disabled?:boolean,
    isLoading?:boolean,
    onClick:Function,
    loaderColor?:string
}) {
    return(
        <button 
            className={`${styles.icon_btn_container} ${props.extraStyle}`} 
            onClick={()=> (!props.isLoading) ?props.onClick() :null }
            disabled={props.disabled}
        >
            {
                (props.isLoading)
                ?   <div className={styles.loader_wrapper}> 
                        <CircularRingLoader color={props.loaderColor || "white"} />
                    </div>
                :   <div className={styles.btn_content}>
                        {props?.prefixIcon!}
                        <div className={styles.label}>{ props.label }</div>
                        {props?.suffixIcon!}
                    </div>
            }
        </button>
    );

}