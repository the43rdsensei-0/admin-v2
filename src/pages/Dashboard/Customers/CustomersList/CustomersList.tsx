import styles from "./customerslist.module.css";
import { useEffect, useState } from "react";
import DashboardHeader from "../../../../components/Headers/Dashboard/dashboardheader";
import DataLoadingError from "src/components/DataLoadingError";
import CustomersTable from "./CustomersTable";
import socketConnection from "src/lib/socketConn";
import formatCustomersList from "src/features/customers/utils/formatCustomersList";
import { useCustomerState } from "src/features/customers/atom";
import PageComponentLoader from "src/components/Loaders/PageComponentLoader";
import { useUserStateValue } from "src/features/user/atom";

export default function CustomersList() {

    const userState = useUserStateValue()
    const [customerState, setCustomerState] = useCustomerState()
    
    const [pageNumber, setPageNumber] = useState<number>(1);
    
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [loadingError, setLoadingError] = useState({
        status: false,
        message: ""
    })


    useEffect(()=> {
        socketConnection.emit("fetch_all_customers", { pageNumber, userId: userState.userData.id })
        .on("customers", (response)=> {
            if(response?.code === 200) {
                setCustomerState(state => {
                    return {
                        ...state,
                        list: formatCustomersList(response?.data?.customers),
                        totalPages: response?.data?.totalCustomersPages,
                        currentPage: response?.data?.currentPage
                    }
                })
            } else {
                setLoadingError({
                    status: false,
                    message: ""
                })
            }

            setIsPageLoading(false)
        })

    }, [pageNumber, setCustomerState, userState.userData.id])
 
    const paginate = (newPageNumber:number)=> {
        setPageNumber(newPageNumber)
    }

    return(
        <div className={styles.customers_list}>

            <DashboardHeader 
                pageTitle="Customer directory"
            />

            {   
                isPageLoading
                ?   <PageComponentLoader />

                :   loadingError.status
                    ?   <DataLoadingError message={loadingError.message} />

                    :   <CustomersTable 
                            customers={customerState.list} 
                            currentPageNumber={customerState.currentPage} 
                            totalPagesNumber={customerState.totalPages} 
                            paginate={(newPageNumber:number)=> paginate(newPageNumber)}                                
                        />
            }
        </div>
    );
}