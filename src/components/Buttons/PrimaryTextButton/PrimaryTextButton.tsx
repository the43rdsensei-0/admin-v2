import styles from "./primarytextbutton.module.css";
import TextButton from "../TextButton/textbutton";

interface PrimaryTextButtonType {
    extraStyle?:string,
    width?: number,
    type?:"button"|"submit"|"reset",
    label:string, 
    isLoading?:boolean, 
    loaderColor?:string, 
    action:Function,
    disabled?:boolean
}

export default function PrimaryTextButton({
    extraStyle,
    type,
    label,
    isLoading,
    disabled,
    action
}:PrimaryTextButtonType) {
    
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