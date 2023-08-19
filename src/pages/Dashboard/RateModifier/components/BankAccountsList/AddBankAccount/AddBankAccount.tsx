import { useState } from "react"
import PrimaryTextButton from "src/components/Buttons/PrimaryTextButton"
import FormContainer from "src/components/Form/FormContainer"
import InputField from "src/components/Form/InputField/inputfield"
import { formFieldProps, setFormFieldProps } from "src/components/Form/types"
import FormStateModal from "src/components/Modal/FormStateModal"
import ModalContainer from "src/components/Modal/ModalContainer"
import { createBankAccountAction } from "src/features/assets/bankAccounts/action"
import { useBankAccountState } from "src/features/assets/bankAccounts/atom"
import formatBankAccountList from "src/features/assets/bankAccounts/utils/formatBankAccountList"
import styles from "./addbankaccount.module.css"

export default function AddBankAccount({close}:{close:Function}) {

    const [bankAccountState, setBankAccountState] = useBankAccountState();

    const [accountNumber, setAccountNumber] = useState<formFieldProps>({
        type:'text',
        label: 'Account number',
        error:'',
        validated:false
    })

    const [accountName, setAccountName] = useState<formFieldProps>({
        type:'text',
        label: 'Account name',
        error:'',
        validated:false
    })

    const [bankName, setBankName] = useState<formFieldProps>({
        type:'text',
        label: 'Bank name',
        error:'',
        validated:false
    })

    const saveInput = (inputValue:string, model:formFieldProps, setModel:setFormFieldProps)=> {
        model.value = inputValue;
        validateModel(model)
        setModel({...model})

        enableButton()
    }

    const validateModel = (updatedModel:formFieldProps)=> {
        if(!updatedModel.value) {
            updatedModel.validated = false;
            updatedModel.error = 'Field cannot be empty'
            return;
        }

        updatedModel.validated = true;
        updatedModel.error = ''
        return;
    }

    const [isFormValid, setIsFormValid] = useState(false);

    const enableButton = ()=> {
        if(bankName.validated && accountName.validated && accountNumber.validated) {
            setIsFormValid(true);
        } else setIsFormValid(false);
    }

    const submitBank = ()=> {
        const payload = {
            bankName: bankName.value,
            accountNumber: accountNumber.value,
            accountName: accountName.value
        }

        setBankAccountState(state => {
            return {
                ...state,
                status:'loading',
                error:false,
                message:''
            }
        })

        createBankAccountAction(payload)
        .then((response:any)=> {
            setBankAccountState(state => {
                return {
                    ...state,
                    assets: formatBankAccountList(response.accounts),
                    status:'succeeded',
                    error:false,
                    message:'New account added successfully'
                }
            })
        })
        .catch((error)=> {
            setBankAccountState(state => {
                return {
                    ...state,
                    status:'failed',
                    error:false,
                    message:'There was an error adding account'
                }
            })
        })
    }

    return (
        <div className={styles.add_bank_account}>
            <ModalContainer close={()=> close()}>
                <FormContainer formHeading="Add bank account">

                    <FormStateModal 
                        state={bankAccountState}
                        setState={setBankAccountState}
                    />

                    <InputField
                        label={bankName.label}
                        error={bankName.error}
                        onInput={(inputValue:string)=> saveInput(inputValue, bankName, setBankName)}
                    />
                    <InputField
                        label={accountNumber.label}
                        error={accountNumber.error}
                        onInput={(inputValue:string)=> saveInput(inputValue, accountNumber, setAccountNumber)}
                    />
                    <InputField
                        label={accountName.label}
                        error={accountName.error}
                        onInput={(inputValue:string)=> saveInput(inputValue, accountName, setAccountName)}
                    />

                    <PrimaryTextButton 
                        label={"Add bank"}
                        isLoading={bankAccountState.status === 'loading'}
                        disabled={!isFormValid}
                        action={()=> submitBank()}
                    />
                </FormContainer>
            </ModalContainer>
        </div>
    )
}