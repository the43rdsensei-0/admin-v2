import styles from "./gridlist.module.css";

export default function GridList({
    columns, children
}:{columns:number, children: React.ReactNode[]|React.ReactNode}) {
    return (
        <div className={styles.grid_list} style={{gridTemplateColumns: `repeat(${columns}, 1fr)`}}>
            { children }
        </div>
    )
}