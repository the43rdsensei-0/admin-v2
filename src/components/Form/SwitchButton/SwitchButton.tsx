import { useState } from "react";
import styles from "./switchbutton.module.css";

export default function SwitchButton({label, onToggle}:{label:string, onToggle:Function}) {

    const [switchState, setSwitchState] = useState(false);

    const toggle = ()=> {
        setSwitchState(!switchState);
        onToggle(!switchState);
    }

    return (
        <div className={styles.switch_button_container}>
            <div className={styles.label}>{ label }</div>

            <div className={styles.switch_button_wrapper} onClick={()=> toggle()}>
                <div 
                    className={`${styles.switch} ${switchState ?styles.on :styles.off} `}
                ></div>
            </div>
        </div>
    );
}