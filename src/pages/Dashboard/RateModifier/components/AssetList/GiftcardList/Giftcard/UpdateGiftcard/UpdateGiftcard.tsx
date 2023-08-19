import { useState } from "react";
import DeleteTextButton from "../../../../../../../../components/Buttons/DeleteTextButton";
import PrimaryTextButton from "../../../../../../../../components/Buttons/PrimaryTextButton";
import RestoreTextButton from "../../../../../../../../components/Buttons/RestoreTextButton";
import FormContainer from "../../../../../../../../components/Form/FormContainer";
import InputField from "../../../../../../../../components/Form/InputField/inputfield";
import { formFieldProps } from "../../../../../../../../components/Form/types";
import FormErrorModal from "../../../../../../../../components/Modal/FormError/FormErrorModal";
import FormSuccessModal from "../../../../../../../../components/Modal/FormSuccess";
import ModalContainer from "../../../../../../../../components/Modal/ModalContainer";
import { deactivateGiftcardAction, updateGiftcardAction } from "../../../../../../../../features/assets/giftcard/actions";
import { useGiftcardAssetState } from "../../../../../../../../features/assets/giftcard/atom";
import Capitalize from "../../../../../../../../utils/capitalize";
import formatMultipleGiftcardAssets from "src/features/assets/giftcard/utils/formatMultipleGiftcardAssets";

export default function UpdateGiftcard({currentGiftcard, close}:{currentGiftcard:{id:string, active:boolean, label:string}, close: Function}) {

    const [giftcardState, setGiftcardState] = useGiftcardAssetState();

    const [GiftcardModel, setGiftcardModel] = useState<formFieldProps>({
        type:'text',
        label:'Card name',
        value:'',
        error:'',
        validated:false
    });
    
    const setInput = (inputValue:string, model:formFieldProps, setModel:React.Dispatch<React.SetStateAction<formFieldProps>>)=> {
        model.value = inputValue;
        validateModel(model);
        setModel({...model});

        enableButton();
    }

    const validateModel = (updatedModel:formFieldProps)=> {
        if(!updatedModel.value) {
            updatedModel.error = 'Field cannot be empty';
            updatedModel.validated = false;
            return false;
        }
        
        if(updatedModel.value.toString().toLowerCase() === currentGiftcard.label.toLowerCase()) {
            updatedModel.error = '';
            updatedModel.validated = false;
            return false;
        }

        updatedModel.error = '';
        updatedModel.validated = true;
        return true;
    }
    
    const enableButton = ()=> {
        if(validateForm()) setIsFormValidated(true)
        else setIsFormValidated(false)     
    }

    const [isFormValidated, setIsFormValidated] = useState(false);

    const validateForm = ()=> {
        if(!GiftcardModel.validated) return false;
        return true;
    }

    const [updateGiftcardState, setUpdateGiftcardState] = useState(giftcardState)
    const submitForm = ()=> {
        if(validateForm()) {
            const payload = {
                name: GiftcardModel.value
            }

            setUpdateGiftcardState(state => {
                return {
                    ...state,
                    status: 'loading',
                    error: false,
                    message: ''
                }
            })

            updateGiftcardAction(currentGiftcard.id, payload)
            .then((updatedGiftcard:any)=> {
                setUpdateGiftcardState(state => {
                    return {
                        ...state,
                        status: 'succeeded',
                        error: false,
                        message: 'Giftcard successfully updated'
                    }
                })

                const updatedGiftcards = giftcardState.giftcards.map(giftcard => {
                    if(giftcard.id === updatedGiftcard._id) return updatedGiftcard
                    return giftcard
                })

                setGiftcardState(state => {
                    return {
                        ...state,
                        giftcards: formatMultipleGiftcardAssets(updatedGiftcards),
                        status: 'succeeded',
                        error: false,
                        message: 'Giftcard successfully updated'
                    }
                })
            })
            .catch((error)=> {
                setUpdateGiftcardState(state => {
                    return {
                        ...state,
                        status: 'failed',
                        error: false,
                        message: error.message
                    }
                })
                setGiftcardState(state => {
                    return {
                        ...state,
                        status: 'failed',
                        error: false,
                        message: error.message
                    }
                })
            })
        }
    }

    const [deactivateGiftcardState, setDeactivateGiftcardState] = useState(giftcardState)
    const deactivateGiftcard = ()=> {

        setDeactivateGiftcardState(state => {
            return {
                ...state,
                status: 'loading',
                error: false,
                message: ''
            }
        })
        
        deactivateGiftcardAction(currentGiftcard.id, {active: !currentGiftcard.active})
        .then((updatedGiftcard:any)=> {

            setDeactivateGiftcardState(state => {
                return {
                    ...state,
                    status: 'succeeded',
                    error: false,
                    message: 'Giftcard category successfully deactivated'
                }
            })

            const updatedGiftcards = giftcardState.giftcards.map(giftcard => {
                if(giftcard.id === updatedGiftcard._id) return updatedGiftcard
                return giftcard
            })

            setGiftcardState(state => ({
                ...state,
                giftcards: formatMultipleGiftcardAssets(updatedGiftcards),
                status: 'succeeded',
                error: false,
                message: 'Giftcard category successfully deactivated'
            }))
        })
        .catch((error)=> {
            setDeactivateGiftcardState(state => {
                return {
                    ...state,
                    status: 'failed',
                    error: true,
                    message: error.message
                }
            })  
            
            setGiftcardState(state => {
                return {
                    ...state,
                    status: 'failed',
                    error: true,
                    message: error.message
                }
            })    
        })
    }


    return (
        <ModalContainer close={()=> close()}>
            <FormContainer formHeading="Edit Giftcard Category">
                <FormErrorModal 
                    errorState={giftcardState}
                    setErrorState={setGiftcardState}
                />

                <FormSuccessModal 
                    errorState={giftcardState}
                    setErrorState={setGiftcardState}
                />
                
                <InputField 
                    type={GiftcardModel.type!}
                    label={GiftcardModel.label}
                    value={Capitalize(currentGiftcard.label)}
                    onInput={(inputValue:string)=> setInput(inputValue, GiftcardModel, setGiftcardModel)}
                />

                <div className={"twin_buttons"}>
                    <PrimaryTextButton 
                        label="Rename"
                        isLoading={updateGiftcardState.status === 'loading'}
                        disabled={!isFormValidated}
                        action={()=> submitForm()}
                    />

                    {
                        (currentGiftcard.active)
                        ?   <DeleteTextButton 
                                label="Deactivate group"
                                isLoading={deactivateGiftcardState.status === 'loading'}
                                action={()=> deactivateGiftcard()}
                            />

                        :   <RestoreTextButton 
                                label="Activate group"
                                isLoading={deactivateGiftcardState.status === 'loading'}
                                action={()=> deactivateGiftcard()}
                            />
                    }
                </div>
            </FormContainer>
        </ModalContainer>
    )
}