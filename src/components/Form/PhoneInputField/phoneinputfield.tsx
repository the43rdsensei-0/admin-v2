import styles from "./phoneinputfield.module.css"
import {ReactComponent as nigeriaFlag} from "../../../assets/icons/icon-nigeria-flag.svg";
import InputField from "../InputField/inputfield";

export default function PhoneInputField({ 
    value, 
    error, 
    otpIsLoading, 
    sendOtp, 
    disabled,
    disableOTP,
    onInput 
}:{ value:string, disabled?:boolean, disableOTP:boolean, error?:string, otpIsLoading?:boolean, sendOtp?:Function, onInput:Function }) {


    return(
       <InputField
            value={value}
            disabled={disabled}
            customStyle={styles.clear_padding}
            type='number'
            label="Phone number"
            error={error}
            prefixIconWithText={{icon: nigeriaFlag, text: '234'}}
            suffixBtnLabel={disabled ?"" : disableOTP ?"" :"send otp"}
            suffixBtnClicked={()=> sendOtp?.()}
            isSuffixBtnLoading={otpIsLoading}
            onInput={onInput}
            readOnly={disabled}
       />
    );
}


