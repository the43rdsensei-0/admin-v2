import { useEffect } from "react";
import EmptyList from "../../../../../../components/Lists/EmptyList";
import { useGiftcardAssetState } from "../../../../../../features/assets/giftcard/atom";
import { useFetchGiftcardAssets } from "../../../../../../features/assets/giftcard/selectors";
import Giftcard from "./Giftcard";
import styles from "./giftcardlist.module.css";

export default function GiftcardList() {

    const [giftcardState, setGiftcardState] = useGiftcardAssetState();
    const giftcardAssetList:any = useFetchGiftcardAssets()

    useEffect(()=> {
        if(giftcardState.giftcards.length < giftcardAssetList.length) {
            setGiftcardState(state => {
                return {
                    ...state,
                    giftcards: giftcardAssetList,
                }
            })
        }

    }, [giftcardAssetList, setGiftcardState, giftcardState.giftcards])

    return (
        <div className={styles.gift_card_list}>
            {   
                (giftcardState.giftcards.length)
                ?   giftcardState.giftcards.map((giftcard:any) => {
                        return  <Giftcard
                                    key={giftcard.id}
                                    id={giftcard.id}
                                    active={giftcard.active}
                                    name={giftcard.name}
                                    imageURL={giftcard.imageURL}                              
                                    regions={giftcard.regions}
                                />
                    })
                :   <EmptyList message={"No giftcard asset to show"} />
            }
        </div>
    );
}