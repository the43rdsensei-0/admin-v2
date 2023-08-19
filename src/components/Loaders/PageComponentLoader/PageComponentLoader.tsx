import CircularRingLoader from "../CircularRingLoader";
import styles from "./pagecomponentloader.module.css";

export default function PageComponentLoader() {
    return (
        <div className={styles.loader_container}>
            <CircularRingLoader color={"var(--loader-orange-color)"} size={50} />
        </div>
    )
}