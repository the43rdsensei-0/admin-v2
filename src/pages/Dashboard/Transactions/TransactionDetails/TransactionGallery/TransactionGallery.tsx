import { useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import GridList from "src/components/Lists/GridList";
import styles from "./transactiongallery.module.css";

export interface TransactionGalleryImage {
    url:string,
    placeholder?:string
}

export default function TransactionGallery({images}:{images:TransactionGalleryImage[]}) {

    const [inspectImage, setInspectImage] = useState({
        id:'',
        url: '',
        flagged: false,
        index: 0,
        placeholder: ''
    });

    return (
        <div className={styles.view_image_gallery_container}>
            
            {
                images?.length
                ?   <GridList columns={4}>
                        {
                            images.map((imageURL:any, index:number) => {
                                return  <div
                                            key={imageURL.url+index} 
                                            className={styles.image_container}
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
                :   null
            }

            {
                inspectImage.url
                ?   
                    <div className={styles.inspect_image_container} >

                        <div 
                            className={styles.overlay} 
                            onClick={()=> setInspectImage({
                                id:'',
                                url: '',
                                flagged: false, 
                                index: 0,
                                placeholder: '',
                            })}
                        ></div>

                        {
                            inspectImage.index > 0
                            ?   <FaAngleLeft 
                                    className={`${styles.nav_buttons} ${styles.left}`} 
                                    onClick={()=> {
                                        inspectImage.index--
                                        setInspectImage({...inspectImage});
                                    }} 
                                />
                            :   null
                        }

                        <div className={styles.inspect_image}>
                            <img 
                                src={images[inspectImage.index].url}
                                alt=""
                            />
                        </div>

                        {
                            inspectImage.index < images.length-1
                            ?   <FaAngleRight 
                                    className={`${styles.nav_buttons} ${styles.right}`} 
                                    onClick={()=> {
                                        inspectImage.index++
                                        setInspectImage({...inspectImage});
                                    }} 
                                />
                            :   null
                        }
                    
                    </div>

                :   null
            }
        </div>
    );
}