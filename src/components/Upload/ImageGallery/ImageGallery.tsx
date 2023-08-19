import styles from "./imageupload.module.css";
import uploadFileSVG from "../../../assets/images/upload-files.svg"
import {ReactComponent as IconTrash} from "../../../assets/icons/icon-trash.svg"
import { useState } from "react";
import { FaPlus } from "react-icons/fa";

export default function ImageGallery (props: {
    label?:string,
    error:string,
    onSelected: Function
}) {
    

    const [allSelectedImages, setSelectedFile] = useState<Array<Blob|MediaSource>>([]);
    const [imagePreviewIndex, setImagePreviewIndex] = useState<number>();

    const saveAndPreviewFile = (event:any)=> {
        if(event.target.files[0]) {
            allSelectedImages.unshift(event.target.files[0]);
            setSelectedFile([...allSelectedImages]);
            previewImage(0);

            props.onSelected(allSelectedImages);
        }
    }

    const previewImage = (imageIndex:number)=> {
        if(allSelectedImages[imageIndex]) {
            setImagePreviewIndex(imageIndex)
            return;
        }
        else {
            if(allSelectedImages[imageIndex + 1]) {
                setImagePreviewIndex(imageIndex + 1)
                return;
            }
            if(allSelectedImages[imageIndex - 1]) { 
                setImagePreviewIndex(imageIndex - 1)
                return;
            }
        }
    }

    const deleteImage = (imageIndex:number)=> {
        allSelectedImages.splice(imageIndex, 1);
        setSelectedFile([...allSelectedImages]);
        previewImage(imageIndex);
        props.onSelected(allSelectedImages);
    }

    return (
        <div className={styles.container}>
            <div className={styles.label}>{ props.label }</div>
            <div className={styles.image_upload_wrapper}>
            {
                allSelectedImages.length > 0
                ?   <ImageContainer 
                        imageIndex={imagePreviewIndex}
                        imageFile={allSelectedImages[imagePreviewIndex!]}
                        enableTrash={true}
                        trashImage={(imageIndex:number)=> deleteImage(imageIndex)}
                    />
                :   <label htmlFor="profile_picture">
                        <div className={styles.placeholder_wrapper}>
                            <img 
                                src={uploadFileSVG} 
                                alt="upload file svg" 
                                className={styles.upload_file_svg} 
                            />
                            <div className={styles.prompt}>Click to upload image</div>
                        </div>
                    </label>
            }
            </div>
            
            <input 
                type="file"
                id="profile_picture"
                accept="image/*"
                onChange={(e)=> saveAndPreviewFile(e)}
                hidden
            />

            {
                allSelectedImages.length
                ?   <div className={styles.gallery}>
                        <label htmlFor="profile_picture">
                            <div className={styles.add_image}>
                                <FaPlus />
                            </div>
                        </label>
                        {   
                            allSelectedImages.map((selectedImage, index) => {
                                return  <div 
                                            key={`selectedImage.toString()__${index}`}
                                            className={styles.gallery_image}
                                            onClick={()=> previewImage(index)}
                                        >
                                            <ImageContainer imageFile={selectedImage} />
                                        </div> 
                            })
                        }
                    </div>
                :   null
            }
            <div className={styles.error}>{props.error}</div>
        </div>
    );
}

function ImageContainer (props:{
    imageFile:Blob|MediaSource,
    enableTrash?:boolean,
    trashImage?:Function,
    imageIndex?:Number
}) {
    return (
        <div className={styles.image_evidence_wrapper}>
            { props.enableTrash ?<IconTrash className={styles.icon_trash} onClick={()=> props.trashImage?.(props.imageIndex)} /> :null }
            <img src={URL.createObjectURL(props.imageFile)} alt="" />
        </div>
    );
}