import styles from "./textheading.module.css";

export default function TextHeading({heading}:{heading:string}) {
    return (
        <div className={styles.heading}> { heading } </div>
    );
}