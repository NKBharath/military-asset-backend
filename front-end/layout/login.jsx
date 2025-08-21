import { Outlet } from "react-router-dom";
import { Lock, LogIn, Shield } from "lucide-react";

function Loginlayout() {
  return (
    <div className=" min-h-screen flex flex-col justify-center items-center px-4">
      <div className="bg-[rgb(30,34,41)] border border-[#175e17b9] flex flex-col justify-center items-center p-8 rounded-2xl shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center space-y-2 mb-4">
          <Shield className="text-[#008000] bg-[rgb(30,34,41)] p-1 rounded-xl border border-[#008000]" size={50} />
          <h1 className="font-bold text-white text-2xl md:text-3xl">SYSTEM ACCESS</h1>
        </div>
        <p className="text-gray-400 font-semibold text-sm mb-6 text-center">
          Secure access to the Military Asset Management system
        </p>
        <div className="w-full">
          <Outlet />
        </div>
        <div className=" flex items-center space-x-2 mt-6 text-[#A0A4A8] text-sm">
          <LogIn size={18} className="text-[#008000]" />
          <span>Authorized Personnel Only</span>
        </div>

      </div>
      <div className="flex items-center mt-7 bg-[#f800001e] p-5 gap-2 border border-[#f800004c]">
        <Lock className="text-gray-400 " size={20} />
        <p className="text-gray-400 text-sm">
          SECURITY NOTICE: All activities are monitored and logged
        </p>
      </div>
    </div>
  );
}

export default Loginlayout;
