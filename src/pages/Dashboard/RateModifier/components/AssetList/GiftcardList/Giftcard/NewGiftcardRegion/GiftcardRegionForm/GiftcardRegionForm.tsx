import styles from "./giftcardregionform.module.css";
import { useState } from "react";
import PrimaryTextButton from "../../../../../../../../../components/Buttons/PrimaryTextButton";
import FormContainer from "../../../../../../../../../components/Form/FormContainer";
import InputField from "../../../../../../../../../components/Form/InputField/inputfield";
import { formFieldProps } from "../../../../../../../../../components/Form/types";
import FormErrorModal from "../../../../../../../../../components/Modal/FormError/FormErrorModal";
import FormSuccessModal from "../../../../../../../../../components/Modal/FormSuccess";
import { createGiftcardRegionAction } from "../../../../../../../../../features/assets/giftcard/actions";
import { useGiftcardAssetState } from "../../../../../../../../../features/assets/giftcard/atom";
import Capitalize from "../../../../../../../../../utils/capitalize";
import JSONToFormData from "src/utils/JSONToFormData";
import ImageUploader from "src/components/Upload/ImageUploader";
import formatMultipleGiftcardAssets from "src/features/assets/giftcard/utils/formatMultipleGiftcardAssets";

export default function GiftcardRegionForm({extraStyle}:{extraStyle?:string}) {

    const [giftcardState, setGiftcardState] = useGiftcardAssetState();

    const [giftcardModel] = useState<formFieldProps>({
        type:'text',
        label:'Asset name',
        name: 'asset-name',
        value: Capitalize(giftcardState.details.name),
        error:'',
        readOnly:true,
        validated: false
    });

    const [newRegionFlag, setNewRegionFlag] = useState<{label:string, image?:Blob|MediaSource, error:string, validated:boolean}>({
        label:'Region flag',
        error:"",
        validated: false
    })

    const [newRegionNameModel, setNewRegionNameModel] = useState<formFieldProps>({
        type:'text',
        label:'Region name',
        name: 'region-name',
        value: '',
        error: '',
        validated: false
    })

    const [newRegionAbbrModel, setNewRegionAbbrModel] = useState<formFieldProps>({
        type:'text',
        label:'Region abbreviation',
        name: 'region-abbr',
        value: '',
        error: '',
        validated: false
    })
    
    const setInput = (inputValue:string, model:formFieldProps, setModel:React.Dispatch<React.SetStateAction<formFieldProps>>)=> {
        model.value = inputValue;   
        validateModel(model);
        setModel({...model})

        enableButton();
    }

    const validateModel = (updatedModel:formFieldProps)=> {
        if(!updatedModel.value) {
            updatedModel.error = 'Field cannot be empty';
            updatedModel.validated = false;
            return false;
        }

        updatedModel.error = '';
        updatedModel.validated = true;
        return true;
    }

    const saveImage = (image:Blob|MediaSource)=> {
        newRegionFlag.image = image;
        newRegionFlag.error = '';
        newRegionFlag.validated = true;

        setNewRegionFlag({...newRegionFlag})

        enableButton()
    }

    function deleteImage() {
        newRegionFlag.image = undefined;
        newRegionFlag.error = '';
        newRegionFlag.validated = false;

        setNewRegionFlag({...newRegionFlag})

        enableButton()
    }

    const enableButton = ()=> {
        if(validateForm()) {
            setIsFormValidated(true)
        }
        else {
            setIsFormValidated(false)
        }
    }

    const [isFormValidated, setIsFormValidated] = useState(false);
    function validateForm () {
        if(!newRegionFlag.validated) return false;
        if(!newRegionNameModel.validated) return false;
        if(!newRegionAbbrModel.validated) return false;

        return true;
    }

    const submitForm = ()=> {
        if(validateForm()) {
            const payload = {
                regionFlagImage: newRegionFlag.image,
                cardRegionName: newRegionNameModel.value?.toString()!,
                cardRegionAbbr: newRegionAbbrModel.value?.toString()!,
            }

            setGiftcardState(state => {
                return {
                    ...state,
                    status:'loading',
                    error: false,
                    message: ''
                }
            })

            JSONToFormData(payload)
            .then((formDataPayload)=> {
                createGiftcardRegionAction(giftcardState.details.id, formDataPayload)
                .then((data:any)=> {
                    setGiftcardState(state => {
                        return {
                            ...state,
                            giftcards: formatMultipleGiftcardAssets(data.assets),
                            status:'succeeded',
                            error: false,
                            message: 'Asset has been created successfully.'
                        }
                    })
                })
                .catch((error:any)=> {
                    setGiftcardState(state => {
                        return {
                            ...state,
                            status:'failed',
                            error: true,
                            message: error.message
                        }
                    })
                })
            })
        }
    }

    return (
        <FormContainer
            formHeading="Add New Region"
            extraStyle={`${styles.form_container} ${extraStyle}`}
        >

            <FormErrorModal 
                errorState={giftcardState}
                setErrorState={setGiftcardState}
            />

            <FormSuccessModal 
                errorState={giftcardState}
                setErrorState={setGiftcardState}
            />

            <InputField 
                type={giftcardModel.type!} 
                label={giftcardModel.label}
                value={giftcardModel.value}
                error={giftcardModel.error}
                readOnly={giftcardModel.readOnly}
                onInput={()=> ({})}
            />
            
            <ImageUploader 
                position="1"
                label={newRegionFlag.label} 
                error={newRegionFlag.error}
                saveImage={(image:Blob|MediaSource)=> saveImage(image)}
                deleteImage={()=> deleteImage()}
            />

            <InputField 
                type={newRegionNameModel.type!}
                label={newRegionNameModel.label}
                error={newRegionNameModel.error}
                onInput={(inputValue:string)=> setInput(inputValue, newRegionNameModel, setNewRegionNameModel)}
            />

            <InputField
                type={newRegionAbbrModel.type!}
                label={newRegionAbbrModel.label}
                error={newRegionAbbrModel.error}
                onInput={(inputValue:string)=> setInput(inputValue, newRegionAbbrModel, setNewRegionAbbrModel)}
            />

            {/* <InputField 
                type={cardValueModel.type!} 
                label={cardValueModel.label}
                error={cardValueModel.error}
                onInput={(inputValue:string)=> setInput(inputValue, cardValueModel, setCardValueModel)}
            />

            <InputField 
                type={rateInNairaModel.type!}
                prefixIcon={"N"} 
                label={rateInNairaModel.label}
                error={rateInNairaModel.error}
                onInput={(inputValue:string)=> setInput(inputValue, rateInNairaModel, setRateInNairaModel)}      
            /> */}

            <PrimaryTextButton 
                label="Add region"
                isLoading={giftcardState.status === 'loading'}
                disabled={!isFormValidated}
                action={()=> submitForm()}
            />
        </FormContainer>
    )
}