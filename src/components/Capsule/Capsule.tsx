import styles from "./capsule.module.css";

export default function Capsule (status:string, size?:{ height?:number|string, width?:number }) {

    const detStyle = (status:string)=> {
        switch (status.toLowerCase()){
            case "success": return styles.success
            case "failed": return styles.failed
            case "pending": return styles.pending
            case "processing": return styles.processing
        }
    }

    return (
        <div 
            className={`
                ${styles.container} 
                ${detStyle(status)}
            `}
            style={{height: size?.height!, width: size?.width!}}
        >
            { status }
        </div>
    );
}