export interface formFieldProps {
    type?:string,
    label:string,
    hint?:string,
    name?:string,
    options?:{
        id:string, 
        label:string
    }[],
    defaultValue?: string|number,
    value?:string|number,
    numberValue?:number,
    textValue?:string,
    image?:{ 
        default:string, 
        new?:Blob|MediaSource|undefined
    },
    singleImage?:Blob|MediaSource,
    images?:Array<Blob|MediaSource|undefined>,
    selected?:boolean,
    selectedOptionIndex?:number,
    validated?:boolean,
    error:string
    readOnly?:boolean,
    copied?:boolean,
    suffixIcon?:any,
    suffixText?:string,
    suffixTextAlt?:string,
    isBtnLoading?:boolean,
    onCopy?:Function
}

export interface setFormFieldProps extends React.Dispatch<React.SetStateAction<formFieldProps>> {

}

