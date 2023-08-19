import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import IconButton from "../../../../../../../../../components/Buttons/IconButton/iconbutton";
import FormErrorModal from "../../../../../../../../../components/Modal/FormError/FormErrorModal";
import FormSuccessModal from "../../../../../../../../../components/Modal/FormSuccess";
import { deleteCryptoChannelAssetAction } from "../../../../../../../../../features/assets/crypto/actions";
import { useCryptoAssetState } from "../../../../../../../../../features/assets/crypto/atom";
import formatAllCryptoAssets from "../../../../../../../../../features/assets/crypto/utils/formatAllCryptoAssets";
import styles from "./cryptochannelcard.module.css";

export interface CryptoChannelCardProps {
    label?:string,
    assetId?:string,
    id:string,
    category:string,
    name:string,
    walletAddress: string,
    walletQrImage:string
}


export default function CryptoChannelCard({
    label, 
    assetId,
    id, 
    category, 
    name, 
    walletAddress, 
    walletQrImage
    
}:CryptoChannelCardProps) {

    const [cryptoAssetState, setCryptoAssetState] =  useCryptoAssetState()
    const [isFormLoading, setisFormLoading] = useState(false)

    const deleteChannel =(channelId:string)=> {
        setisFormLoading(true)

        deleteCryptoChannelAssetAction(assetId!, channelId)
        .then((updatedCryptoAsset:any)=> {

            const updatedCryptoAssets = cryptoAssetState.assets.map(crypto => {
                if(crypto.id === updatedCryptoAsset._id) return updatedCryptoAsset
                return crypto
            })

            setCryptoAssetState(() => {
                return {
                    assets: formatAllCryptoAssets(updatedCryptoAssets),
                    status:'succeeded',
                    error:false,
                    message: 'Crypto channel successfully deleted'
                }
            })

        })
        .catch((error)=> {
            console.log(error)
        })
        .finally(()=> {
            setisFormLoading(false)
        })
    }

    return (
        <div className={styles.crypto_channel_card}>

            <FormErrorModal 
                errorState={cryptoAssetState}
                setErrorState={setCryptoAssetState}
            />

            <FormSuccessModal 
                errorState={cryptoAssetState}
                setErrorState={setCryptoAssetState}
            />
            
            <div className={styles.channel_heading}>
                <div className={styles.channel_label}>{label}</div>
                {
                    <IconButton 
                        extraStyle={styles.delete_channel_wrapper}
                        prefixIcon={ <FaTrash className={styles.delete_channel} /> }
                        label={""} 
                        disabled={false} 
                        isLoading={isFormLoading}
                        loaderColor={"var(--crimson-accent-900)"}
                        onClick={()=> deleteChannel(id)}         
                    />
                }
            </div>

            <div className={styles.details}>
                <div className={styles.category}>
                    <div className={styles.title}>Type</div>
                    <div className={styles.content}>{ category }</div>
                </div>

                {
                    (category === 'specific')
                    ?   <div className={styles.category}>
                            <div className={styles.title}>Name</div>
                            <div className={styles.content}>{ name }</div>
                        </div>
                    :   null
                }
                
                <div className={`
                    ${styles.category}
                    ${styles.address}
                `}>
                    <div className={styles.addresses}>
                        <div className={styles.title}>Address</div>
                        <div className={styles.content}>{ walletAddress }</div>
                    </div>
                    <img src={walletQrImage} alt="" className={styles.address_image} />
                </div>
            </div>
        </div>
    )
}