import styles from "./overview.module.css";
import DashboardHeader from "src/components/Headers/Dashboard/dashboardheader";
import Banners from "./Banners";
import Announcements from "./Announcements";
import SizedBox from "src/components/SizedBox";

export default function Overview() {
    return (
        <div className={styles.overview_container}>
            <DashboardHeader 
                pageTitle="Admin Dashboard"
            />

            <Banners />

            <SizedBox height={25} />

            <hr />

            <SizedBox height={25} />

            <Announcements />
        </div>
    )
}