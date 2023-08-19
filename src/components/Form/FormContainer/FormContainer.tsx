import styles from "./formcontainer.module.css";

export default function FormContainer({formHeading, extraStyle, children}:{formHeading?:string, extraStyle?:any, children:JSX.Element|JSX.Element[]}) {
    return (
        <form 
            className={`${styles.form_container} ${extraStyle!}`}
            onSubmit={(e)=> e.preventDefault()}
        > 
            {(formHeading) ?<div className={styles.form_title}>{ formHeading }</div> :null }
            { children } 
        </form>
    );
}