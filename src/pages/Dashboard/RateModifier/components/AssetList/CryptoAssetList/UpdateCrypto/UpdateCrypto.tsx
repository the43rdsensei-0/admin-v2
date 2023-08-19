import { useState } from "react";
import DeleteTextButton from "../../../../../../../components/Buttons/DeleteTextButton";
import PrimaryTextButton from "../../../../../../../components/Buttons/PrimaryTextButton";
import FormContainer from "../../../../../../../components/Form/FormContainer";
import InputField from "../../../../../../../components/Form/InputField/inputfield";
import { formFieldProps, setFormFieldProps } from "../../../../../../../components/Form/types";
import FormErrorModal from "../../../../../../../components/Modal/FormError/FormErrorModal";
import FormSuccessModal from "../../../../../../../components/Modal/FormSuccess";
import ModalContainer from "../../../../../../../components/Modal/ModalContainer";
import SizedBox from "../../../../../../../components/SizedBox";
import ImageUploader from "../../../../../../../components/Upload/ImageUploader";
import { createCryptoAssetChannelAction, updateCryptoAssetAction } from "../../../../../../../features/assets/crypto/actions";
import { useCryptoAssetState } from "../../../../../../../features/assets/crypto/atom";
import JSONToFormData from "../../../../../../../utils/JSONToFormData";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import IconButton from "../../../../../../../components/Buttons/IconButton/iconbutton";
import CryptoChannelsList from "./CryptoChannelsList";
import styles from "./updatecrypto.module.css";
import formatAllCryptoAssets from "../../../../../../../features/assets/crypto/utils/formatAllCryptoAssets";
import CryptoChannelForm from "../../../CreateNewAsset/CreateCryptoAssetForm/CryptoChannelForm";
import RestoreTextButton from "../../../../../../../components/Buttons/RestoreTextButton";

export interface CryptoAssetProps {
    id:string,
    active:boolean,
    name:string,
    label:string,
    imageURL:string,
    shortCode:string,
    channels:{
        id:string,
        category:string,
        name:string,
        walletAddress: string,
        walletQrImage:string
    }[],
    close:Function
}

