import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import ComponentLoader from "../../../components/Loaders/ComponentLoader";
import styles from "./customers.module.css";

export default function Customers() {
    return (
        <div className={styles.container}>
            <Suspense fallback={<ComponentLoader/>} >
                <Outlet />
            </Suspense>
        </div>
    );
}