import { useState } from "react";
import styles from "./imageuploaderwrapper.module.css";
import {ReactComponent as IconTrash} from "../../../assets/icons/icon-trash.svg"

export default function ImageUploaderWrapper({children, squareDimension, saveImage}:{children: JSX.Element, squareDimension:number, saveImage:Function}) {

    const [selectedImages, setSelectedImages] = useState<Blob|MediaSource>();

    const saveAndPreviewFile = (event:any)=> {
        if(event.target.files[0]) {
            setSelectedImages(N=> event.target.files[0]);
            saveImage(event.target.files[0])
        }
    }

    return (
        <div className={styles.container}>
            {
                (selectedImages)
                ?   <IconTrash
                        className={styles.icon_trash} 
                        onClick={()=> setSelectedImages(N=> undefined)} 
                    /> 
                :null
            }
            <div className={styles.child_wrapper}>
                <label htmlFor="profile_picture">
                    {
                        (selectedImages)
                        ?   <img
                                src={URL.createObjectURL(selectedImages!)} 
                                alt="" 
                                style={{width: squareDimension, height: squareDimension}}
                                className={styles.image}
                            /> 
                        :   children 
                    }
                </label>
            </div>
            <input 
                type="file"
                id="profile_picture"
                accept="image/*"
                onChange={(e)=> saveAndPreviewFile(e)}
                hidden
            />
        </div>
    );
}