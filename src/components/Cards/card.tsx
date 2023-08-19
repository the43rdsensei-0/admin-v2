import styles from "./card.module.css";
import { CardProps } from "./types";

export default function Card({children, extraStyle}:CardProps) {
    return (
        <div className={`${styles.container} ${extraStyle}`}>
            {children}
        </div>
    );
}