import { useEffect, useState } from "react";
import FormStateModal from "src/components/Modal/FormStateModal";
import { createCryptoRateAction } from "src/features/rate/actions";
import PrimaryTextButton from "../../../../../components/Buttons/PrimaryTextButton";
import FormContainer from "../../../../../components/Form/FormContainer";
import InputField from "../../../../../components/Form/InputField/inputfield";
import { formFieldProps } from "../../../../../components/Form/types";
import SizedBox from "../../../../../components/SizedBox";
import Wrapper from "../../../../../components/Wrapper";
import { useRateState } from "../../../../../features/rate/atom";
import { useFetchCryptoAssetRate } from "../../../../../features/rate/selectors";
import convertCurrency from "../../../../../utils/currencyConverter";
import CryptoAssetList from "../AssetList/CryptoAssetList";
import CryptoRateCategoryNav from "./CryptoRateCategoryNav";
import styles from "./cryptoratemodifier.module.css";

export default function CryptoRateModifier() {

    const cryptoRate = useFetchCryptoAssetRate();

    const [cryptoRateState, setCryptoRateState] = useRateState();

    const [selectedCategory, setSelectedCategory] = useState<'SELL'|'BUY'>('SELL')
    
    const toggleCategory =(input:'BUY'|'SELL')=> {

        setSelectedCategory(input)

        setAssetRateInNaira(state => {
            return {
                ...state,
                label:  input === 'SELL' 
                        ?   'Input new selling rate'
                        :   'Input new buying rate',
                value:  input === 'SELL' 
                        ?   cryptoRateState.rate.sell?.inNaira
                        :   cryptoRateState.rate.buy?.inNaira
            }
        })
    }

    const [assetRateInNaira, setAssetRateInNaira] = useState<formFieldProps>({
        type:'number',
        label:'Input asset rate in naira',
        error:'',
        validated:false
    });

    useEffect(()=> {

        setCryptoRateState(state => {
            return {
                ...state,
                rate: {
                    sell: {
                        inNaira: cryptoRateState.rate.sell?.inNaira || cryptoRate?.sell?.amount.inNaira
                    },
                    buy: {
                        inNaira: cryptoRateState.rate.buy?.inNaira || cryptoRate?.buy?.amount.inNaira
                    }
                }
            }
        })
        
        
        setAssetRateInNaira(state => {
            return {
                ...state,
                value:  selectedCategory === 'SELL' 
                        ?   (cryptoRateState.rate.sell?.inNaira || cryptoRate.sell?.amount.inNaira) 
                        :   (cryptoRateState.rate.buy?.inNaira || cryptoRate.buy?.amount.inNaira)
            }
        })

    }, [cryptoRate, cryptoRateState.rate.buy?.inNaira, cryptoRateState.rate.sell?.inNaira, selectedCategory, setCryptoRateState])

    const setInput = (inputValue:string, model:any, setModel:any)=> {
        model.value = inputValue;
        validateModel(model);
        setModel({...model});

        enableButton();
    }

    const validateModel = (updatedModel:any)=> {
        if(!parseFloat(updatedModel.value)) {
            updatedModel.error = `Please enter valid digits`;
            updatedModel.validated = false;
            return false;
        }

        updatedModel.error = "";
        updatedModel.validated = true;
        return true;
    }

    const enableButton = ()=> {
        if(validateForm()) SetIsFormValidated(true)
        else SetIsFormValidated(false)
    }

    const [isFormValidated, SetIsFormValidated] = useState(false);
    const validateForm = ()=> {
        if(!assetRateInNaira.validated) return false;

        return true;
    }

    const submitForm = ()=> {
        if(validateForm()) {
            const payload = {
                category: selectedCategory,
                inNaira: parseFloat(assetRateInNaira.value?.toString()!),
            }

            setCryptoRateState(state => {
                return {
                    ...state,
                    status: 'loading',
                    error: false,
                    message: ''
                }
            });

            createCryptoRateAction(payload)
            .then((data:any)=> {
                let newRate:any = {};
                if(data.category === 'BUY'){
                    newRate['buy'] = data.amount
                }
                if(data.category === 'SELL'){
                    newRate['sell'] = data.amount
                }

                
                setCryptoRateState(state => {
                    return {
                        activeCategory: data.category,
                        rate: {
                            ...state.rate,
                            ...newRate
                        },
                        status: 'succeeded',
                        error: false,
                        message: 'Crypto rate updated successfully'
                    }
                });

            })
            .catch((error)=> {
                console.log(error);
                setCryptoRateState(state => {
                    return {
                        ...state,
                        status: 'failed',
                        error: true,
                        message: error.message
                    }
                });
            })
        }
    }

    return (
        <Wrapper>
            <FormStateModal 
                state={cryptoRateState} 
                setState={setCryptoRateState} 
            />

            <div className={styles.rate_section}>
                <CryptoRateCategoryNav onNavigate={(selectedCategory:'SELL'|'BUY')=> toggleCategory(selectedCategory)} />

                <div className={styles.form}>
                    <FormContainer extraStyle={styles.rate_update_form} >
                        <InputField
                            prefixIcon={"₦"}
                            type={assetRateInNaira.type!}
                            label={assetRateInNaira.label!}
                            value={assetRateInNaira.value}
                            error={assetRateInNaira.error}
                            onInput={(inputValue:string)=> setInput(inputValue, assetRateInNaira, setAssetRateInNaira)}
                        />

                        <PrimaryTextButton 
                            label="Update"
                            isLoading={cryptoRateState.status === 'loading'}
                            disabled={!isFormValidated}
                            action={()=> submitForm()}
                        />
                    </FormContainer>

                    <SizedBox height={20} />

                    <div className={styles.current_rates}>
                        <div className={styles.heading}>Current rate</div>
                        <div className={`flex-display-row-space-between ${styles.rates}`}>
                            <div className={styles.rate}>
                                <div className={styles.amount}>
                                    {convertCurrency(selectedCategory === 'SELL' ?cryptoRateState.rate.sell?.inNaira :cryptoRateState.rate.buy?.inNaira, '₦', 2)} 
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <SizedBox height={40} />
        
            <CryptoAssetList />
        </Wrapper>
    );
}