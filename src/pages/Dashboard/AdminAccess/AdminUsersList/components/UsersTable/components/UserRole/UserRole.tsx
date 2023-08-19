import styles from "./userrole.module.css";

export default function UserRole({ role }:{ role:string }) {

    const detUserRole = (userRole:string)=> {
        switch (userRole) {
            case "admin_org": return 'Admin Organization'
            case "admin_ops": return 'Admin Operations'
            case "admin_acct": return 'Accountant'
            case "admin_csa_crypto": return 'Customer Attendant (Cryptocurrency)'
            case "admin_csa_card": return 'Customer Attendant (Giftcard)'
        }
    }

    return (
        <div className={styles.user_role_container}>
            { detUserRole(role)  }
        </div>
    )
}