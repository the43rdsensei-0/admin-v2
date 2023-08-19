import ModalContainer from "../../../../../../../../components/Modal/ModalContainer";
import GiftcardRegionForm from "./GiftcardRegionForm";

export default function NewGiftcardRegion({close}:{close:Function}) {
    return (
        <ModalContainer close={()=> close()}>
            <GiftcardRegionForm />
        </ModalContainer>
    )
}