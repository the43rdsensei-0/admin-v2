import styles from "./userprofile.module.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';

export default function UserProfileImage(imageUrl:string, fullname:string, size?:number, fontSize?:number) {
    return (
        <div className={styles.container}>
            {
                imageUrl
                ?   <LazyLoadImage 
                        src={imageUrl} 
                        effect="blur"
                        alt=""
                        width={size}
                        height={size}
                        className={styles.image} 
                    />
                :   <div className={styles.image_placeholder} style={{width:size, height:size, fontSize:`${fontSize}px`}}>
                        { fullname?.split('')[0]?.toUpperCase()  }
                    </div>
            }
        </div>
    );
}