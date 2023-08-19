import { Suspense } from "react";
import { Outlet } from "react-router-dom";

export default function AdminUser() {
    return (
        <Suspense>
            <Outlet />
        </Suspense>
    )
}