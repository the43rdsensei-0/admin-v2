import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import ComponentLoader from "src/components/Loaders/ComponentLoader";

export default function Verifications() {
    return (
        <Suspense fallback={<ComponentLoader />}>
            <Outlet />
        </Suspense>
    )
}