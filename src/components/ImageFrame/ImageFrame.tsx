import { useState } from "react";
import Image from "../Image/Image";
import styles from "./imageframe.module.css";

export default function ImageFrame({id, url, placeholder}:{id:string, url:string, placeholder:string}) {

    const [isInspect, setIsInspect] = useState(false)
    const inspect =()=> setIsInspect(true)


    return(
        <div 
            key={id} 
            className={styles.image_frame}
        >
            <Image
                extraStyle={styles.preview_image}
                src={url}
                placeholder={placeholder}
                action={()=> inspect()}
            />
            
            {
                isInspect
                ?   <div className={styles.inspect_image}>
                        <div 
                            className={styles.image_overlay}
                            onClick={()=> setIsInspect(false)}
                        ></div>
                        <img
                            className={styles.enlarged_image}
                            src={url}
                            alt=""
                        />
                    </div>
                :   null

            }
        </div>
    )
}