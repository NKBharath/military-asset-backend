import { NavLink, Outlet } from "react-router-dom";
import BaseCommanderDashboard from "../pages/BaseCommander/home";

function BaseCommanderDashboardLayout() {

  return (
    <div className="bg-[#a18b32] h-screen fixed left-0 w-screen">
      <div className="bg-[#132F18] text-white font-bold text-2xl text-center fixed top-0 left-0 w-full p-5 h-20">
        Military Asset Managment
        <NavLink
          to="/login"
          className="absolute right-5 top-5 text-white font-medium"
        >
          Login
        </NavLink>
      </div>
      <div className="bg-[#132F18] text-white p-5 h-full w-1/6 fixed top-20 left-0 flex flex-col font-semibold gap-2">
        <NavLink
          to="/admindashboard/home"
          className={({ isActive }) =>
            `p-2 rounded-xl ${
              isActive ? "bg-[#a18b32] text-white" : "bg-gray-200 text-black hover:bg-[#a18b32]"
            }`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/admindashboard/purchases"
          className={({ isActive }) =>
            `p-2 rounded-xl ${
              isActive ? "bg-[#a18b32] text-white" : "bg-gray-200 text-black hover:bg-[#a18b32]"
            }`
          }
        >
          Purchases
        </NavLink>

        <NavLink
          to="/admindashboard/transfers"
          className={({ isActive }) =>
            `p-2 rounded-xl ${
              isActive ? "bg-[#a18b32] text-white" : "bg-gray-200 text-black hover:bg-[#a18b32]"
            }`
          }
        >
          Transfers
        </NavLink>
      </div>

      <div className="ml-[16.7%] mt-20 p-3 flex flex-col gap-2">
        <Outlet />
      </div>
    </div>
  );
}

export default BaseCommanderDashboardLayout;
