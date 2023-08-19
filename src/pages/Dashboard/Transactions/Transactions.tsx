import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import ComponentLoader from "../../../components/Loaders/ComponentLoader";

export default function Transactions() {
    return (
        <Suspense fallback={<ComponentLoader/>} >
            <Outlet />
        </Suspense>
    );
}