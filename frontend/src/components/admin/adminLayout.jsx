import { Outlet } from "react-router-dom";
import AdNavbar from "./adminNav";
import Header from "./header";

export default function AdminLayout(){
    return(
        <div className="flex lg:flex-row flex-col min-w-screen h-screen">
            <AdNavbar />
            <div className="grow  bg-[#F2F4F7] flex flex-col order-1">
                <Header />
                <div className="grow p-4 md:p-6 lg:p-10">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}