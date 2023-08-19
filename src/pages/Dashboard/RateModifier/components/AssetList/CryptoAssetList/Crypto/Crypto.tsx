import { useState } from "react";
import AssetImage from "../../../../../../../components/AssetImage";
import SizedBox from "../../../../../../../components/SizedBox";
import UpdateCrypto from "../UpdateCrypto";
import styles from "./crypto.module.css";

export interface CryptoProps {
    id:string,
    active:boolean,
    name:string,
    label:string,
    imageURL:string,
    shortCode:string,
    channels:any[]
}

export default function Crypto({id, active, name, label, imageURL, shortCode, channels}:CryptoProps){

    const [showUpdateCryptoForm, setShowUpdateCryptoForm] = useState(false)
    
    return (
        <div className={styles.crypto_asset}>
            <div
                className={`${styles.crypto_details} ${(!active) ?styles.inactive :null}`}
                onClick={()=> setShowUpdateCryptoForm(true)}
            >
                { AssetImage(imageURL, 30) }

                <SizedBox width={10} />
                
                <div className={styles.asset_label}> 
                    <div className={styles.asset_name}>{name}</div>
                    <div className={styles.asset_code}>{shortCode}</div>
                </div>
            </div>

            {
                (showUpdateCryptoForm)
                ?   <UpdateCrypto
                        id={id}
                        active={active}
                        name={name}
                        label={label}
                        imageURL={imageURL}
                        shortCode={shortCode}
                        channels={channels}
                        close={()=> setShowUpdateCryptoForm(false)} 
                    />
                :   null
            }
        </div>
    );
}