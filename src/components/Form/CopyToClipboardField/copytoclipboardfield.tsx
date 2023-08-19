import InputField from "../InputField/inputfield";
import { formFieldProps } from "../types";

export default function CopyToClipboardField({
    label,
    value,
    isBtnLoading,
    onCopy
}:formFieldProps) {
    return (
        <InputField
            type="string"
            label={label}
            value={value!}
            suffixBtnLabel={"Copy"}
            suffixBtnLabelAlt={"Copied"}
            isLoading={isBtnLoading}
            readOnly={true}
            suffixBtnClicked={()=> {}}
            onInput={()=> {}}
        />
    );
}