import styles from "./emptylist.module.css";

export default function EmptyList({message, size}:{message:string, size?:number}) {
    return (
        <div className={styles.empty_list_container} style={{padding:size}}>
            <div className="text">{ message }</div>
        </div>
    );
}