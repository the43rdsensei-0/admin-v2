import { useEffect, useState } from "react";
import GridList from "src/components/Lists/GridList";
import { useFetchAdminUsersMetric } from "src/features/admin-users/selectors";
import UsersMetricCard from "./UsersMetricCard";
import DataLoadingError from "src/components/DataLoadingError";

export default function UsersMetric() {

    const usersMetricData:any = useFetchAdminUsersMetric();
    const [adminUsersMetrics, setAdminUsersMetrics] = useState({
        superAdminCount: 0,
        superAdminUsers: [],
        acctAdminCount: 0,
        acctAdminUsers: [],
        csaAdminCount: 0,
        csaAdminUsers: []
    })
    const [loadingError, setLoadingError] = useState({
        status: false,
        message: ''
    })

    useEffect(()=> {
        if(usersMetricData?.code === 200) {
            setAdminUsersMetrics({
                superAdminCount: usersMetricData?.superAdmin?.count,
                superAdminUsers: usersMetricData?.superAdmin?.users,
                acctAdminCount: usersMetricData?.acctAdmin?.count,
                acctAdminUsers: usersMetricData?.acctAdmin?.users,
                csaAdminCount: usersMetricData?.csaAdmin?.count,
                csaAdminUsers: usersMetricData?.csaAdmin?.users,
            })
            setLoadingError({
                status: false,
                message: ''
            })
        }
        else {
            setLoadingError({
                status: true,
                message: "Error loading metrics, contact support." 
            })
        }
    }, [usersMetricData])

    return (
        loadingError.status
        ?   <DataLoadingError message={loadingError.message} />
        :   <GridList columns={3}>
                <UsersMetricCard users={adminUsersMetrics.superAdminUsers} usersCount={adminUsersMetrics.superAdminCount}  label="Super Admin" />
                <UsersMetricCard users={adminUsersMetrics.acctAdminUsers} usersCount={adminUsersMetrics.acctAdminCount} label="Accountant" />
                <UsersMetricCard users={adminUsersMetrics.csaAdminUsers} usersCount={adminUsersMetrics.csaAdminCount} label="Customer Service" />
            </GridList>
    )
}
