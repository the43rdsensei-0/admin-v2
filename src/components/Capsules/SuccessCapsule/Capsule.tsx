import styles from "./capsule.module.css";

export default function Capsule (status:string) {

    const detStyle = (status:string)=> {
        switch (status){
            case "successful": return styles.success
            case "failed": return styles.failed
            case "pending": return styles.pending
        }
    }

    return (
        <div className={styles.container}>
            <div className={detStyle(status)}>
                { status }
            </div>
        </div>
    );
}