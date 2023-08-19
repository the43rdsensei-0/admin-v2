import styles from "./banners.module.css";
import { useEffect, useState } from "react";
import { ImageUploaderFormType } from "src/components/Upload/ImageUploader/ImageUploader";
import { uploadAdvertismentBannerAction, uploadAnnouncementBannerAction } from "src/features/announcements/actions";
import { useAnnouncementState } from "src/features/announcements/atom";
import JSONToFormData from "src/utils/JSONToFormData";
import { useFetchAdvertismentBanner, useFetchAnnouncementBanner } from "src/features/announcements/selectors";
import FormStateModal from "src/components/Modal/FormStateModal";
import ImageUploader from "src/components/Upload/ImageUploader";
import AnnouncementBanner from "src/components/banners/AnnouncementBanner";
import AdBanner from "src/components/banners/AdBanner";
import PrimaryTextButton from "src/components/Buttons/PrimaryTextButton";

export default function Banners() {
    
    const [bannerState] = useAnnouncementState();

    const [announcementBannerState, setAnnouncementBannerState] = useState(bannerState);

    const [adBannerState, setAdBannerState] = useState(bannerState);

    const announcementBannerResponse:any = useFetchAnnouncementBanner();
    const advertismentBannerResponse:any = useFetchAdvertismentBanner();

    useEffect(()=> {
        
        if(announcementBannerResponse.code === 200) {
            setAnnouncementBannerModel(state => {
                return {
                    ...state,
                    image: announcementBannerResponse.banner?.imageURL || "",
                    placeholder: announcementBannerResponse.banner?.imagePlaceholderURL || ""
                }
            })
        }

        if(advertismentBannerResponse.code === 200) {
            setAdBannerModel(state => {
                return {
                    ...state,
                    image: advertismentBannerResponse.banner?.imageURL || "",
                    placeholder: advertismentBannerResponse.banner?.imagePlaceholderURL || ""
                }
            })
        }
    }, [announcementBannerResponse, advertismentBannerResponse])

    const [announcementBannerModel, setAnnouncementBannerModel] = useState<ImageUploaderFormType>({
        name: "announcement-banner",
        label: "Upload announcement banner",
        error:"", 
        validated: false
    })

    const [adBannerModel, setAdBannerModel] = useState<ImageUploaderFormType>({
        name: "ad-banner",
        label: "Upload advertisement banner",
        error:"", 
        validated: false
    })

    const saveImage = (selectedImage:Blob|MediaSource, model:ImageUploaderFormType, setModel:Function)=> {
        model.image = selectedImage;
        model.validated = true;
        setModel({...model});
    }

    const uploadAnnouncementBanner = ()=> {
        if(announcementBannerModel.validated) {
            const payload = {
                announcementBannerImage: announcementBannerModel.image!
            }
            
            JSONToFormData(payload)
            .then((formDataPayload:FormData)=> {
                setAnnouncementBannerState({
                    error: false,
                    message: '',
                    status: 'loading',
                })
    
                uploadAnnouncementBannerAction(formDataPayload)
                .then(()=> {
                    setAnnouncementBannerState({
                        error: false,
                        message: 'Announcement banner uploaded successfully',
                        status: 'succeeded',
                    })
                })
                .catch((error)=> {
                    console.log(error)
                    setAnnouncementBannerState({
                        error: false,
                        message: error.message || 'There was an error uploading announcement banner uploaded successfully',
                        status: 'failed',
                    })
                })
                .finally(()=> {
                    setTimeout(()=> {
                        setAnnouncementBannerState(state => {
                            return {
                                ...state,
                                status:'idle',
                                error:false,
                                message:''
                            }
                        })
                    }, 3000)
                })
            })
        }
    }

    const uploadAdsBanner = ()=> {
        if(adBannerModel.validated) {
            const payload = {
                advertismentBannerImage: adBannerModel.image!
            }

            setAdBannerState({
                error: false,
                message: '',
                status: 'loading',
            })

            JSONToFormData(payload)
            .then((formDataPayload:FormData)=> {
                uploadAdvertismentBannerAction(formDataPayload)
                .then(()=> {
                    setAdBannerState({
                        error: false,
                        message: 'Advertisment banner uploaded successfully',
                        status: 'succeeded',
                    })
                })
                .catch(()=> {
                    setAdBannerState({
                        error: true,
                        message: 'There was an error uploading advertisment banner',
                        status: 'failed',
                    })
                })
                .finally(()=> {
                    setTimeout(()=> {
                        setAdBannerState(state => {
                            return {
                                ...state,
                                status:'idle',
                                error:false,
                                message:''
                            }
                        })
                    }, 3000)
                })
            })
        }
    }
    
    

    return (
        <div>
            <FormStateModal 
                state={ announcementBannerState }
                setState={ setAnnouncementBannerState }
            />

            <FormStateModal 
                state={ adBannerState }
                setState={ setAdBannerState }
            />

<div className={styles.ads_banner_section}>
                <div className={styles.upload_component}>
                    <ImageUploader 
                        position={announcementBannerModel.name}
                        label={announcementBannerModel.label}
                        defaultImageLink={announcementBannerModel.image?.toString()!} 
                        error={announcementBannerModel.error}
                        saveImage={(image:Blob|MediaSource)=> saveImage(image, announcementBannerModel, setAnnouncementBannerModel)}
                        deleteImage={()=> {
                            announcementBannerModel.image = announcementBannerResponse?.banner.imageURL;
                            announcementBannerModel.validated = false;
                            setAnnouncementBannerModel({...announcementBannerModel});
                        }}
                    >
                        <AnnouncementBanner />
                    </ImageUploader>

                    <PrimaryTextButton 
                        label="Upload Image" 
                        isLoading={announcementBannerState.status === 'loading'}
                        disabled={announcementBannerModel.validated === false}
                        action={()=> uploadAnnouncementBanner()}
                    />
                </div>

                <div className={styles.upload_component}>
                    <ImageUploader 
                        position={adBannerModel.name}
                        label={adBannerModel.label}
                        error={adBannerModel.error}
                        saveImage={(image:Blob|MediaSource)=> saveImage(image, adBannerModel, setAdBannerModel)}
                        deleteImage={()=> {
                            adBannerModel.image = advertismentBannerResponse?.banner.imageURL;
                            adBannerModel.validated = false;
                            setAdBannerModel({...adBannerModel});
                        }}
                    >
                        <AdBanner />
                    </ImageUploader>

                    <PrimaryTextButton 
                        label="Upload Image" 
                        isLoading={adBannerState.status === 'loading'}
                        disabled={adBannerModel.validated === false}
                        action={()=> uploadAdsBanner() }
                    />
                </div>
            </div>
        </div>
    );
}