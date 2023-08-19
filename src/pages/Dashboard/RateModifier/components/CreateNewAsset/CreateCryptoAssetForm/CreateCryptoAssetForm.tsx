import { useState } from "react";
import PrimaryTextButton from "../../../../../../components/Buttons/PrimaryTextButton";
import DropDownField from "../../../../../../components/Form/DropDownField/dropdownfield";
import { DropDownFormData, setDropDownFormData } from "../../../../../../components/Form/DropDownField/types";
import InputField from "../../../../../../components/Form/InputField/inputfield";
import { formFieldProps } from "../../../../../../components/Form/types";
import FormErrorModal from "../../../../../../components/Modal/FormError/FormErrorModal";
import FormSuccessModal from "../../../../../../components/Modal/FormSuccess";
import SizedBox from "../../../../../../components/SizedBox";
import ImageUploader from "../../../../../../components/Upload/ImageUploader";
import { ImageUploaderFormType } from "../../../../../../components/Upload/ImageUploader/ImageUploader";
import { createCryptoAssetAction } from "../../../../../../features/assets/actions";
import { useCryptoAssetState } from "../../../../../../features/assets/crypto/atom";
import { useRateStateValue } from "../../../../../../features/rate/atom";
import convertCurrency from "src/utils/currencyConverter";
import JSONToFormData from "src/utils/JSONToFormData";
import styles from "./createcryptoassetform.module.css";
import formatCryptoAsset from "../../../../../../features/assets/crypto/utils/formatCryptoAsset";

