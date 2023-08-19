import styles from "./assetimage.module.css";

export default function AssetImage(imageURL:string, size:number, shape?:'circle'|'square'|string) {
    return (
        <div 
            className={`
                ${styles.asset_image_container} 
                ${
                    shape === 'circle' 
                    ?   styles.circle
                    :   styles.square   
                }
            `} 
            style={{width:size, height:size}}
        >
            <img 
                src={imageURL} 
                alt="" 
                className={styles.asset_image} 
            />
        </div>
    );
}