import { selector, useRecoilValue } from "recoil";
import { fetchAdvertismentBannerAction, fetchAnnouncementBannerAction } from "./actions";

const fetchAnnouncementBanner = selector({
    key:'fetchannouncementbanner',
    get: async ()=> {
        return fetchAnnouncementBannerAction()
        .then((banner)=> {
            return {
                code: 200,
                banner: banner,
                error: undefined
            }          
        })
        .catch((error)=> {
            return {
                code: 500,
                banner: undefined,
                error: error.message
            }
        })
    }
})

export const useFetchAnnouncementBanner = ()=> useRecoilValue(fetchAnnouncementBanner)

const fetchAdvertismentBanner = selector({
    key:'fetchadvertismentbanner',
    get: async ()=> {
        return fetchAdvertismentBannerAction()
        .then((banner)=> {
            return {
                code: 200,
                banner: banner,
                error: undefined
            }          
        })
        .catch((error)=> {
            return {
                code: 500,
                banner: undefined,
                error: error.message
            }
        })
    }
})

export const useFetchAdvertismentBanner = ()=> useRecoilValue(fetchAdvertismentBanner)