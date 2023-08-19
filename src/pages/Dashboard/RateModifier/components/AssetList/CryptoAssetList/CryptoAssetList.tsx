import { useEffect, useState } from "react";
import EmptyList from "../../../../../../components/Lists/EmptyList";
import GridList from "../../../../../../components/Lists/GridList";
import SizedBox from "../../../../../../components/SizedBox";
import TextHeading from "../../../../../../components/TextHeading";
import { useCryptoAssetState } from "../../../../../../features/assets/crypto/atom";
import { useFetchCryptoAssets } from "../../../../../../features/assets/crypto/selectors";
import Crypto from "./Crypto"
import styles from "./cryptoassetlist.module.css";

export default function CryptoAssetList() {

    const cryptoAssets:any = useFetchCryptoAssets();

    const [cryptoAssetsState, setCryptoAssetState] = useCryptoAssetState();

    useEffect(()=> {
        if(!cryptoAssetsState.assets.length) {
            setCryptoAssetState(state => {
                return {
                    ...state,
                    assets: cryptoAssets
                }
            })
        }
        setAllCryptoAssets(cryptoAssetsState.assets)

    }, [cryptoAssets, cryptoAssetsState.assets, setCryptoAssetState])

    const [allCryptoAssets, setAllCryptoAssets] = useState<any>([]);
    
    return (
        <div className={styles.crypto_asset_list_container}>
            
            <SizedBox height={20} />
            <GridList columns={4}>
                {   
                    allCryptoAssets.length
                    ?   cryptoAssetsState.assets.map((cryptoAsset:any)=> {
                            <TextHeading heading="All cryptocurrency assets" />
                            return  <Crypto
                                        key={cryptoAsset.id}
                                        id={cryptoAsset.id}
                                        active={cryptoAsset.active}
                                        name={cryptoAsset.name}
                                        label={cryptoAsset.label}
                                        imageURL={cryptoAsset.imageURL}
                                        shortCode={cryptoAsset.shortCode}
                                        channels={cryptoAsset.channels}
                                    />
                        })
                    :   <EmptyList message={"No crypto asset to show"} />
                }
            </GridList>
        </div>
    );
}