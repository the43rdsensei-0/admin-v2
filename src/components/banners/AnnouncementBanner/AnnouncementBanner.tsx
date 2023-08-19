import { useEffect, useState } from "react";
import DataLoadingError from "src/components/DataLoadingError";
import ComponentLoader from "src/components/Loaders/ComponentLoader";
import { useFetchAnnouncementBanner } from "src/features/announcements/selectors";
import Banner from "../Banner";

export default function AnnouncementBanner() {

    const [loader, setLoader] = useState(true)
    const [loadingError, setLoadingError] = useState({
        status: false,
        message:''
    })

    const announcementBannerResponse:any = useFetchAnnouncementBanner();

    useEffect(()=> {
        if(announcementBannerResponse?.code === 200) {
            setBanner(state => {
                return {
                    ...state,
                    image: announcementBannerResponse?.banner?.imageURL,
                    placeholder: announcementBannerResponse?.banner?.imagePlaceholderURL
                }
            })

            setLoadingError({ status: false, message: '' })

        } else setLoadingError({ status: true, message: 'Error loading banner, contact support' })
        
        setLoader(false)
        
    }, [announcementBannerResponse])

    const [banner, setBanner] = useState({
        image: '',
        placeholder: ''
    });

    return (
        loader
        ?   <div style={{ width:350, height:190 }}>
                <ComponentLoader />
            </div>
        :   loadingError.status
            ?   <div style={{ width:350, height:190 }}>
                    <DataLoadingError message={loadingError.message} />
                </div>
            :   <Banner 
                    src={banner.image}
                    placeholder={banner.placeholder} 
                    width={468} 
                    height={184} 
                />
    )
}