import {Link, Outlet} from "react-router-dom";
function Loginlayout() {
    return ( 
        <div className="bg-[#a18b32] min-h-screen justify-center items-center flex flex-col">
            <div className="bg-[#132F18] flex flex-col justify-center items-center p-8 rounded-lg">
                <h1 className="text-2xl text-white font-bold mb-4">Login</h1>
                
                <Outlet />
            </div>
        </div>
     );
}

export default Loginlayout;