export default function UpdateCrypto({id, active, name, shortCode, imageURL, channels, close}:CryptoAssetProps) {

    const [cryptoAssetState, setCryptoAssetState] = useCryptoAssetState();
    const [updateCryptoAssetState, setUpdateCryptoAssetState] = useState(cryptoAssetState)
    const [createCryptoChannelAssetState, setCreateCryptoChannelAssetState] = useState(cryptoAssetState)
    const [deactivateCryptoAssetState, setDeactivateCryptoAssetState] = useState(cryptoAssetState)

    const [cryptoNameModel, setCryptoNameModel] = useState<formFieldProps>({
        type:'text',
        label:'Token name',
        name:'crypto-name-model',
        value: name,
        error:'',
        validated: false
    });

    const [shortCodeModel, setShortCodeModel] = useState<formFieldProps>({
        type:'text',
        label:'Short code',
        name:'crypto-short-code-model',
        value: shortCode,
        error:'',
        validated: false
    });

    const [imageModel, setImageModel] = useState<formFieldProps>({
        type:'text',
        label:'Upload asset image',
        name:'crypto-image-model',
        error:'',
        validated: false
    });

    const setInput =(newValue:string, model:formFieldProps, setModel:setFormFieldProps)=> {
        model.value = newValue;
        validateModel(model)
        setModel({...model})

        enableButton()
    }

    const validateModel = (updatedModel:formFieldProps)=> {
        if(!updatedModel.value) {
            updatedModel.error = "Field cannot be empty"
            updatedModel.validated = false;
            return false;
        }

        if(updatedModel.name === 'crypto-name-model') {
            if(updatedModel.value === name) {
                updatedModel.error = ""
                updatedModel.validated = false;
                return false;
            }
        }

        if(updatedModel.name === 'crypto-short-code-model') {
            if(updatedModel.value === shortCode) {
                updatedModel.error = ""
                updatedModel.validated = false;
                return false;
            }
        }

        updatedModel.error = ""
        updatedModel.validated = true;
        return true;
    }

    const enableButton = ()=> {
        if(validateForm()) setIsFormValidated(true)
        else setIsFormValidated(false)
    }

    const saveImage = (newImage:Blob|MediaSource)=> {
        imageModel.singleImage = newImage;
        if(imageModel.singleImage) imageModel.validated = true;
        setImageModel({...imageModel})
        enableButton()
    }

    const deleteImage = ()=> {
        imageModel.singleImage = undefined;
        setImageModel({...imageModel})
    }

    const [isFormValidated, setIsFormValidated] = useState(false);
    const validateForm = ()=> {
        let payload:any = {}

        if(cryptoNameModel.validated) {
            payload['name'] = cryptoNameModel.value;
        }
        if(shortCodeModel.validated) {
            payload['shortCode'] = shortCodeModel.value;
        }
        if(imageModel.validated) {
            payload['cryptoImage'] = imageModel.singleImage;
        }
        
        
        return  (!Object.values(payload).length)
                ?   { status:false }
                :   { status:true, payload: payload };
 
    }
    
    const submitForm = ()=> {
        const validation = validateForm();

        if(validation.status) {

            setUpdateCryptoAssetState(state => {
                return {
                    ...state,
                    status:'loading',
                    error:false,
                    message:''
                }
            })

            JSONToFormData(validation.payload)
            .then((formData:any)=> {
                updateCryptoAssetAction(id, formData)
                .then((updatedCrypto:any)=> {
                    
                    setUpdateCryptoAssetState(state => {
                        return {
                            ...state,
                            status:'succeeded',
                            error:false,
                            message:'Crypto asset updated successfully'
                        }
                    })

                    const updatedCryptoAssets = cryptoAssetState.assets.map(crypto => {
                        if(crypto.id === updatedCrypto._id) return updatedCrypto
                        return crypto
                    })

                    setCryptoAssetState({
                        assets: formatAllCryptoAssets(updatedCryptoAssets),
                        status: 'idle',
                        error: false,
                        message: 'Crypto assets successfully updated'
                    })
                })
                .catch((error)=> {
                    console.log(error)
                    setUpdateCryptoAssetState(state => {
                        return {
                            ...state,
                            status:'failed',
                            error:true,
                            message:error.message
                        }
                    })
                })
            })
        }
    }

    const deactivateAsset = (payload:{active:boolean})=> {
        setDeactivateCryptoAssetState(state => {
            return {
                ...state,
                status: 'loading',
                error:false,
                message:''
            }
        })

        JSONToFormData(payload)
        .then((formData:any)=> {
            updateCryptoAssetAction(id, formData)
            .then((updatedCrypto:any)=> {
                setDeactivateCryptoAssetState(state => {
                    return {
                        ...state,
                        status:'succeeded',
                        error:false,
                        message:'Crypto asset deactivated successfully'
                    }
                })

                const updatedCryptoAssets = cryptoAssetState.assets.map(crypto => {
                    if(crypto.id === updatedCrypto._id) return updatedCrypto
                    return crypto
                })

                setCryptoAssetState({
                    assets: formatAllCryptoAssets(updatedCryptoAssets),
                    status: 'idle',
                    error: false,
                    message: 'Crypto assets successfully updated'
                })
            })
            .catch((error)=> {
                console.log(error)
            })
        })
    }

    const [showCryptoChannel, setShowCryptoChannel] = useState(false)

    const [newChannelModel, setNewChannelModel] = useState({
        value:{category:'', name:'', walletAddress:'', walletQrImage:{} },
        validated: false
    });

    const saveChannel =(newChannel:any)=> {
        newChannelModel.value = newChannel
        validateChannel(newChannelModel);
        setNewChannelModel(newChannelModel)
        
        enableChannelFormButton()
    }

    const validateChannel = (newChannel:any)=> {
        if(!newChannel.value.category) {
            newChannel.validated = false;
            return false;
        }
        if(newChannel.value.category === 'specific' && !newChannel.value.name) {
            newChannel.validated = false;
            return false;

        }
        if(!newChannel.value.walletAddress) {
            newChannel.validated = false;
            return false;
        }
        if(!newChannel.value.walletQrImage) {
            newChannel.validated = false;
            return false;
        }
        
        newChannel.validated = true;
        return true;

    }

    const [isChannelFormValidated, setIsChannelFormValidated] = useState(false)

    const enableChannelFormButton = ()=> {
        if(newChannelModel.validated) setIsChannelFormValidated(true)
        else setIsChannelFormValidated(false)
    }

    const submitChannelsForm = ()=> {

        JSONToFormData(newChannelModel.value)
        .then((formData:any)=> {
            
            setCreateCryptoChannelAssetState(state => {
                return {
                    ...state,
                    status:'loading',
                    error:false,
                    message:''
                }
            });

            createCryptoAssetChannelAction(id, formData)
            .then((updatedCryptoAsset:any)=> {
                
                setCreateCryptoChannelAssetState(state => {
                    return {
                        ...state,
                        status:'succeeded',
                        message:'Crypto channels added successfully'
                    }
                });

                const updatedCryptoAssets = cryptoAssetState.assets.map(crypto => {
                    if(crypto.id === updatedCryptoAsset._id) return updatedCryptoAsset
                    return crypto
                })

                setCryptoAssetState(() => {
                    return {
                        assets: formatAllCryptoAssets(updatedCryptoAssets),
                        status:'succeeded',
                        error:false,
                        message:'Crypto channels added successfully'
                    }
                });
            })
            .catch((error)=> {
                setCreateCryptoChannelAssetState(state => {
                    return {
                        ...state,
                        status:'failed',
                        error:true,
                        message:error.message
                    }
                });
                console.log(error)
            })
        })
    }


    return (
        <ModalContainer close={()=> close()}>
            {
                !showCryptoChannel
                ?   <FormContainer formHeading="Update Crypto">


                        <FormErrorModal 
                            errorState={updateCryptoAssetState || deactivateCryptoAssetState}
                            setErrorState={setUpdateCryptoAssetState || setDeactivateCryptoAssetState}
                        />

                        <FormSuccessModal 
                            errorState={updateCryptoAssetState || deactivateCryptoAssetState}
                            setErrorState={setUpdateCryptoAssetState || setDeactivateCryptoAssetState}
                        />
                            
                        <InputField 
                            type={cryptoNameModel.type!}
                            label={cryptoNameModel.label}
                            value={cryptoNameModel.value}
                            error={cryptoNameModel.error}
                            onInput={(inputValue:string)=> setInput(inputValue, cryptoNameModel, setCryptoNameModel)}
                        />

                        <InputField 
                            type={shortCodeModel.type!}
                            label={shortCodeModel.label}
                            value={shortCodeModel.value}
                            error={shortCodeModel.error}
                            onInput={(inputValue:string)=> setInput(inputValue, shortCodeModel, setShortCodeModel)}
                        />

                        <ImageUploader 
                            position={"1"} 
                            label={imageModel.label}
                            defaultImageLink={imageURL}
                            error={imageModel.error}
                            saveImage={(image:Blob|MediaSource)=> saveImage(image)}
                            deleteImage={()=> deleteImage()}
                        />

                        <CryptoChannelsList
                            cryptoAssetId={id}
                            channels={channels}
                        />

                        <SizedBox height={80} />

                        <div className={styles.buttons}>
                            <PrimaryTextButton 
                                label={"Update asset"} 
                                isLoading={updateCryptoAssetState.status === 'loading'}
                                disabled={!isFormValidated}
                                action={()=> submitForm()}                    
                            />

                            {
                                active
                                ?   <DeleteTextButton 
                                        label={"Deactivate asset"} 
                                        isLoading={deactivateCryptoAssetState.status === 'loading'}
                                        action={()=> deactivateAsset({active: false})}                    
                                    />

                                :   <RestoreTextButton 
                                        label={"Activate asset"}
                                        isLoading={deactivateCryptoAssetState.status === 'loading'}
                                        action={()=> deactivateAsset({active: true})}                    
                                    />
                            }

                            <IconButton
                                extraStyle={styles.add_new_channels_button}
                                label="Add new channels"
                                suffixIcon={<FaAngleRight />}
                                isLoading={false}
                                disabled={false} 
                                onClick={()=> setShowCryptoChannel(true)}
                            />
                        </div>

                    </FormContainer>

                :   <FormContainer formHeading="Add New Channel">

                        <FormErrorModal 
                            errorState={createCryptoChannelAssetState}
                            setErrorState={setCreateCryptoChannelAssetState}
                        />

                        <FormSuccessModal 
                            errorState={createCryptoChannelAssetState}
                            setErrorState={setCreateCryptoChannelAssetState}
                        />
                        
                        <CryptoChannelForm
                            submit={(newChannel:any)=> saveChannel(newChannel)}
                        />
                        
                        <SizedBox height={30} />

                        <div className={styles.buttons}>
                            <IconButton
                                extraStyle={styles.go_back_btn}
                                prefixIcon={<FaAngleLeft />}
                                label="Go back"
                                disabled={false}
                                isLoading={false}
                                onClick={()=> {
                                    setIsChannelFormValidated(false)
                                    setShowCryptoChannel(false)
                                }}
                            />

                            <PrimaryTextButton
                                label="Submit new channels"
                                isLoading={createCryptoChannelAssetState.status === 'loading'}
                                disabled={!isChannelFormValidated}
                                action={()=> submitChannelsForm()}
                            />
                        </div>
                    </FormContainer>
                
            }
        </ModalContainer>
    )
}