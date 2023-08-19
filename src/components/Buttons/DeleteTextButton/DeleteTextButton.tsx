import styles from "./deletetextbutton.module.css";
import TextButton from "../TextButton/textbutton";

interface DeleteTextButtonType {
    type?:"button"|"submit"|"reset",
    label:string, 
    isLoading?:boolean, 
    loaderColor?:string, 
    action:Function,
    disabled?:boolean
}

export default function DeleteTextButton({
    type,
    label,
    isLoading,
    disabled,
    action
}:DeleteTextButtonType) {

    return (
        <TextButton
            className={styles.delete_text_button}
            type={type}
            label={label}
            isLoading={isLoading}
            onClick={()=> action()}
            disabled={disabled}
        />
    );
}