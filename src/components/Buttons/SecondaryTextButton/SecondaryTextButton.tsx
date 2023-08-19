import styles from "./secondarytextbutton.module.css";
import TextButton from "../TextButton/textbutton";

interface PrimaryTextButtonType {
    type?:"button"|"submit"|"reset",
    label:string, 
    isLoading?:boolean, 
    loaderColor?:string, 
    action:Function,
    disabled?:boolean,
    secondaryStyle?:any
}

export default function SecondaryTextButton({
    type,
    label,
    isLoading,
    disabled,
    action,
    secondaryStyle,
    loaderColor
}:PrimaryTextButtonType) {
    
    return (
        <TextButton
            className={`${styles.secondary_text_button} ${secondaryStyle}`}
            loaderColor={loaderColor}
            type={type}
            label={label}
            isLoading={isLoading}
            onClick={()=> action()}
            disabled={disabled}
        />
    );
}