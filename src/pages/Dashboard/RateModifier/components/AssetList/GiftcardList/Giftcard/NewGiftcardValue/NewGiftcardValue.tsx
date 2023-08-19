import ModalContainer from "src/components/Modal/ModalContainer";
import styles from "./newgiftcardvalue.module.css";
import FormContainer from "src/components/Form/FormContainer";
import FormErrorModal from "src/components/Modal/FormError/FormErrorModal";
import FormSuccessModal from "src/components/Modal/FormSuccess";
import { useGiftcardAssetState } from "src/features/assets/giftcard/atom";
import PrimaryTextButton from "src/components/Buttons/PrimaryTextButton";
import { useState } from "react";
import { formFieldProps } from "src/components/Form/types";
import Capitalize from "src/utils/capitalize";
import InputField from "src/components/Form/InputField/inputfield";
import { createGiftcardRegionValueAction } from "src/features/assets/giftcard/actions";
import formatMultipleGiftcardAssets from "src/features/assets/giftcard/utils/formatMultipleGiftcardAssets";

export default function NewGiftcardValue({close}:{close:Function}) {

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

    const [regionModel] = useState<formFieldProps>({
        type:'text',
        label:'Asset name',
        name: 'asset-name',
        value: giftcardState.details.region.name,
        error:'',
        readOnly:true,
        validated: false
    });

    const [newValueAmuontModel, setNewValueAmountModel] = useState<formFieldProps>({
        type:'number',
        label:'Value amount',
        name: 'value-amount',
        value: '',
        error: '',
        validated: false
    })

    const [newValueRateInNairaModel, setNewValueRateInNairaModel] = useState<formFieldProps>({
        type:'number',
        label:'Value rate in naira',
        name: 'value-rate',
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
        if(!newValueAmuontModel.validated) return false;
        if(!newValueRateInNairaModel.validated) return false;

        return true;
    }

    function submitForm() {
        if(isFormValidated) {
            const payload = {
                amount: parseInt(newValueAmuontModel.value?.toString()!),
                rateInNaira: parseInt(newValueRateInNairaModel.value?.toString()!)
            }
            
            setGiftcardState(state => ({
                ...state,
                status: 'loading',
                message: '',
                error: false
            }))

            createGiftcardRegionValueAction(giftcardState.details.id, giftcardState.details.region.id, payload)
            .then((response)=> {
                setGiftcardState(state => ({
                    ...state,
                    giftcards: formatMultipleGiftcardAssets(response.data.giftcards),
                    status: "succeeded",
                    message: 'New giftcard asset added successfully',
                    error: false
                }))
            })
            .catch((error)=> {
                setGiftcardState(state => ({
                    ...state,
                    status: 'failed',
                    message: 'There was an error adding new giftcard asset',
                    error: false
                }))
            })
        }
    }

    return (
        <ModalContainer close={()=> close()} >
            <div className={styles.new_giftcard_value}>
                <FormContainer
                    formHeading="Add New Value"
                    extraStyle={styles.form_container}
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

                    <InputField 
                        type={regionModel.type!} 
                        label={regionModel.label}
                        value={regionModel.value}
                        error={regionModel.error}
                        readOnly={regionModel.readOnly}
                        onInput={()=> ({})}
                    />

                    <InputField 
                        type={newValueAmuontModel.type!} 
                        label={newValueAmuontModel.label}
                        value={newValueAmuontModel.value}
                        error={newValueAmuontModel.error}
                        readOnly={newValueAmuontModel.readOnly}
                        onInput={(value:string)=> setInput(value, newValueAmuontModel, setNewValueAmountModel)}
                    />

                    <InputField 
                        type={newValueRateInNairaModel.type!} 
                        label={newValueRateInNairaModel.label}
                        value={newValueRateInNairaModel.value}
                        error={newValueRateInNairaModel.error}
                        readOnly={newValueRateInNairaModel.readOnly}
                        onInput={(value:string)=> setInput(value, newValueRateInNairaModel, setNewValueRateInNairaModel)}
                    />


                    <PrimaryTextButton 
                        label="Submit value"
                        isLoading={giftcardState.status === 'loading'}
                        disabled={!isFormValidated}
                        action={()=> submitForm()}
                    />
                </FormContainer>
            </div>
        </ModalContainer>
    )
}