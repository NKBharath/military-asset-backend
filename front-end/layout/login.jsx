import { Outlet } from "react-router-dom";
import { LogIn, Shield } from "lucide-react";

function Loginlayout() {
  return (
    <div className="bg-[#0F1319] min-h-screen flex justify-center items-center px-4">
      <div className="bg-[#1A1F29] flex flex-col justify-center items-center p-8 rounded-2xl shadow-lg w-full max-w-md">
        <div className="flex items-center space-x-2 mb-6">
          <Shield className="text-[#008000]" size={28} />
          <h1 className="text-2xl text-[#F1F2F4] font-bold">Login</h1>
        </div>
        <p className="text-[#A0A4A8] text-sm mb-6 text-center">
          Secure access to the Military Asset Management system
        </p>
        <div className="w-full">
          <Outlet />
        </div>
        <div className="flex items-center space-x-2 mt-6 text-[#A0A4A8] text-sm">
          <LogIn size={18} className="text-[#008000]" />
          <span>Authorized Personnel Only</span>
        </div>
      </div>
    </div>
  );
}

export default Loginlayout;
