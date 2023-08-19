import styles from "./qrcodecard.module.css";

export default function QRCodeCard (props:{
    imageURL:string
}) {
    return (
        <div className={styles.container}>
            <img src={props.imageURL} alt="" className={styles.qr_image} />
        </div>
    );
}