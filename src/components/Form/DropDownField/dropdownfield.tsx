import styles from "./dropdownfield.module.css"
import { useState } from "react";
import { useClickOutside } from "../../../hooks";
import { FaAngleDown } from "react-icons/fa";
import { DropDownOption, DropDownProps } from "./types";
import filterObjectList from "../../../utils/filterObjectList";

export default function DropDownField({
    label,
    options,
    error,
    selected,
    selectedOptionIndex,
    onSelect,
    action,
    relative,
    extraStyle,
    canAddNewItem,
    addOption
}: DropDownProps) {

    const domNode = useClickOutside(()=> {
        setSearchKeyword('')
        setFilteredOptions(options)
        setIsOpen(false);
    });

    const [isOpen, setIsOpen] = useState(false);
    const dropOptions = ()=> {
        if(options.length) setIsOpen(true)
    }
    
    const [searchKeyword, setSearchKeyword] = useState<string>('')
    
    const [filteredOptions, setFilteredOptions] = useState<DropDownOption[]>(options);

    const filterOptions = (filterTxt:string)=> {
        setSearchKeyword(filterTxt)
        const searchResults = filterObjectList(filterTxt, options);
        setFilteredOptions(searchResults)
    }

    const selectOption = (selectedOption:DropDownOption)=> {
        onSelect?.(options.indexOf(selectedOption))
    }

    // function addFirstDropDownItem(value:string) {
    //     addOption?.(value)
    // }

    return (
        <div className={`${extraStyle} ${styles.container}`} ref={domNode}>
            <div className={styles.label}> { label } </div>
            <div className={`
                    ${styles.display}
                    ${isOpen ?styles.is_open :null}
                    ${isOpen ?relative ?styles.bottom_offset :null :null}
                    ${error ?styles.field_error :null}
                    ${!options.length ?canAddNewItem ?null :styles.disable_dropdown :null}
                `}
            >
                {
                    (isOpen)
                    ?   <div className={styles.search_bar_wrapper}>
                            <input 
                                type={'text'}
                                placeholder={"Search by keyword"}
                                className={styles.search_bar}
                                onInput={(e:any)=> filterOptions(e.target.value)}
                            />
                        </div>
                    :   (selected)
                        ?   <div className={styles.selected_option} onClick={()=> dropOptions()}>
                                { options[selectedOptionIndex].label }
                            </div>
                        :   <div className={styles.unselected} onClick={()=> dropOptions()}>
                                {/* <input 
                                    type={'text'}
                                    placeholder={"Enter first item"}
                                    className={styles.search_bar}
                                    onInput={(e:any)=> addFirstDropDownItem(e.target.value)}
                                /> */}
                                <FaAngleDown />
                            </div>
                }

                {
                    (isOpen)
                    ?   
                        <div className={styles.options_container}>
                            {
                                (filteredOptions.length)
                                ?   filteredOptions.map((option, index:any)=> {
                                        if(option.type === 'action-option' && options.length === 1) {
                                            return  <div 
                                                key={index} 
                                                className={styles.action_option} 
                                            >
                                                <div 
                                                    className={`
                                                        ${(searchKeyword) ?null : styles.disabled_btn}
                                                        ${styles.action_option_btn}
                                                    `}
                                                    onClick={()=> action?.(searchKeyword)}
                                                >
                                                    { option.actionIcon }
                                                    { option.label }
                                                </div>
                                            </div>         
                                        } 
                                        
                                        
                                        return  <div 
                                                    key={index} 
                                                    className={styles.option} 
                                                    onClick={()=> {
                                                        selectOption(option)
                                                        setIsOpen(false)
                                                    }}
                                                >
                                                    { option.label }
                                                </div>
                                        
                                    })
                                :   
                                    <div>
                                        {
                                            options.map((option, index) => {
                                                return  (option.type === 'action-option') 
                                                        ?   <div 
                                                                key={index} 
                                                                className={styles.action_option} 
                                                            >
                                                                <div 
                                                                    className={styles.action_option_btn}
                                                                    onClick={()=> {
                                                                        if(searchKeyword){
                                                                            action?.(searchKeyword)
                                                                            setIsOpen(false)
                                                                        }
                                                                    }}
                                                                    
                                                                >
                                                                    { option.actionIcon }
                                                                    { option.label }
                                                                </div>
                                                            </div>
                                                        :   null
                                            })
                                        }
                                        <div
                                            className={styles.option}
                                            style={{color:"var(--grey-accent-600)"}}
                                            children={`No result matches the keyword '${searchKeyword}'`}
                                        />
                                    </div>
                            }
                        </div>
                    :   null
                }
            </div>
            <div className={styles.error}>{error}</div>
        </div>
    );
}