import { selectorFamily, useRecoilValue } from "recoil";
import { fetchAllActivitesAction } from "./actions";
import formatActivities from "./utils/formatActivities";

const fetchActivitiesSelector = selectorFamily({
    key:'fetchactivitiesselector',
    get: (pageNumber:number)=> async ()=> {
        return fetchAllActivitesAction(pageNumber)
        .then(async (data:any)=> {
            return formatActivities(data.activities)
            .then((formattedActivities)=> {
                return {
                    code: 200,
                    activities: formattedActivities,
                    totalPages: data.totalActivitiesPages
                }
            })
            .catch((error)=> {
                return {
                    code: 500,
                    ...error.data
                }
            })
        })
        .catch((error:any)=> {
            return {
                code: 500,
                ...error.data
            }
        })
    }
});

export const useFetchActivities = (pageNumber:number)=> useRecoilValue(fetchActivitiesSelector(pageNumber));