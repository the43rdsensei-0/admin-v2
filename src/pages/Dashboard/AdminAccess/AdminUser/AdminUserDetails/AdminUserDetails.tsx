import styles from "./adminuserdetails.module.css";
import DashboardHeader from "src/components/Headers/Dashboard/dashboardheader";
import AdminUserForm from "../components/AdminUserForm";
import { useAdminUsersState } from "src/features/admin-users/atom";
import { useParams } from "react-router-dom";
import { useFetchAdminUser } from "src/features/admin-users/selectors";
import { updateAdminUserAction } from "src/features/admin-users/action";
import { useEffect, useState } from "react";
import Page404 from "src/pages/Page404/Page404";
import FormStateModal from "src/components/Modal/FormStateModal";

// interface userDetailsType {
//     id:string,
//     fullname:string,
//     email:string,
//     phoneNumber:string,
//     role:string,
//     profileImageURL:string,
//     active:boolean
// }

export default function AdminUserDetails() {

    const [adminUsersState, setAdminUsersState] = useAdminUsersState()
    const [deactivateAdminUserState, setDeactivateAdminUserState] = useState(adminUsersState);
    const [updateAdminUserState, setUpdateAdminUserState] = useState(adminUsersState);
    
    const params = useParams();
    const userDetailsResponse:any = useFetchAdminUser(params.userId!);
    const [ErrorStatus, setErrorStatus] = useState<number>()

    useEffect(()=> {
        if(userDetailsResponse.status === 404) setErrorStatus(404)
    }, [userDetailsResponse])


    const [userDetails, setUserDetails] = useState();

    const updateUser = (formData:FormData)=> {
        setUpdateAdminUserState(state => {
            return {
                ...state,
                error:false,
                status: 'loading',
                message: ''
            }
        })

        updateAdminUserAction(userDetailsResponse._id, formData)
        .then((response)=> {
            setUpdateAdminUserState(state => {
                return {
                    ...state,
                    status: 'succeeded',
                    message: 'Admin user updated successfully'
                }
            })
        })
        .catch((error)=> {
            setUpdateAdminUserState(state => {
                return {
                    ...state,
                    error:true,
                    status: 'failed',
                    message: error.message
                }
            })
        })
    }

    const toggleUserActivation = (formData:FormData)=> {
        setDeactivateAdminUserState(state => {
            return {
                ...state,
                error: false,
                status: 'loading',
                message: ''
            }
        })

        updateAdminUserAction(userDetailsResponse._id, formData)
        .then((data:any)=> {
            setDeactivateAdminUserState(state => {
                return {
                    ...state,
                    status: 'succeeded',
                    message: data.user.active ?'Admin user activated successfully' :'Admin user deactivated successfully'
                }
            })
            
            setUserDetails(data.user)
        })
        .catch((error)=> {
            setDeactivateAdminUserState(state => {
                return {
                    ...state,
                    error:true,
                    status: 'failed',
                    message: error.message
                }
            })
        })
    }

    return (
        <div className={styles.admin_user_details_container}>
            <DashboardHeader goBackPath={'/dashboard/admin-access'} />

            <FormStateModal 
                state={updateAdminUserState}
                setState={setUpdateAdminUserState}
            />

            <FormStateModal
                state={adminUsersState}
                setState={setAdminUsersState}
            />

            <FormStateModal 
                state={deactivateAdminUserState}
                setState={setDeactivateAdminUserState}
            />
            
            {
                ErrorStatus === 404
                ?   <Page404 />
                :   <AdminUserForm 
                        userDetails={userDetails || userDetailsResponse} 
                        submitting={adminUsersState.status === 'loading'}
                        updating={updateAdminUserState.status === 'loading'}
                        changingActivation={deactivateAdminUserState.status === 'loading'}
                        updateUserAction={(formData:FormData)=> updateUser(formData)}
                        toggleActivationAction={(formData:FormData)=> toggleUserActivation(formData)}
                    />
            }
        </div>
    )
}