import { useState } from "react";
import DropDownField from "../../../../../components/Form/DropDownField/dropdownfield";
import { DropDownProps } from "../../../../../components/Form/DropDownField/types";
import FormContainer from "../../../../../components/Form/FormContainer";
import ModalContainer from "../../../../../components/Modal/ModalContainer";
import CreateCryptoAssetForm from "./CreateCryptoAssetForm";
import CreateGiftcardAssetForm from "./CreateGiftcardAssetForm";
import styles from "./createnewasset.module.css";

export default function CreateNewAsset({close}:{close:Function}) {

    const [assetType, setAssetType] = useState<DropDownProps>({
        label: 'Select Asset Type',
        options:[
            {
                id: '1',
                label: 'Cryptocurrency',
                type:'option'
            },
            {
                id: '2',
                label: 'Giftcard',
                type:'option'
            }
        ],
        selected: true,
        selectedOptionIndex: 0,
        error: ''
    });

    const selectOption = (selectedIndex:number)=> { 
        setAssetType(state => {
            return {
                ...state,
                value: state.options?.[selectedIndex],
                selected: true,
                selectedOptionIndex: selectedIndex,
                error: ''
            }
        })
    }

    const assetFormData = {
        type: assetType.options?.[assetType.selectedOptionIndex!].label
    }

    return (
        <ModalContainer close={()=> close()}>
            <FormContainer formHeading="Add new asset" extraStyle={styles.form_container} >
                <DropDownField
                    label={assetType.label}
                    options={assetType.options!}
                    selected={assetType.selected!}
                    selectedOptionIndex={assetType.selectedOptionIndex!}
                    error={assetType.error}
                    onSelect={(selectedIndex:number)=> selectOption(selectedIndex)}
                />

                {
                    (assetFormData.type?.toString().toLowerCase() === 'cryptocurrency')
                    ? <CreateCryptoAssetForm />
                    : <CreateGiftcardAssetForm />
                }

                
            </FormContainer>
        </ModalContainer>
    );
}