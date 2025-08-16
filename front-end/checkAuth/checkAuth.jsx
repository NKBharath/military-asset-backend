import { Navigate } from "react-router-dom";

const CheckAuth = ({isAuthenticated, user, children}) => {
    console.log("User:", user);
    
    if(!isAuthenticated || user?.role !== "admin"){
        alert("You are not authorized to access this page");
        return <Navigate to="/login/adminlogin"  />;
    }
    return children;
}
export default CheckAuth;