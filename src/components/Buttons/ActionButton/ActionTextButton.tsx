import styles from "./actiontextbutton.module.css";
import TextButton from "../TextButton/textbutton";

interface ActionTextButtonType {
    type?:"button"|"submit"|"reset",
    label:string, 
    isLoading?:boolean, 
    loaderColor?:string, 
    action:Function,
    disabled?:boolean,
    extraStyle?:string
}

export default function ActionTextButton({
    extraStyle,
    type,
    label,
    isLoading,
    disabled,
    action
}:ActionTextButtonType) {
    
    return (
        <TextButton
            className={`${extraStyle} ${styles.primary_text_button}`}
            type={type}
            label={label}
            isLoading={isLoading}
            onClick={()=> action()}
            disabled={disabled}
        />
    );
}