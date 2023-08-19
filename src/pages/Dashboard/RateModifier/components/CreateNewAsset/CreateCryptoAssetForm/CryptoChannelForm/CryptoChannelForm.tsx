import { useState } from "react";
import DropDownField from "../../../../../../../components/Form/DropDownField/dropdownfield";
import { DropDownFormData } from "../../../../../../../components/Form/DropDownField/types";
import InputField from "../../../../../../../components/Form/InputField/inputfield";
import { formFieldProps, setFormFieldProps } from "../../../../../../../components/Form/types";
import ImageUploader from "../../../../../../../components/Upload/ImageUploader";
import { ImageUploaderFormType } from "../../../../../../../components/Upload/ImageUploader/ImageUploader";
import styles from "./cryptochannelform.module.css";

export default function CryptoChannelForm({submit}:{submit:Function}) {

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

    const saveChannelType = (index:number)=> {
        channelTypeModel.value = channelTypeModel.options[index];
        channelTypeModel.selected = true;
        channelTypeModel.selectedOptionIndex = index;
        
        validateModel(channelTypeModel)
        setChannelTypeModel({...channelTypeModel});

        submitChannel()
    }


    const saveInput = (newValue:string, model:formFieldProps, setModel:setFormFieldProps)=> {
        model.value = newValue;
        validateModel(model);
        setModel({...model})
        
        submitChannel()
    }

    const validateModel = (updatedModel:any) => {
        if(!updatedModel.value) {
            updatedModel.error = 'Field cannot be empty';
            updatedModel.validated = false;
            return false;
        }

        if(updatedModel.name === 'channel-type') {
            if(!updatedModel.selected) {
                updatedModel.error = "Please select a category"
                return false; 
            }
        }

        if(updatedModel.name === 'channel-name') {
            if(channelTypeModel.value?.value === 'specific') {
                if(!updatedModel.value) {
                    updatedModel.error = "Please enter name of category"
                    updatedModel.validated = false;
                    return false; 
                }
            }
        }

        if(updatedModel.name === 'wallet-image') {
            if(updatedModel.image) {
                updatedModel.error = "Please select an image"
                updatedModel.validated = false;
                return false; 
            }
        }

        updatedModel.error = '';
        updatedModel.validated = true;
        return true;
    }

    const saveImage = (newImage:Blob|MediaSource)=> {
        walletQrImageModel.image = newImage;
        walletQrImageModel.validated = true;
        validateModel({...walletQrImageModel})
        setWalletQrImageModel(walletQrImageModel)

        submitChannel()
    }

    const submitChannel =()=> {
        const payload = {
            category: channelTypeModel.value?.value,
            name:channelNameModel.value,
            walletAddress:walletAddressHashModel.value,
            walletQrImage:walletQrImageModel.image
        }

        submit(payload)
    }

    return (
        <div className={styles.channel_field_group} >

            <DropDownField 
                label={channelTypeModel.label}
                options={channelTypeModel.options}
                selected={channelTypeModel.selected}
                selectedOptionIndex={channelTypeModel.selectedOptionIndex}
                error={channelTypeModel.error}
                onSelect={(selectedIndex:any)=> saveChannelType(selectedIndex)}
            />

            {
                channelTypeModel.value?.value === 'specific'
                ?   <InputField 
                        type={channelNameModel.type!}
                        label={channelNameModel.label}
                        error={channelNameModel.error}
                        onInput={(inputValue:string)=> saveInput(inputValue, channelNameModel, setChannelNameModel)}
                    />
                :   null
            }

            <InputField 
                type={walletAddressHashModel.type!}
                label={walletAddressHashModel.label}
                error={walletAddressHashModel.error}
                onInput={(inputValue:string)=> saveInput(inputValue, walletAddressHashModel, setWalletAddressHashModel)}
            />

            <ImageUploader
                position={"channelQrImage"}
                label={walletQrImageModel.label}
                error={walletQrImageModel.error}
                saveImage={(image:Blob|MediaSource)=> saveImage(image)}
                deleteImage={()=> {
                    walletQrImageModel.image = undefined;
                    setWalletQrImageModel({...walletQrImageModel});
                }}
            />
        </div>
    )
}