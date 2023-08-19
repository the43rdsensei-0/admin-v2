import styles from "./adminuserslist.module.css";
import IconButton from "src/components/Buttons/IconButton/iconbutton";
import DashboardHeader from "src/components/Headers/Dashboard/dashboardheader";
import IconUserPlus from "../../../../assets/icons/icon-user-plus.png"
import { useNavigate } from "react-router-dom";
import { useFetchAdminUsers } from "src/features/admin-users/selectors";
import UsersTable from "./components/UsersTable";
import { Suspense, useEffect, useState } from "react";
import DataLoadingError from "src/components/DataLoadingError";
import UsersMetric from "./components/UsersMetric";
import ComponentLoader from "src/components/Loaders/ComponentLoader";

export default function AdminUserList() {
    
    const navigate = useNavigate();
    
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    const allAdminUsers:any =  useFetchAdminUsers(pageNumber);
   

    const [loadingError, setLoadingError] = useState(true)

    useEffect(()=> {
        if(allAdminUsers) {
            if(!allAdminUsers?.data?.status) { 
                setUserTableContent(allAdminUsers?.users)
                setTotalPages(allAdminUsers?.totalPages)
                setLoadingError(false)
            }
        } 
    }, [allAdminUsers])

    const [userTableContent, setUserTableContent] = useState([]);

    const paginate = (pageNumber:number)=> {
        setPageNumber(pageNumber)
    }

    return (
        <div>
            {
                (loadingError)
                ?   <DataLoadingError message={allAdminUsers?.data?.message || "Error loading data"} />
                :   <div className={styles.admin_users_list_page}>
                        <DashboardHeader pageTitle="Administrator access" />

                        <Suspense fallback={<ComponentLoader />}>
                            <UsersMetric />
                        </Suspense>

                        <div className={styles.action_row}>
                            <IconButton
                                extraStyle={styles.add_role_btn}
                                prefixIcon={<img src={IconUserPlus} alt="" className={styles.button_icon} />}
                                label={"Add role"}
                                onClick={() => navigate({pathname: 'user/new'})} 
                                disabled={false} 
                                isLoading={false}
                            />
                        </div>

                        <UsersTable 
                            users={userTableContent} 
                            currentPage={pageNumber} 
                            totalPages={totalPages} 
                            goToPage={(pageNumber:number)=> paginate(pageNumber)}  
                        />
                    </div>
            }
        </div>
    );
}