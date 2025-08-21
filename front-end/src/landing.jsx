import { Shield, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
function LandingPage() {
    const navigate = useNavigate();
    return ( 
        <div>
            <div className="flex flex-col md:flex-row justify-between p-5 border border-b-gray-500 shadow-2xs shadow-gray-500">
              <div className="flex gap-5 items-center mb-4 md:mb-0">
                <Shield
                  className="text-[#008000] bg-[rgb(30,34,41)] p-1 rounded-xl border border-[#008000]"
                  size={50}
                />
                <div>
                  <h1 className="font-bold text-white text-2xl md:text-3xl">MAMS</h1>
                  <p className="text-gray-400 font-semibold text-sm md:text-base">
                    Military Asset Managment System
                  </p>
                </div>
              </div>
              <div className="hidden md:flex gap-2 items-center border border-[#175e17] rounded-xl p-1 hover:cursor-pointer self-start md:self-center"
                onClick={() => navigate("/login/adminlogin")}>
                    <Lock className="text-[#008000] m-2" size={22} />
                    <h1 className="text-white font-bold m-2 text-xl md:text-2xl">Login</h1>
                </div>
            </div>
            <div className="flex flex-col items-center px-4 md:px-10">
              <h1 className="text-[#008000] font-semibold border border-[#175e17b9] p-3 rounded-2xl w-fit mt-10 text-sm md:text-base lg:text-lg">
                SECRET SERVICES
              </h1>
              <h1 className="text-white font-bold text-4xl md:text-6xl lg:text-8xl mt-10 text-center">
                MILITARY ASSET
              </h1>
              <h1 className="text-[#008000] font-bold text-4xl md:text-6xl lg:text-8xl mt-1 text-center">
                MANAGEMENT SYSTEM
              </h1>
              <p className="text-[#9FA3AD] mt-4 font-semibold text-sm md:text-lg text-center max-w-3xl">
                Comprehensive tracking of military assets with real-time monitoring and
                complete accountability
              </p>
              <div className="flex flex-wrap justify-center gap-3 mt-7">
                <h1 className="font-semibold bg-[rgb(30,34,41)] p-3 md:p-4 text-white border-l-4 border-[#008000] text-sm md:text-base pl-2 rounded-xl">
                  Real - Time Dashboard
                </h1>
                <h1 className="font-semibold bg-[rgb(30,34,41)] p-3 md:p-4 text-white border-l-4 border-[#008000] text-sm md:text-base pl-2 rounded-xl">
                  Purchase Asset Management
                </h1>
                <h1 className="font-semibold bg-[rgb(30,34,41)] p-3 md:p-4 text-white border-l-4 border-[#008000] text-sm md:text-base pl-2 rounded-xl">
                  Inter-Base Transfers
                </h1>
                <h1 className="font-semibold bg-[rgb(30,34,41)] p-3 md:p-4 text-white border-l-4 border-[#008000] text-sm md:text-base pl-2 rounded-xl">
                  Personnel Assignments
                </h1>
                <h1 className="font-semibold bg-[rgb(30,34,41)] p-3 md:p-4 text-white border-l-4 border-[#008000] text-sm md:text-base pl-2 rounded-xl">
                  Role-Based Security
                </h1>
                <h1 className="font-semibold bg-[rgb(30,34,41)] p-3 md:p-4 text-white border-l-4 border-[#008000] text-sm md:text-base pl-2 rounded-xl">
                  Complete Logging
                </h1>
            </div>
              <div
                onClick={() => navigate("/login/adminlogin")}
                className="hover:cursor-pointer bg-[#008000] text-white rounded-[5px] hover:bg-[#006400] flex gap-4 items-center mt-10 md:mt-20 p-4 md:p-5"
>
                <Lock className="" size={22} />
                <h1 className="font-bold text-lg md:text-xl">ACCESS SYSTEM</h1>
              </div>
            </div>
        </div>

     );
}

export default LandingPage;