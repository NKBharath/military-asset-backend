import { Link } from "react-router-dom";
function LogisticOfficerLogin() {
    return (
    <div className="w-full flex justify-center">
      <div className="text-white flex flex-wrap gap-4 text-lg font-semibold">
        <Link
          to="/login/adminlogin"
          className="hover:text-[#00A36C] transition px-4 py-2 rounded-lg"
        >
          Admin
        </Link>
        <Link
          to="/login/basecommanderlogin"
          className="bg-[#00A36C] text-white px-4 py-2 rounded-lg shadow"
        >
          Base Commander
        </Link>
      </div>
    </div>
  );
}

export default LogisticOfficerLogin;