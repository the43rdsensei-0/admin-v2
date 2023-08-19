import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import ComponentLoader from "src/components/Loaders/ComponentLoader";

export default function AdminAccess () {
    return (
        <div>
            <Suspense fallback={<ComponentLoader />}>
                <Outlet />
            </Suspense>
        </div>
    );
}