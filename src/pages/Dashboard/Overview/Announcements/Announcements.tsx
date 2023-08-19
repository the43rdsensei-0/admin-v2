import styles from "./announcements.module.css";
import PrimaryTextButton from "src/components/Buttons/PrimaryTextButton";
import DropDownField from "src/components/Form/DropDownField/dropdownfield";
import TextField from "src/components/Form/TextField";
import { DropDownFormData, setDropDownFormData } from "src/components/Form/DropDownField/types";
import { useState } from "react";
import { formFieldProps, setFormFieldProps } from "src/components/Form/types";
import { createAnnouncementMessageAction } from "src/features/announcements/actions";
import { useAnnouncementState } from "src/features/announcements/atom";
import FormStateModal from "src/components/Modal/FormStateModal";

export default function Announcements() {

    const [announcementState] = useAnnouncementState()
    const [announcementMessageState, setAnnouncementMessageState] = useState(announcementState);

    const [isFormValidated, setIsFormValidated] = useState(false);

    const announcementCategories = [
        {
            id:'1',
            label:"Transaction Processing Duration",
            value: 'TXN_PROCESSING_DURATION',
            message: ""
        },
        {
            id:'1',
            label:"Transaction Flag Warning",
            value: 'TXN_FLAG_WARNING',
            message: ""
        }
    ]

    const [AnnouncementCatModel, setAnnouncementCatModel] = useState<DropDownFormData>({
        label: 'Announcement Category',
        name: 'announcement-cat',
        options: announcementCategories,
        selected: false,
        selectedOptionIndex: 0,
        error: ''
    })

    const selectOption = (optionIndex:number, setModel:setDropDownFormData)=> {
        setModel(state => {
            return {
                ...state,
                value: AnnouncementCatModel.options[optionIndex],
                selected: true,
                selectedOptionIndex: optionIndex,
            }
        })
    }

    const [announcementMessageModel, setAnnouncementMessageModel] = useState<formFieldProps>({
        label: 'Announcement message',
        validated: false,
        error: ''
    })

    const setInput = (inputValue:string, model:formFieldProps, setModel:setFormFieldProps)=> {
        model.value = inputValue;
        const updatedModel = validateModel(model)
        setModel(updatedModel);
        
        enableButton()
    }

    const validateModel = (updatedModel:formFieldProps)=> {
        if(!updatedModel.value) {
            updatedModel.validated = false;
            updatedModel.error = "Announcement message field cannot be empty"
            return updatedModel
        } 

        updatedModel.validated = true;
        updatedModel.error = ""
        return updatedModel
    }

    const enableButton = ()=> {
        if(!AnnouncementCatModel.selected) {
            setIsFormValidated(false)
            return;
        }
        if(!announcementMessageModel.validated) {
            setIsFormValidated(false)
            return;
        }

        setIsFormValidated(true);
    }

    const createAnnouncement = ()=> {
        if(isFormValidated) {
            const payload = {
                category: AnnouncementCatModel.value?.value,
                message: announcementMessageModel.value
            }

            setAnnouncementMessageState(state => {
                return {
                    ...state,
                    status: 'loading',
                    error: false,
                    message: ''
                }
            })

            createAnnouncementMessageAction(payload)
            .then((response)=> {
                setAnnouncementMessageState(state => {
                    return {
                        ...state,
                        status: 'succeeded',
                        error: false,
                        message: `${AnnouncementCatModel.value?.label} announcement message has been created successfully.`
                    }
                })
            })
            .catch((error)=> {
                setAnnouncementMessageState(state => {
                    return {
                        ...state,
                        status: 'failed',
                        error: true,
                        message: `There was an error creating ${AnnouncementCatModel.value?.label} announcement message.`
                    }
                })
            })
            .finally(()=> {
                setTimeout(()=> {
                    setAnnouncementMessageState(state => {
                        return {
                            ...state,
                            status: 'idle',
                            error: false,
                            message: ''
                        }
                    })
                }, 3000)
            })
        }
    }

    return (
        <div className={styles.announcements_container}>

            <FormStateModal 
                state={announcementMessageState}
                setState={setAnnouncementMessageState}
            />

            <DropDownField 
                label={AnnouncementCatModel.label} 
                options={AnnouncementCatModel.options}
                error={AnnouncementCatModel.error} 
                selected={AnnouncementCatModel.selected} 
                selectedOptionIndex={AnnouncementCatModel.selectedOptionIndex}
                onSelect={(optionIndex:number)=> selectOption(optionIndex, setAnnouncementCatModel)}
            />

            <TextField 
                label={announcementMessageModel.label}
                defaultValue={announcementMessageModel.defaultValue?.toString()} 
                onInput={(inputValue:string)=> {setInput(inputValue, announcementMessageModel, setAnnouncementMessageModel)}}
                allowAttachments={false}
            />

            <PrimaryTextButton 
                label={"Upload announcement"}
                disabled={!isFormValidated}
                isLoading={announcementMessageState.status === 'loading'}
                action={()=> createAnnouncement()}
            />
        </div>
    )
}