import { useState } from "react";
import Image from "src/components/Image";
import {ReactComponent as IconTrash} from "../../../assets/icons/icon-trash.svg"
import uploadFileSVG from "../../../assets/images/upload-files.svg"
import styles from "./imageuploader.module.css";

export interface ImageUploaderFormType {
    label:string,
    name:string,
    image?:Blob|MediaSource, 
    placeholder?:string,
    error:string, 
    validated:boolean
}

export interface ImageUploaderProps {
    position:string,
    label: string,
    children?: JSX.Element, 
    defaultImageLink?: string,
    placeholder?:string,
    error:string,
    saveImage:Function
    deleteImage:Function
}

export default function ImageUploader({
    position,
    label,
    children,
    defaultImageLink,
    placeholder,
    error,
    saveImage,
    deleteImage
}:ImageUploaderProps) {

    const [selectedImages, setSelectedImages] = useState<Blob|MediaSource>();

    const saveAndPreviewFile = (event:any)=> {
        if(event.target.files[0]) {
            setSelectedImages(N=> event.target.files[0]);
            saveImage(event.target.files[0])
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.label}>{ label }</div>
            {
                (selectedImages)
                ?   <IconTrash
                        className={styles.icon_trash} 
                        onClick={()=> {
                            deleteImage();
                            setSelectedImages(N=> undefined)
                        }} 
                    /> 
                :null
            }

            <div className={styles.child_wrapper}>
                <label htmlFor={`profile_picture${position}`}>
                    {
                        (selectedImages)
                        ?   <img
                                src={URL.createObjectURL(selectedImages!)} 
                                alt="" 
                                className={styles.image}
                            /> 
                        :   children
                            ?   children
                            :   defaultImageLink
                                ?   <Image 
                                        src={defaultImageLink} 
                                        placeholder={placeholder!} 
                                        width={100} 
                                        height={100}                                        
                                    />
                                    
                                :   <div className={styles.placeholder_wrapper}>
                                        <img 
                                            src={uploadFileSVG} 
                                            alt="upload file svg" 
                                            className={styles.upload_file_svg} 
                                        />
                                        <div className={styles.prompt}>Click to upload image</div>
                                    </div> 
                    }
                </label>
            </div>
            
            <input 
                type="file"
                id={`profile_picture${position}`}
                accept="image/*"
                onChange={(e)=> saveAndPreviewFile(e)}
                hidden
            />

            <div className={styles.error}> { error } </div>
        </div>
    );
}