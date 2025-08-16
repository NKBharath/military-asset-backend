import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {useSelector} from "react-redux";
import {getAdminDashboard} from "../controller/AdminDashboardController";
function AdminDashboardLayout() {
    const [value, setValue] = useState();
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        const fetchData = async () => {
            if(!token){
                console.error("No token found");
                return;
            }
            try {
                const data = await getAdminDashboard(token);
                console.log(data);
                setValue(data.message);
            } catch (error) {
                console.error("Error fetching admin dashboard data:", error);
            }
        };

        fetchData();
    }, [token]);

    return ( <div className="bg-[#a18b32] h-screen">
        <div className="bg-[#132F18] text-white font-bold text-2xl text-center fixed top-0 left-0 w-full p-5 h-20">Military Asset Managment
            <Link to="/login" className="absolute right-5 top-5 text-white font-medium">Logout</Link>
        </div>
        <div className="bg-[#132F18] text-white p-5 h-full w-1/6 fixed top-20 left-0 flex flex-col font-semibold ">Side Bar
        <div>{value}</div></div>
        
    </div> );
}

export default AdminDashboardLayout;