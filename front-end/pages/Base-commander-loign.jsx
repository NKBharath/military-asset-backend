import { Link } from "react-router-dom";
function BaseCommanderLogin() {
    return (
        <div>
            <div className="text-white flex gap-4 ">
                <Link to="/login/adminlogin">Admin</Link>
                <Link to="/login/logisticlogin">Logistics Officer</Link>
            </div>
            
        </div>
    );
}

export default BaseCommanderLogin;