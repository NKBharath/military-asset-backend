import { Link } from "react-router-dom";
function LogisticOfficerLogin() {
    return (
        <div className="text-white flex gap-4 ">
                <Link to="/login/adminlogin">Admin</Link>
                <Link to="/login/basecommanderlogin">Base Commander</Link>

            </div>      
        
     );
}

export default LogisticOfficerLogin;