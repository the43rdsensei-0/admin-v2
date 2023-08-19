import TextButton from "../../Buttons/TextButton/textbutton";
import styles from "./inputfield.module.css";

export default function InputField(props:{ 
    customStyle?:any,
    type?:string,
    label?:string,
    hint?:string,
    value?:string|number,
    readOnly?:boolean,
    error?:string,
    prefixIcon?:any,
    prefixIconWithText?: {
        icon: any,
        text: string
    },
    suffixIcon?:any,
    suffixIconAlt?:any,
    showSuffixAlt?:boolean,
    changeSuffixIcon?:Function,
    suffixBtnLabel?:string,
    suffixBtnLabelAlt?:string,
    suffixBtnClicked?:Function,
    suffixBtnLoader?:any,
    isSuffixBtnLoading?:boolean
    suffixText?:string,
    isLoading?:boolean,
    disabled?:boolean,
    onInput:Function,
}) {
    
    return(
        <div className={styles.input_field_container}>
            {
                (props.label) 
                ? <div className={styles.label}> { props.label } </div>
                : null
            }
            <div className={`
                ${styles.input_field}
                ${props.customStyle}
                ${props.error ?styles.input_error : null }
                ${props.readOnly ?styles.disabled :null}
            `}>
                {
                    (props.prefixIcon) 
                    ?   <div 
                            children={props.prefixIcon}
                            className={`${styles.icon_wrapper} ${styles.prefix}`} 
                            onClick={()=> props.changeSuffixIcon?.() }
                        />
                    : null 
                }
                {
                    (props.prefixIconWithText?.icon) 
                    ?   <div className={styles.prefix_icon_with_text}>
                            <props.prefixIconWithText.icon className={styles.prefix_icon} />
                            <span className={styles.prefix_icon_text}>{props.prefixIconWithText.text}</span>
                        </div>
                    : null 
                }
                <input 
                    type={props.type ?? "text"}
                    defaultValue={props.value}
                    placeholder={props.hint!}
                    onChange={ (e:any)=> props.onInput(e.target.value) }
                    readOnly={props.readOnly}
                    onWheel={(e:any)=> e.target.blur()}
                />
                {
                    (props.suffixIcon) 
                    ?   <div 
                            children={props.suffixIcon}
                            className={`${styles.icon_wrapper} ${styles.suffix}`} 
                            onClick={()=> props.changeSuffixIcon?.() }
                        />
                    : null 
                }
                {
                    props.suffixBtnLabel
                    ?   <div className={styles.suffix_btn_wrapper}>
                            <TextButton
                                label={props.suffixBtnLabel!}
                                loaderColor={'var(--orange-accent-100)'}
                                isLoading={props.isSuffixBtnLoading}
                                onClick={()=> props.suffixBtnClicked?.()}
                            />
                        </div>
                    :null
                }
                {
                    props.suffixText
                    ?   <div className={styles.suffix_text_wrapper}>
                            { props.suffixText }
                        </div>
                    :null
                }
            </div>
            <div className={styles.error}> { props.error } </div>
        </div>
    );
};


