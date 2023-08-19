import { ReactComponent as IconEdit } from "../../../../../../../assets/icons/icon-edit.svg"
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import NewGiftcardRegion from "./NewGiftcardRegion";
import { useState } from "react";
import UpdateGiftcard from "./UpdateGiftcard";
import styles from "./giftcard.module.css";
import GiftcardRegionCard from "./GiftcardRegionCard";
import { useGiftcardSetState } from "src/features/assets/giftcard/atom";

export interface giftcardProps {
    id:string,
    active:boolean,
    name:string,
    imageURL:string
    regions:{
        id:string,
        active:boolean,
        flagImageURL:string;
        name:string;
        abbr:string;
        values:Array<{
            id:string;
            active:boolean;
            amount:number;
            rate:{
                inNaira:number;
                inDollars:number;
            }
        }>;
    }[],
}


export default function Giftcard({id, active, name, imageURL, regions}:giftcardProps) {
    
    const setGiftcardState = useGiftcardSetState();

    const [showNewRegionForm, setShowNewRegionForm] = useState(false);
    const [showUpdateGiftcardForm, setShowUpdateGiftcardForm] = useState(false);

    const [isCategoryOpen, setIsCategoryOpen] = useState(true)

    const toggleGiftcardExpand = ()=> {
        setIsCategoryOpen(!isCategoryOpen)
    }

    return (
        <div 
            className={`
                ${styles.gift_card_container}
                ${!active ?styles.in_active :null}
                ${isCategoryOpen ?null :styles.close_category}
            `} 
        >
            <div className={styles.gift_card_details}>

                {
                    isCategoryOpen
                    ?   <FaAngleDown 
                            className={styles.minimize_button} 
                            onClick={()=> toggleGiftcardExpand()}
                        />
                    :   <FaAngleUp
                            className={styles.minimize_button} 
                            onClick={()=> toggleGiftcardExpand()}
                        />
                }
                
                <img 
                    src={imageURL}
                    alt=""
                    className={styles.gift_card_image}
                />

                <div className={styles.gift_card_name}>{name}</div>

                <div 
                    className={styles.edit_button}
                    children={<IconEdit />}
                    onClick={()=> setShowUpdateGiftcardForm(true)}
                />

                <div 
                    className={styles.add_region_btn}
                    children={"Add Region"}
                    onClick={()=> {
                        
                        setGiftcardState(state => ({
                            ...state,
                            details: {
                                ...state.details,
                                id: id,
                                name: name
                            }
                        }))

                        setShowNewRegionForm(true)
                    }}
                />
            </div>

            {
                isCategoryOpen
                ?   <div className={styles.gift_card_regions}>
                        {
                            regions.map(region => {
                                return  <GiftcardRegionCard 
                                            key={region.id}
                                            cardId={id}
                                            cardName={name}
                                            regionId={region.id}
                                            active={region.active}
                                            flagImageURL={region.flagImageURL} 
                                            name={region.name} 
                                            abbr={region.abbr}                               
                                            values={region.values} 
                                        />
                            })
                        }
                    </div>
                :   null
            }

            {
                (showNewRegionForm)
                ?   <NewGiftcardRegion close={()=> setShowNewRegionForm(false)}  />
                :   null
            }

            {
                (showUpdateGiftcardForm)
                ?   <UpdateGiftcard 
                        currentGiftcard={{
                            id:id,
                            active:active,
                            label:name
                        }}
                        close={()=> setShowUpdateGiftcardForm(false)} 
                    />
                :   null
            }
        </div>
    )
}