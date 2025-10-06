import { Outlet } from "react-router-dom";
import UserNavbar from "./userNav";
import UserHeader from "./userHead";

export default function UserLayout(){
    return(
        <div className="flex">
            <UserNavbar />
            <div className="grow min-h-screen bg-[#F2F4F7] flex flex-col ">
                <UserHeader />
                <div className="grow p-5">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}