export default function CreateCryptoAssetForm() {

    const [cryptoAssetState, setCryptoAssetState] = useCryptoAssetState();
    const [createCryptoAssetState, setCreateCryptoAssetState] = useState(cryptoAssetState);
    
    const rateStateValue = useRateStateValue();

    const [tokenName, setTokenName] = useState<formFieldProps>({
        type:'text',
        label:"Token name",
        hint:"eg. Bitcoin",
        value:"",
        error:''
    });

    const [shortCode, setShortCode] = useState<formFieldProps>({
        type:'text',
        label:"Short code",
        hint:"eg. BTC",
        value:"",
        error:''
    });

    const [channelTypeModel, setChannelTypeModel] = useState<DropDownFormData>({
        label: 'Channel type',
        name:'channel-type',
        error:'',
        options:[
            {
                id:'1',
                label:'Generic',
                value:'generic'
            },
            {
                id:'2',
                label:'Specific',
                value:'specific'
            }
        ],
        selected:false,
        selectedOptionIndex:0
    });

    const [channelNameModel, setChannelNameModel] = useState<formFieldProps>({
        type:'text',
        label:'Name',
        name:'channel-name',
        error:''
    })
    
    const [walletAddressHashModel, setWalletAddressHashModel] = useState<formFieldProps>({
        type:'text',
        label:'Wallet address',
        name:'wallet-address',
        error:''
    })

    const [walletQrImageModel, setWalletQrImageModel] = useState<ImageUploaderFormType>({
        label:"Upload card subcategory image",
        name:'wallet-image',
        error:"",
        validated: false
    })

    const [assetImage, setAssetImage] = useState<ImageUploaderFormType>({
        label: 'Upload asset image',
        name:'asset-image',
        error: '',
        validated:false
    });

    const setInput = (inputValue:string, model:any, setModel:any )=> {
        model.value = inputValue;
        validateModel(model);
        setModel({...model})
        
        enableButton();
    }

    const selectOption = (optionIndex:number, model:DropDownFormData, setModel:setDropDownFormData)=> {
        model.value = model.options[optionIndex]
        model.selected = true;
        model.selectedOptionIndex = optionIndex;
        setModel({...model})

        enableButton()
    }

    const saveImage = (image:any, model:any, setModel:any) => {
        model.image = image;
        model.validated = true;
        setModel({...model});

        enableButton();
    }

    const validateModel = (updatedModel:any)=> {
        if(updatedModel.value === '') {
            updatedModel.error = 'Field cannot be empty'
            updatedModel.validated = false;
            return false;
        }

        updatedModel.error = ''
        updatedModel.validated = true;
        return true;
    }

    const enableButton = ()=> {
        if(validateForm()) setIsFormValidated(true)
        else setIsFormValidated(false)
    }

    const [isFormValidated, setIsFormValidated] = useState(false);

    const validateForm = ()=> { 
        if(!tokenName.validated) return false;
        if(!shortCode.validated) return false;
        if(!channelTypeModel.selected) return false;
        if(channelTypeModel.value?.value === 'specific' && !channelNameModel.value) return false;
        if(!walletAddressHashModel.value) return false;
        if(!walletQrImageModel.image) return false;
        if(!assetImage.validated) return false; 
        
        return true;
    }

    const createCryptoAsset = ()=> {
        if(validateForm()) {
            const payload = {
                assetType:'crypto',
                cryptoName:tokenName.value,
                cryptoShortCode: shortCode.value,
                channelCategory: channelTypeModel.value?.value,
                channelName: (channelTypeModel.value?.value === 'specific') ?channelNameModel.value :'',
                channelWalletAddress: walletAddressHashModel.value,
                channelWalletQrImage: walletQrImageModel.image,
                cryptoImage: assetImage.image
            }

            JSONToFormData(payload)
            .then((formData:any)=> {
                setCreateCryptoAssetState((state) => {
                    return {
                        ...state,
                        status: 'loading',
                        error: false,
                        message:''
                    }
                });
                
                createCryptoAssetAction(formData)
                .then((newCryptoAsset:any)=> {
                    setCreateCryptoAssetState((state) => {
                        return {
                            ...state,
                            status: 'succeeded',
                            error: false,
                            message:'Asset has been created successfully'
                        }
                    });

                    const formattedNewCrypto = formatCryptoAsset(newCryptoAsset);

                    setCryptoAssetState(state => {
                        return {
                            ...state,
                            assets: [
                                formattedNewCrypto,
                                ...cryptoAssetState.assets
                            ]
                        }
                    })

                })
                .catch((error)=> {
                    setCreateCryptoAssetState((state) => {
                        return {
                            ...state,
                            status: 'failed',
                            error: true,
                            message:error.message
                        }
                    });
                    console.log(error);
                })
            })
            .catch((error)=> {
                console.log('There was an error converting payload to formdata', error);
            })

        }
    }

    return (
        <div className={styles.container}>

            <FormErrorModal errorState={createCryptoAssetState} setErrorState={setCreateCryptoAssetState}/>

            <FormSuccessModal errorState={createCryptoAssetState} setErrorState={setCreateCryptoAssetState}/>

            <InputField 
                type={tokenName.type!}
                hint={tokenName.hint}
                label={tokenName.label}
                error={tokenName.error}
                onInput={(inputValue:string)=> setInput(inputValue, tokenName, setTokenName)}
            />

            <SizedBox height={30} />

            <InputField
                type={shortCode.type!}
                hint={shortCode.hint}
                label={shortCode.label}
                error={shortCode.error}
                onInput={(inputValue:string)=> setInput(inputValue, shortCode, setShortCode)}
            />

            <SizedBox height={30} />

            <DropDownField 
                label={channelTypeModel.label}
                options={channelTypeModel.options}
                selected={channelTypeModel.selected}
                selectedOptionIndex={channelTypeModel.selectedOptionIndex}
                error={channelTypeModel.error}
                onSelect={(selectedIndex:any)=> selectOption(selectedIndex, channelTypeModel, setChannelTypeModel)}
            />

            {
                channelTypeModel.value?.value === 'specific'
                ?   <InputField 
                        type={channelNameModel.type!}
                        label={channelNameModel.label}
                        error={channelNameModel.error}
                        onInput={(inputValue:string)=> setInput(inputValue, channelNameModel, setChannelNameModel)}
                    />
                :   null
            }

            <InputField 
                type={walletAddressHashModel.type!}
                label={walletAddressHashModel.label}
                error={walletAddressHashModel.error}
                onInput={(inputValue:string)=> setInput(inputValue, walletAddressHashModel, setWalletAddressHashModel)}
            />

            <ImageUploader
                position={"channelQrImage"}
                label={walletQrImageModel.label}
                error={walletQrImageModel.error}
                saveImage={(image:Blob|MediaSource)=> saveImage(image, walletQrImageModel, setWalletQrImageModel)}
                deleteImage={()=> {
                    walletQrImageModel.image = undefined;
                    setWalletQrImageModel({...walletQrImageModel});
                }}
            />

            <SizedBox height={30} />

            <InputField
                type={'text'}
                label={"Current rate"}
                value={convertCurrency(rateStateValue.rate.sell.inNaira, '₦', 2)}
                prefixIcon={"₦"}
                readOnly={true}
                onInput={()=> {}}
            />

            <SizedBox height={30} />

            <ImageUploader
                position="assetimage"
                label={assetImage.label}
                error={assetImage.error}
                saveImage={(images:any)=> saveImage(images, assetImage, setAssetImage)}
                deleteImage={()=> {
                    setAssetImage(state => {
                        return {
                            ...state,
                            error: 'Image field cannot be empty',
                            singleImage: undefined,
                            validated:false
                        }
                    })
                }}
            />

            <SizedBox height={40} />

            <PrimaryTextButton
                label="Create Asset"
                isLoading={createCryptoAssetState.status === 'loading'}
                disabled={!isFormValidated}
                action={()=> createCryptoAsset()}
            />
        </div>
    );
}