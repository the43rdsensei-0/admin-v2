import styles from "./exportcsvbutton.module.css";
import IconButton from "../IconButton/iconbutton";
import {ReactComponent as IconNote} from "src/assets/icons/icon-note.svg"

export default function ExportCSVButton ({isLoading, action}:{isLoading:boolean, action:Function}) {
    return (
        <IconButton 
            extraStyle={styles.export_csv_button}
            isLoading={isLoading}
            prefixIcon={<IconNote fill={"white"} />}
            label="Export CSV"
            onClick={()=> action()}
        />
    )
}