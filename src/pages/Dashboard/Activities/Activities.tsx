import { useEffect, useState } from "react";
import DataLoadingError from "src/components/DataLoadingError";
import DashboardHeader from "src/components/Headers/Dashboard/dashboardheader";
import { useFetchActivities } from "src/features/activities/selectors";
import styles from "./activities.module.css";
import ActivitiesTable from "./components/ActivitiesTable";

export default function Activities () {

    const [pageNumber, setPageNumber] = useState<number>(1)
    const [totalPages, setTotalPages] = useState<number>(1)
    const activitiesResponse:any = useFetchActivities(pageNumber);
    
    const [loadingError, setLoadingError] = useState({
        status: false,
        message: ""
    }) 

    useEffect(()=> {
        if(activitiesResponse?.code === 200) {
            setActivities(activitiesResponse.activities);
            setTotalPages(activitiesResponse.totalPages);
            setLoadingError({
                status: false,
                message: ""
            })

        } else {
            setLoadingError({
                status: true,
                message: "Error loading activities, contact support."
            })
        }

    }, [activitiesResponse])

    const [activities, setActivities] = useState([])

    const paginate = (pageNumber:number) => {
        setPageNumber(pageNumber);
    }

    return (
        loadingError.status
        ?   <DataLoadingError message={loadingError.message} />
        
        :   <div className={styles.activities_container}>
                <DashboardHeader 
                    pageTitle="Activities"
                />

                <ActivitiesTable 
                    activities={activities}
                    currentPage={pageNumber}
                    totalPages={totalPages}
                    goToPage={(pageNumber: number) => paginate(pageNumber)}
                />
            </div>
    );
}