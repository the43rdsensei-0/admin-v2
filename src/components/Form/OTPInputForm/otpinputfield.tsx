import { useRef } from "react";
import censor from "../../../utils/censor";
import styles from "./otpinputfield.module.css"

export default function OTPInputField(props:{
    type:string,
    hint?:string,
    error?:string,
    phoneNumberInUSe:string,
    validated:boolean,
    submit:Function,
}) {

    const inputField_1 = useRef<any>();
    const inputField_2 = useRef<any>();
    const inputField_3 = useRef<any>();
    const inputField_4 = useRef<any>();
    const inputField_5 = useRef<any>();
    const inputField_6 = useRef<any>();

    const goToField = (nextPosition:number)=> {
        if(nextPosition === 1) inputField_1.current.focus();
        if(nextPosition === 2) inputField_2.current.focus();
        if(nextPosition === 3) inputField_3.current.focus();
        if(nextPosition === 4) inputField_4.current.focus();
        if(nextPosition === 5) inputField_5.current.focus();
        if(nextPosition === 6) inputField_6.current.focus();
    }

    const submitOTP = ()=> {
        props.submit(`${inputField_1.current.value}${inputField_2.current.value}${inputField_3.current.value}${inputField_4.current.value}${inputField_5.current.value}${inputField_6.current.value}`);
    }

    return(
        <div className={styles.otp_field_container}>
            <div className={`${styles.code_field_container} ${(props.error) ?styles.input_error :null}`}>
                <input 
                    type={'number'}
                    ref={inputField_1}
                    onInput={({target}:any)=> (target.value) ?goToField(2) :null}
                />
                 <input 
                    type={'number'}
                    ref={inputField_2}
                    maxLength={1}
                    onInput={({target}:any)=> (target.value) ?goToField(3) :goToField(1)}
                />
                 <input 
                    type={'number'}
                    ref={inputField_3}
                    onInput={({target}:any)=> (target.value) ?goToField(4) :goToField(2)}
                />
                 <input 
                    type={'number'}
                    ref={inputField_4}
                    onInput={({target}:any)=> (target.value) ?goToField(5) :goToField(3)}
                />
                 <input 
                    type={'number'}
                    ref={inputField_5}
                    onInput={({target}:any)=> (target.value) ?goToField(6) :goToField(4)}
                />
                <input 
                    type={'number'}
                    ref={inputField_6}
                    onInput={({target}:any)=> (target.value) ?submitOTP() :goToField(5)}
                />  
            </div>
            
            <div className={styles.error}> { props.error } </div>

            <div className={styles.info}>
                {
                    (props.validated)
                   ? `Phone number ${ censor(props.phoneNumberInUSe) }  has been verified successfully`
                   : `Please enter the six digits code we sent to ${ censor(props.phoneNumberInUSe) }`
                }
            </div>
        </div>
    );
}