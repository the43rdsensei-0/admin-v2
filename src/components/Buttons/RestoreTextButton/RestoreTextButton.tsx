import styles from "./restoretextbutton.module.css";
import TextButton from "../TextButton/textbutton";

interface RestoreTextButtonType {
    type?:"button"|"submit"|"reset",
    label:string, 
    isLoading?:boolean, 
    loaderColor?:string, 
    action:Function,
    disabled?:boolean
}

export default function RestoreTextButton({ 
    type,
    label,
    isLoading,
    disabled,
    action
}:RestoreTextButtonType) {
    
    return (
        <TextButton
            className={styles.restore_text_button}
            type={type}
            label={label}
            isLoading={isLoading}
            onClick={()=> action()}
            disabled={disabled}
        />
    );
}