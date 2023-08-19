import IconButton from "../IconButton/iconbutton";
import styles from "./primaryiconbutton.module.css";

interface PrimaryTextButtonType {
    extraStyle?:any,
    prefixIcon?:JSX.Element,
    suffixIcon?:JSX.Element,
    type?:"button"|"submit"|"reset",
    label:string, 
    isLoading?:boolean, 
    loaderColor?:string, 
    action:Function,
    disabled?:boolean
}

export default function PrimaryIconButton({ 
    extraStyle,
    prefixIcon,
    suffixIcon,
    type,
    label,
    isLoading,
    disabled,
    action
}:PrimaryTextButtonType) {
    
    return (
        <IconButton 
            extraStyle={styles.primary_icon_button}
            prefixIcon={prefixIcon}
            suffixIcon={suffixIcon}
            type={type}
            label={label}
            isLoading={isLoading!}
            onClick={()=> action()}
            disabled={disabled!}
        />
    );
}