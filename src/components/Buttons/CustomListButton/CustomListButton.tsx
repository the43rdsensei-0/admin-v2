import IconButton from "../IconButton/iconbutton";
import { ReactComponent as IconSliders } from "src/assets/icons/icon-sliders.svg";
import styles from "./customlistbutton.module.css";
import { useState } from "react";
import RadioButton from "../RadioButton";
import { useClickOutside } from "src/hooks";

export default function CustomListButton({action}:{action:Function}) {

    const buttonRef = useClickOutside(()=> setIsOptionsOpen(false))

    const [isOptionsOpen, setIsOptionsOpen] = useState(false); 

    const toggleOptionsVisibility = ()=> setIsOptionsOpen(!isOptionsOpen)

    const [options, setOptions] = useState([
        {
            label: 'Total Amount',
            type: 'total-amount',
            selected: false
        },
    ])

    const selectSortOption = (sortType:string)=> {
        setOptions(state => {
            return state.map((option)=> {
                return (option.type === sortType) 
                ?   { ...option, selected: true }
                :   { ...option, selected: false }
            })
        })

        action('total-amount')
    }

    return (
        <div className={styles.custom_list_button_container} ref={buttonRef}>
            <IconButton
                extraStyle={styles.custom_list_button}
                prefixIcon={<IconSliders stroke={"var(--orange-accent-500)"}  />}
                label={"Custom list"}
                onClick={()=> toggleOptionsVisibility()}
            />

            {
                isOptionsOpen
                ?   <div className={styles.options_container}>
                        <div className={styles.option_section}>
                            <div className={styles.title}>Sort by: </div>
                            {
                                options.map((option, index)=> {
                                    return  <RadioButton 
                                                key={option.type}
                                                label={option.label}
                                                selected={option.selected}
                                                onSelect={()=> selectSortOption(option.type)}
                                            />
                                })
                            }
                        </div>
                    </div>
                :   null
            }
        </div>
    ); 
}