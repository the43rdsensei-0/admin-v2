import { LazyLoadImage } from "react-lazy-load-image-component"
import styles from "./image.module.css"

export interface ImageTypes {
    src: string,
    placeholder: string,
    width?: number,
    height?: number,
    extraStyle?: string
    action?:Function
}

export default function Image({src, placeholder, width, height, extraStyle, action}:ImageTypes) {
    return (
        <LazyLoadImage 
            src={src}
            placeholderSrc={placeholder} 
            effect="blur"
            alt=""
            width={width}
            height={height}
            className={`${styles.image} ${extraStyle}`}
            onClick={()=> action?.()}
        />
    )
}