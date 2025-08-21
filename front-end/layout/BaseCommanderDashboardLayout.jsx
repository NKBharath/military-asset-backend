import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import { Menu, X,  LogOut } from "lucide-react";

function BaseCommanderDashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="bg-[#0F1319] min-h-screen w-screen flex flex-col">
      <div className="bg-[#0F1319] text-white font-bold text-[16px] fixed top-0 left-0 w-full p-5 h-20 flex justify-between items-center z-20 border-b border-gray-700">
        <span className="px-3 py-1 border border-[#00A36C] rounded-3xl">
          Military Asset Management
        </span>
        <button
          className="md:hidden text-white"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
        <NavLink
          to="/login/basecommanderlogin"
          className="hidden md:flex items-center gap-2 absolute right-5 top-5 text-white font-medium hover:text-[#00A36C] transition"
        >
          <LogOut size={20} /> Logout
        </NavLink>
      </div>

      <div
        className={`bg-[#0F1319] border-r border-gray-700 text-white fixed top-20 left-0 h-full transform transition-transform duration-300 z-10
          w-2/3 sm:w-1/2 md:w-64 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:block`}
      >
        <div className="flex flex-col font-semibold">
          <NavLink
            to="/basecommanderdashboard/home"
            className={({ isActive }) =>
              `flex items-center gap-2 p-3 ${
                isActive
                  ? "bg-[rgb(39,44,53)] text-[#00A36C]"
                  : "text-white hover:bg-[rgb(39,44,53)]"
              }`
            }
          >
             Dashboard
          </NavLink>
          <NavLink
            to="/basecommanderdashboard/purchases"
            className={({ isActive }) =>
              `flex items-center gap-2 p-3 ${
                isActive
                  ? "bg-[rgb(39,44,53)] text-[#00A36C]"
                  : "text-white hover:bg-[rgb(39,44,53)]"
              }`
            }
          >
            Purchases
          </NavLink>
          <NavLink
            to="/basecommanderdashboard/transfers"
            className={({ isActive }) =>
              `flex items-center gap-2 p-3 ${
                isActive
                  ? "bg-[rgb(39,44,53)] text-[#00A36C]"
                  : "text-white hover:bg-[rgb(39,44,53)]"
              }`
            }
          >
            Transfers
          </NavLink>
        </div>
      </div>

      <div className="pt-24 md:pl-64 p-5">
        <Outlet />
      </div>
    </div>
  );
}

export default BaseCommanderDashboardLayout;
