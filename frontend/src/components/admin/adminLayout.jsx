import { Outlet } from "react-router-dom";
import AdNavbar from "./adminNav";
import Header from "./header";

export default function AdminLayout(){
    return(
        <div className="flex">
            <AdNavbar />
            <div className="grow min-h-screen bg-[#F2F4F7] flex flex-col ">
                <Header />
                <div className="grow p-5">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}