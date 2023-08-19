import styles from "./attachimagebutton.module.css";
import {ReactComponent as IconPaperClip} from "src/assets/icons/icon-paperclip.svg";

export default function AttachImageButton() {
    return (
        <div 
            className={styles.attach_image_button_container} 
        >
            <IconPaperClip className={styles.attach_image_button_icon} />
            <div className={styles.label}>Add attachment</div>
        </div>
    )
}