import styles from "./addadminuser.module.css";
import DashboardHeader from "src/components/Headers/Dashboard/dashboardheader";
import { createAdminUserAction } from "src/features/admin-users/action";
import { useAdminUsersState } from "src/features/admin-users/atom";
import FormErrorModal from "src/components/Modal/FormError/FormErrorModal";
import FormSuccessModal from "src/components/Modal/FormSuccess";
import AdminUserForm from "../components/AdminUserForm";

export default function AddAdminUser() {

    const [adminUsersState, setAdminUsersState] = useAdminUsersState()

    const submitForm = (formData:FormData)=> {
           
            setAdminUsersState(state => {
                return {
                    ...state,
                    status:'loading',
                    error: false,
                    message: ''
                }
            })
            
            createAdminUserAction(formData)
            .then((updatedUsersList:any)=> {
                setAdminUsersState(()=> {
                    return {
                        users: updatedUsersList,
                        status:'succeeded',
                        error: false,
                        message: 'New admin user created successfully'
                    }
                })
            })
            .catch((error:any)=> {
                setAdminUsersState(state=> {
                    console.log(error)
                    return {
                        ...state,
                        status:'failed',
                        error: true,
                        message: error.message
                    }
                })
            })

    }
 
    return (
        <div className={styles.add_admin_user_page}>
            <DashboardHeader goBackPath={'/dashboard/admin-access'} />
            
            <FormErrorModal 
                errorState={adminUsersState}
                setErrorState={setAdminUsersState}    
            />

            <FormSuccessModal 
                errorState={adminUsersState}
                setErrorState={setAdminUsersState}    
            />

            <AdminUserForm 
                submitting={adminUsersState.status === 'loading'}
                formAction={(formData:FormData)=> submitForm(formData)}
            />

        </div>
    )
}