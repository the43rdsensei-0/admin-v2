import { Suspense } from "react";
import { Outlet } from "react-router";

export default function Profile() {
    return (
        <Suspense>
            <Outlet />
        </Suspense>
    )
}