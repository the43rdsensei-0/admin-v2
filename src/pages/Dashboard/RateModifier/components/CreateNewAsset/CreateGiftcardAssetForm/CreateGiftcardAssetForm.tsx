import { useState } from "react";
import PrimaryTextButton from "../../../../../../components/Buttons/PrimaryTextButton";
import InputField from "../../../../../../components/Form/InputField/inputfield";
import { formFieldProps } from "../../../../../../components/Form/types";
import FormErrorModal from "../../../../../../components/Modal/FormError/FormErrorModal";
import FormSuccessModal from "../../../../../../components/Modal/FormSuccess";
import ImageUploader from "../../../../../../components/Upload/ImageUploader";
import { createGiftcardAssetAction } from "../../../../../../features/assets/actions";
import { useAssetState } from "../../../../../../features/assets/atom";
import JSONToFormData from "../../../../../../utils/JSONToFormData";
import styles from "./creategiftcardassetform.module.css";

export default function CreateGiftcardAssetForm() {

    const [assetState, setAssetState] = useAssetState();

    const [cardCategory, setCardCategory] = useState<formFieldProps>({
        type:'text',
        label:'Card type',
        name:'card-type',
        value:'',
        error:'',
        validated: false
    })

    const [cardSubcategory, setCardSubcategory] = useState<formFieldProps>({
        type:'text',
        label:'Enter card sub-category',
        name:'card-sub-category',
        value:'',
        error:'',
        validated: false
    });

    const [cardRateInNaira, setCardRateInNaira] = useState<formFieldProps>({
        type:'number',
        label:'Card rate in naira',
        name:'card-rate-in-naira',
        value:'',
        error:'',
        validated: false
    });

    const [cardSubcategoryImage, setCardSubcategoryImage] = useState<{
        label:string, image?:Blob|MediaSource, error:string, validated:boolean
    }>({
        label:"Upload card subcategory image",
        error:"",
        validated: false
    })

    const saveImage = (image:Blob|MediaSource)=> {
        cardSubcategoryImage.image = image;
        cardSubcategoryImage.error = '';
        cardSubcategoryImage.validated = true;

        setCardSubcategoryImage({...cardSubcategoryImage})

        enableButton()
    }

    const setInput = (inputValue:string, model:formFieldProps, setModel:React.Dispatch<React.SetStateAction<formFieldProps>>)=> {
        model.value = inputValue;
        validateModel(model);
        setModel({...model})

        enableButton()
    }

    const validateModel = (updatedModel:formFieldProps)=> {
        if(!updatedModel.value) {
            updatedModel.error = "Field cannot be empty";
            updatedModel.validated = false;
            return false;
        }

        updatedModel.error = ""
        updatedModel.validated = true;
        return true;
    }

    const [isFormValidated, setIsFormValidated] = useState(false);

    const validateForm = ()=> {
        if(!cardCategory.validated) return false;
        if(!cardSubcategory.validated) return false;
        if(!cardRateInNaira.validated) return false;
        if(!cardSubcategoryImage.validated) return false;
        
        return true;
    }

    const enableButton = ()=> {
        if(validateForm()) setIsFormValidated(true);
        else setIsFormValidated(false)
    }

    const submitForm = ()=> {
        if(validateForm()) {
            const payload = {
                giftcardName: cardCategory.value,
                giftcardSubcategory: cardSubcategory.value,
                giftcardRateInNaira: parseFloat(cardRateInNaira.value?.toString()!),
                giftcardImage: cardSubcategoryImage.image
            }

            JSONToFormData(payload)
            .then((formData)=> {
                setAssetState(state => {
                    return {
                        ...state,
                        status: 'loading',
                        error: false,
                        message: ''
                    }
                })
    
                createGiftcardAssetAction(formData)
                .then((data:any)=> {
                    setAssetState(state => {
                        return {
                            ...state,
                            status: 'succeeded',
                            error: false,
                            message: 'New gift card has been created successfully'
                        }
                    })
                })
                .catch((error)=> {
                    setAssetState(state => {
                        return {
                            ...state,
                            status: 'failed',
                            error: true,
                            message: error.message
                        }
                    })
                    console.log(error)
                });
            })
            .catch((error)=> {
                console.log(error)
            })
        }
    }

    return (
        <div className={styles.container}>

            <FormErrorModal 
                errorState={assetState}
                setErrorState={setAssetState}
            />

            <FormSuccessModal 
                errorState={assetState}
                setErrorState={setAssetState}
            />

            <InputField 
                type={cardCategory.type!}
                label={cardCategory.label}
                error={cardCategory.error}      
                onInput={(inputValue:string) => setInput(inputValue, cardCategory, setCardCategory)} 
            />

            <InputField 
                type={cardSubcategory.type!}
                label={cardSubcategory.label}
                error={cardSubcategory.error}      
                onInput={(inputValue:string) => setInput(inputValue, cardSubcategory, setCardSubcategory)} 
            />

            <InputField
                prefixIcon={"N"}
                type={cardRateInNaira.type!}
                label={cardRateInNaira.label}
                error={cardRateInNaira.error}      
                onInput={(inputValue:string) => setInput(inputValue, cardRateInNaira, setCardRateInNaira)} 
            />

            <ImageUploader 
                position="1" 
                label={cardSubcategoryImage.label} 
                error={cardSubcategoryImage.error}
                saveImage={(image:Blob|MediaSource)=> saveImage(image)}
                deleteImage={()=> {

                    cardSubcategoryImage.image = undefined;
                    cardSubcategoryImage.error = 'Upload description image for card subcategory';
                    cardSubcategoryImage.validated = false;
                    setCardSubcategoryImage({...cardSubcategoryImage})

                    enableButton()
                }}
            />

            <PrimaryTextButton 
                label="Create Giftcard Asset"
                isLoading={assetState.status === 'loading'}
                disabled={!isFormValidated}
                action={()=> submitForm()}
            />
        </div>
    );
}