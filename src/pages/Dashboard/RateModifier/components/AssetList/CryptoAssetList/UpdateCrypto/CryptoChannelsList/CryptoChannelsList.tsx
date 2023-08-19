import CryptoChannelCard from "./CryptoChannelCard";
import { CryptoChannelCardProps } from "./CryptoChannelCard/CryptoChannelCard";
import styles from "./cryptochannelslist.module.css";


export default function CryptoChannelsList({cryptoAssetId, channels}:{cryptoAssetId:string, channels:CryptoChannelCardProps[]}) {

    return (
        <div>
            <div className={styles.container_label}> Existing channels </div>
            {
                channels.map((cryptoChannel, index)=> {

                    const groupLabel = "Channel #"+ ++index;
                    
                    return  <CryptoChannelCard 
                                key={cryptoChannel.id}
                                assetId={cryptoAssetId}
                                id={cryptoChannel.id}
                                label={groupLabel}
                                category={cryptoChannel.category}
                                name={cryptoChannel.name}
                                walletAddress={cryptoChannel.walletAddress}
                                walletQrImage={cryptoChannel.walletQrImage}
                            />
                })
            }
        </div>
    );
}