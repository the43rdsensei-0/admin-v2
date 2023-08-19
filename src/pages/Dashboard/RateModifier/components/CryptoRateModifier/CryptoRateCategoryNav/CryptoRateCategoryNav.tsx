import { useState } from "react";
import styles from "./cryptoratecategorynav.module.css";

export default function CryptoRateCategoryNav({onNavigate}:{onNavigate:Function}) {

    const [options, setOptions] = useState([
        {
            id:'SELL',
            label:'Buying rate',
            active: true
        },
        {
            id:'BUY',
            label:'Selling rate',
            active: false
        }
    ])

    const toggle = (index:number)=> {
        options.forEach(option => option.active = false)
        options[index].active = true;
        setOptions(options)

        onNavigate(options[index].id)
    }

    return (
        <div className={styles.capsule_btn_navigation}>
           {
                options.map((option, index) => {
                    return  <div 
                                key={option.id}
                                className={`${styles.option} ${option.active ?styles.active :null}`} 
                                onClick={()=> toggle(index)}
                            >
                                { option.label }
                            </div>
                })
           }
        </div>
    )
}