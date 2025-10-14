import { Outlet } from "react-router-dom";
import UserNavbar from "./userNav";
import UserHeader from "./userHead";

export default function UserLayout(){
    return(
        <div className="flex lg:flex-row flex-col min-w-screen h-screen">
            <UserNavbar />
            <div className="grow  bg-[#F2F4F7] flex flex-col order-1 ">
                <UserHeader />
                <div className="grow p-4 md:p-6 lg:p-10 overflow-y-auto mb-20 lg:mb-0">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}