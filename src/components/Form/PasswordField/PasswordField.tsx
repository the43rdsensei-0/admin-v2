import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import InputField from "../InputField/inputfield";
import styles from "./passwordfield.module.css";

export default function PasswordField({label, value, error, onInput}:{label:string, value?:string, error:string, onInput:Function}) {

    const [passwordModel, setPasswordModel] = useState({
        type: 'password',
        label: label,
        error: error,
        suffixIcon: <FaEye />,
        suffixIconAlt: <FaEyeSlash />
    });

    const togglePasswordVisibility = ()=> {
        passwordModel.type = (passwordModel.type === 'password') ?'text' :'password';
        [passwordModel.suffixIcon, passwordModel.suffixIconAlt] = [passwordModel.suffixIconAlt, passwordModel.suffixIcon]
        setPasswordModel({...passwordModel});
    }

    return (
        <div className={styles.container}>
            <InputField 
                type={passwordModel.type}
                label={passwordModel.label}
                value={value}
                error={error}
                suffixIcon={passwordModel.suffixIcon}
                changeSuffixIcon={ ()=> togglePasswordVisibility() }
                onInput={(input:string)=> onInput(input)}
            />
        </div>
    );
}