export interface DropDownProps {
    label:string,
    options: DropDownOption[],
    value?:{
        id:string,
        label:string,
        value?:string
    },
    error:string
    selected:boolean,
    selectedOptionIndex:number,
    onSelect?:Function,
    action?:Function,
    relative?: boolean,
    extraStyle?: string,
    canAddNewItem?:boolean;
    addOption?:Function
}

export interface DropDownOption {
    id:string, 
    label:string, 
    name?:string, 
    value?:string,
    type?:'action-option'|'option',
    actionIcon?:any
}

export interface DropDownFormData extends DropDownProps {
    name:string
}

export interface setDropDownFormData extends React.Dispatch<React.SetStateAction<DropDownFormData>> {

}