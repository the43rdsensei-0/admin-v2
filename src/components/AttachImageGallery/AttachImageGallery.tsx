import { useState } from "react";
import { FaTimesCircle, FaTrashAlt } from "react-icons/fa";
import { deleteTransactionNoteImageAction } from "src/features/transactions/actions";
import { useTransactionState } from "src/features/transactions/atom";
import Image from "../Image";
import CircularRingLoader from "../Loaders/CircularRingLoader";
import FormStateModal from "../Modal/FormStateModal";
import AttachImageButton from "./AttachImageButton/AttachImageButton";
import styles from "./attachimagegallery.module.css";
import ImageUploader from "./ImageUploader";

export default function AttachImageGallery({onAttach}:{onAttach:Function}) {

    const [transactionState, setTransactionState] = useTransactionState()

    const [selectedImages, setSelectedImages] = useState<any[]>([]);

    const [ImageLoaders, setImageLoaders] = useState<boolean[]>(Array.apply(null, Array(transactionState.details.note.images.length)).map(()=> false));

    const saveFile = (event:any)=> {
        if(event.target.files[0]) {
            selectedImages.unshift(event.target.files[0]);
            setSelectedImages([...selectedImages]);
            onAttach(selectedImages)
        }
    }

    const deleteImage = (index:number)=> {
        selectedImages.splice(index, 1);
        setSelectedImages([...selectedImages])
    }

    const deleteNoteImage = (url:string, index:number)=> {
        
        ImageLoaders[index] = true;
        setImageLoaders({...ImageLoaders})

        deleteTransactionNoteImageAction(transactionState.details.id, {imageUrl: url})
        .then(()=> {
            ImageLoaders[index] = false;
            setImageLoaders({...ImageLoaders})
        })
        .catch((error)=> {
            setTransactionState(state => {
                return {
                    ...state,
                    error: true,
                    status: 'idle',
                    message: "There was an error deleting image attachment, try again. If problem persists, please contact support."
                }
            })
        })
    }


    return (
        <div className={styles.attach_image_gallery}>

            <FormStateModal 
                state={transactionState}
                setState={setTransactionState}
            />

            <ImageUploader
                child={<AttachImageButton />}
                submitFile={(event:any)=> saveFile(event)}
            />

            <div className={styles.all_selected_images}>
                {
                    selectedImages.length
                    ?   selectedImages.map((image, index) => {
                            return  <div 
                                        key={image + index}
                                        className={styles.img_container}
                                    >
                                        <FaTimesCircle className={styles.delete_image} onClick={()=> deleteImage(index)} />
                                        <Image 
                                            src={URL.createObjectURL(image)} 
                                            placeholder={URL.createObjectURL(image)}
                                            extraStyle={styles.image_file}
                                        />
                                    </div>
                        })
                    :   null
                }
            </div>

            <div className={styles.all_selected_images}>
                {
                    transactionState.details.note.images.length
                    ?   transactionState.details.note.images.map((image:any, index:number) => {
                            return  <div 
                                        key={image + index}
                                        className={styles.img_container}
                                    >
                                        {
                                            ImageLoaders[index]
                                            ?   <CircularRingLoader color="red" />
                                            :   <FaTrashAlt 
                                                    className={styles.trash_delete_image} 
                                                    onClick={()=> deleteNoteImage(image.url, index)} 
                                                />
                                        }

                                        <Image 
                                            src={image.url} 
                                            placeholder={image.placeholder}
                                            extraStyle={styles.image_file}
                                        />
                                    </div>
                        })
                    :   null
                }
            </div>
        </div>
    );
}