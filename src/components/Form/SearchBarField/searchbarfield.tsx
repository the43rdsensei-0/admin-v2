import styles from "./searchbarfield.module.css";
import InputField from "../InputField/inputfield";
import {ReactComponent as IconSearch} from "../../../assets/icons/icon-search.svg";
import { SearchBarFieldProps } from "./types";
import filterObjectList from "../../../utils/filterObjectList";
import filterArrayList from "../../../utils/filterArrayList";

export default function SearchBarField({onSearch, listToSearch, arrayList, extraStyle}:SearchBarFieldProps) {
    
    const search = (value:any)=> {
        if(Array.isArray(arrayList?.[0])) {
            onSearch(filterArrayList(value, arrayList!));
        }
        if(typeof listToSearch === 'object') {
            onSearch(filterObjectList(value, listToSearch));
        }
    }

    return (
        <div className={`${styles.container} ${extraStyle}`}>
            <InputField
                type="text"
                label=""
                value={''}
                hint="Search by keyword"
                error=""
                suffixIcon={<IconSearch />}
                onInput={(value:any)=> {search(value)}}
            />
        </div>
    );
}