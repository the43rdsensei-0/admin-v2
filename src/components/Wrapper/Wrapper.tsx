import styles from "./wrapper.module.css";

export default function Wrapper({children}:{children:JSX.Element|JSX.Element[]}) {
    return (
        <div className={styles.component_wrapper}>
            { children }
        </div>
    );
}