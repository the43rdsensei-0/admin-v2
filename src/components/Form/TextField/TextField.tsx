import AttachImageGallery from "src/components/AttachImageGallery";
import styles from "./textfield.module.css";

export default function TextField({
    label, 
    hint,
    defaultValue,
    error,
    onInput,
    onAttach,
    allowAttachments

}:{label:string, hint?:string, defaultValue?:string,  error?:string, onInput:Function, onAttach?:Function, allowAttachments?: boolean}) {

    return (
        <div className={styles.text_field_container}>
            <div className={styles.label}>{ label }</div>
            <div className={styles.text_field_area}>
                <textarea
                    className={styles.text_area}
                    placeholder={hint}
                    defaultValue={defaultValue}
                    onInput={(e:any)=> onInput(e.target.value)}
                />
                
                {
                    allowAttachments
                    ?   <AttachImageGallery onAttach={onAttach!} />
                    :   null
                }
            </div>
            <div className={styles.error}> { error } </div>
        </div>
    )
}