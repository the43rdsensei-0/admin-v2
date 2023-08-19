import { useState } from "react";
import { FaAngleLeft, FaAngleRight, FaFlag } from "react-icons/fa";
import { flagTransactionImageAction } from "src/features/transactions/actions";
import { useTransactionState } from "src/features/transactions/atom";
import formatTransaction from "src/features/transactions/utils/formatTransaction";
import { useUserStateValue } from "src/features/user/atom";
import IconButton from "../Buttons/IconButton/iconbutton";
import DataLoadingError from "../DataLoadingError";
import GridList from "../Lists/GridList";
import FormStateModal from "../Modal/FormStateModal";
import styles from "./viewimagegallery.module.css";

export interface TransactionImage {
    id:string,
    url:string,
    flagged:boolean
}

export default function ViewImageGallery({images}:{images:TransactionImage[]}) {

    const userState = useUserStateValue();
    const [transactionState, setTransactionState] = useTransactionState()

    const [flagTransactionState, setFlagTransactionState] = useState(transactionState)

    const [inspectImage, setInspectImage] = useState({
        id:'',
        url: '',
        flagged: false,
        index: 0,
    });

    const flagImage =(imageId:string, flagState:boolean)=> {
        setFlagTransactionState(state => {
            return {
                ...state,
                error: false,
                status: 'loading',
                message: ''
            }
        })

        const payload = {
            imageId,
            flagged: !flagState
        }

        flagTransactionImageAction(transactionState.details.id, payload)
        .then(async (response:any)=> {
            const formattedTxn = await formatTransaction(response?.transaction, userState.userData.role);

            setTransactionState(state => {
                return {
                    ...state,
                    details: formattedTxn
                }
            })

            setFlagTransactionState(state => {
                return {
                    ...state,
                    error: false,
                    status: 'succeeded',
                    message: `Image has been ${images[inspectImage.index].flagged ?"unflagged" :"flagged"} successfully`
                }
            })
        })
        .catch(()=> {
            setFlagTransactionState(state => {
                return {
                    ...state,
                    error: true,
                    status: 'failed',
                    message: 'There was an error flagging image, contact support'
                }
            })
        })
    }


    return (
        <div className={styles.view_image_gallery_container}>
            
            {
                images.length
                ?   <GridList columns={3}>
                        {
                            images.map((imageURL:TransactionImage, index:number) => {
                                return  <div
                                            key={imageURL.id} 
                                            className={`${styles.image_container} ${imageURL.flagged ?styles.flagged_image :null}`}
                                            onClick={()=> setInspectImage({ ...imageURL, index})}
                                        >
                                            <img 
                                                src={imageURL.url}
                                                alt=""
                                            />
                                        </div>
                            })
                        }
                    </GridList>
                :   <DataLoadingError message="No images were uploaded" />
            }

            {
                inspectImage.url
                ?   
                    <div className={styles.inspect_image_container} >
                        
                        <FormStateModal state={flagTransactionState} setState={setFlagTransactionState} />

                        <div 
                            className={styles.overlay} 
                            onClick={()=> setInspectImage({
                                id:'',
                                url: '',
                                flagged: false, 
                                index: 0
                            })}
                        ></div>

                        <div
                            className={`${styles.nav_buttons} ${styles.left} ${(inspectImage.index > 0) ?null :styles.disable_button}`} 
                            onClick={()=> {
                                if(inspectImage.index > 0) {
                                    inspectImage.index--
                                    setInspectImage({...inspectImage});
                                }
                            }}
                            children={<FaAngleLeft  />}
                        />

                        <div className={styles.inspect_image}>
                            <img 
                                src={images[inspectImage.index].url}
                                alt=""
                            />

                            <div className={styles.options}>
                                <IconButton 
                                    extraStyle={styles.flag_button}
                                    suffixIcon={<FaFlag />}
                                    label={images[inspectImage.index].flagged ?"Unflag" :"Flag"}
                                    isLoading={flagTransactionState.status === 'loading'}
                                    loaderColor="red"
                                    onClick={()=> flagImage(images[inspectImage.index].id, images[inspectImage.index].flagged)}
                                />
                            </div>
                        </div>

                        <div
                            className={`${styles.nav_buttons} ${styles.right} ${(inspectImage.index < images.length-1) ?null :styles.disable_button}`} 
                            onClick={()=> {
                                if(inspectImage.index < images.length-1) {
                                    inspectImage.index++
                                    setInspectImage({...inspectImage});
                                }}
                            }
                            children={<FaAngleRight />}
                        />
                    
                    </div>

                :   null
            }
        </div>
    );
}