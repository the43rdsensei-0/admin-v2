import styles from "./filterbutton.module.css";
import IconButton from "../IconButton/iconbutton";
import { ReactComponent as IconSliders } from "src/assets/icons/icon-sliders.svg";
import { useEffect, useState } from "react";
import RadioButton from "../RadioButton";
import PrimaryTextButton from "../PrimaryTextButton";
import SizedBox from "src/components/SizedBox";
import DropDownField from "src/components/Form/DropDownField/dropdownfield";
import { DropDownFormData, setDropDownFormData } from "src/components/Form/DropDownField/types";
import { formFieldProps, setFormFieldProps } from "src/components/Form/types";
import prefixDigit from "src/utils/prefixDigit";
import { useUserStateValue } from "src/features/user/atom";
import detTimeDifferenceInSecs from "src/utils/detTimeDifferenceSecs";

export interface FilterOptionsType {
    status:string, 
    startDate:string, 
    endDate:string
}

export default function FilterButton({onFilter}:{onFilter:Function}) {

    const userState = useUserStateValue()

    const [dateFilterOptions, setDateFilterOptions] = useState([
        {
            label: 'all',
            selected: !userState.userData.adminProperties?.transactionFilterOptions.startDate
        },
        {
            label: 'today',
            selected: detTimeDifferenceInSecs(
                    userState.userData.adminProperties?.transactionFilterOptions.startDate!,
                    userState.userData.adminProperties?.transactionFilterOptions.endDate!
                ) <= 86400
        },
        {
            label: 'specific date range',
            selected: detTimeDifferenceInSecs(
                userState.userData.adminProperties?.transactionFilterOptions.startDate!,
                userState.userData.adminProperties?.transactionFilterOptions.endDate!
            ) > 86400
        },
    ])

    const selectDateOption = (label:string)=> {
        setDateFilterOptions(state => {
            return state.map((option)=> {
                return (option.label === label) 
                ?   { ...option, selected: true }
                :   { ...option, selected: false }
            })
        })

        if(label === dateFilterOptions[1].label) {
            setStartDateModel(state => {
                return {...state, value: todayDateModel.value}
            })
    
            setEndDateModel(state => {
                return {...state, value: todayDateModel.value}
            })
        }

        if(label === dateFilterOptions[0].label) {
            const dateObj = new Date();
            const startDateFormat = `${dateObj.getFullYear()}-${prefixDigit("1")}-${prefixDigit("1")}`;
            
            setStartDateModel(state => {
                return {...state, value: startDateFormat}
            })
    
            setEndDateModel(state => {
                return {...state, value: todayDateModel.value}
            })
        }
    }

    const [todayDateModel, setTodayDateModel] = useState<formFieldProps>({
        label:"",
        value: '',
        error: ''
    })

    const [startDateModel, setStartDateModel] = useState<formFieldProps>({
        label:"FROM",
        error: ''
    })

    const [endDateModel, setEndDateModel] = useState<formFieldProps>({
        label:"TO",
        error: ''
    })

    const setInput =(inputValue:any, model:formFieldProps, setModel:setFormFieldProps)=> {
        model.value = inputValue;
        validateModel({...model})
        setModel({...model})

        console.log(inputValue)
    }

    const validateModel =(updatedModel:formFieldProps)=> {
        if(updatedModel.value) {
            updatedModel.validated = false;
            updatedModel.error = "Please select a valid date"
            return;
        }

        updatedModel.validated = true;
        updatedModel.error = ""
        return;
    }

    const [statusOptions, setStatusOptions] = useState<DropDownFormData>({
        label: "By Status",
        options: [
            {
                id: 'all',
                label: 'ALL'
            },
            {
                id: 'pending',
                label: 'PENDING'
            },
            {
                id: 'success',
                label: 'SUCCESS'
            },
            {
                id: 'failure',
                label: 'FAILED'
            }
        ],
        value: {
            id: 'all',
            label: 'ALL'
        },
        selected: true,
        selectedOptionIndex: 0,
        error: '',
        name: "status-options"
    })

    const selectOption =(selectedIndex:number, model:DropDownFormData, setModel:setDropDownFormData)=> {
        model.value = model.options[selectedIndex];
        model.selected = true;
        model.selectedOptionIndex = selectedIndex;

        setModel({...model})
    }

    useEffect(()=> {
        
        const dateObj = new Date();
        const dateFormatted = `${dateObj.getFullYear()}-${prefixDigit((dateObj.getMonth()+1).toString())}-${prefixDigit(dateObj.getDate().toString())}`
        const startDateFormat = `${dateObj.getFullYear()}-${prefixDigit("1")}-${prefixDigit("1")}`;

        setTodayDateModel(state => {
            return {
                ...state, 
                value: dateFormatted
            }
        })

        setStartDateModel(state => {
            return {
                ...state, 
                value: userState.userData.adminProperties?.transactionFilterOptions.startDate || startDateFormat
            }
        })

        setEndDateModel(state => {
            return {
                ...state, 
                value: userState.userData.adminProperties?.transactionFilterOptions.endDate || dateFormatted
            }
        })

        setStatusOptions(state => {
            return {
                ...state,
                value: {
                    id: userState.userData.adminProperties?.transactionFilterOptions?.status.toLowerCase()!,
                    label: userState.userData.adminProperties?.transactionFilterOptions?.status!
                },
                selectedOptionIndex: statusOptions.options.findIndex((option) => option.label === userState.userData.adminProperties?.transactionFilterOptions?.status)
            }
        })

    }, [statusOptions.options, userState.userData.adminProperties?.transactionFilterOptions])

    const [isOptionsOpen, setIsOptionsOpen] = useState(false); 

    const toggleOptionsVisibility = ()=> setIsOptionsOpen(!isOptionsOpen)
    
    const applyFilter =()=> {
        const payload = {
            status: statusOptions.value?.label,
            startDate: startDateModel.value,
            endDate: endDateModel.value
        }

        onFilter(payload)
    }

    return(
        <div className={styles.filter_button_component} >
            <IconButton
                prefixIcon={<IconSliders stroke={"var(--orange-accent-500)"}  />}
                label="Filter"
                onClick={()=> toggleOptionsVisibility()}
                extraStyle={`${styles.filter_button} ${isOptionsOpen ?styles.open :null}`}
            />

            {
                isOptionsOpen
                ?   <div className={styles.filter_options}>
                        <div>
                            <div className={styles.option_title}>By Date</div>
                            <div className={styles.date_filter_options}>
                            {
                                dateFilterOptions.map(option => {
                                    return  <div 
                                                key={option.label}
                                                className={styles.date_filter_option}
                                            >
                                                <RadioButton 
                                                    label={option.label}
                                                    selected={option.selected}
                                                    onSelect={()=> selectDateOption(option.label)}
                                                />
                                            </div>
                                })
                            }
                            </div>
                            
                            {
                                dateFilterOptions[2].selected
                                ?   <div className={styles.date_range_container}>
                                        <div className={styles.date_selector}>
                                            <div className={styles.label}>FROM</div>
                                            <input 
                                                type={"date"} 
                                                defaultValue={startDateModel.value}
                                                max={endDateModel.value}
                                                className={styles.date_input_field}
                                                onInput={(event:any)=> setInput(event.target.value, startDateModel, setStartDateModel)}
                                            />
                                        </div>

                                        <div className={styles.date_selector}>
                                            <div className={styles.label}>TO</div>
                                            <input 
                                                type={"date"} 
                                                defaultValue={endDateModel.value}
                                                className={styles.date_input_field}
                                                min={startDateModel.value}
                                                max={todayDateModel.value}
                                                onInput={(event:any)=> setInput(event.target.value, endDateModel, setEndDateModel)}
                                            />
                                        </div>
                                    </div>
                                :   null
                            }

                            <SizedBox height={20} />

                            <DropDownField
                                label={statusOptions.label} 
                                options={statusOptions.options} 
                                error={statusOptions.error} 
                                selected={statusOptions.selected} 
                                selectedOptionIndex={statusOptions.selectedOptionIndex}
                                relative={true}  
                                onSelect={(selectedIndex:number)=> selectOption(selectedIndex, statusOptions, setStatusOptions)}
                            />

                            <SizedBox height={20} />

                            <PrimaryTextButton 
                                label={"Apply"}
                                action={()=> applyFilter()}
                            />
                        </div>
                    </div>
                :   null
            }           

        </div>
    )
}