import Image from "src/components/Image";
import styles from "./banner.module.css";

export interface BannerTypes {
    src:string, 
    placeholder:string, 
    width:number, 
    height:number
}

export default function Banner({src, placeholder, width, height}:BannerTypes) {
    return (
        <div className={styles.ad_banner_section}>
            <Image 
                src={src} 
                placeholder={placeholder} 
                width={width} 
                height={height}            
            />
        </div>
    );
}