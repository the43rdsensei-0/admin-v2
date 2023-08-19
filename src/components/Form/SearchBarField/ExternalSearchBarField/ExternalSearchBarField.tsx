import styles from "./externalsearchbarfield.module.css";
import InputField from "../../InputField/inputfield";
import {ReactComponent as IconSearch} from "src/assets/icons/icon-search.svg";

export default function ExternalSearchBarField({label, action}:{label?:string, action:Function}) {
    return (
        <div className={styles.search_bar_field}>
            <InputField
                type="text"
                label=""
                value={''}
                hint={label || "Search by id"}
                error=""
                prefixIcon={<IconSearch />}
                onInput={(value:any)=> { action(value) }}
            />
        </div>
    );
}