import { Navigate, useLocation } from "react-router-dom";

const CheckAuth = ({isAuthenticated, user, children}) => {
    console.log("User:", user);
    const location = useLocation();

    if(!isAuthenticated && !(
        location.pathname.includes("/login") 
    )) {
        return <Navigate to="/login/Adminlogin" />;
    }

    if(isAuthenticated && location.pathname.includes("/login")) {
        if(user.role === "admin"){
            return <Navigate to="/admindashboard/home" />;
        } else if(user.role === "base commander") {
            return <Navigate to="/basecommanderdashboard/home" />;
        }
    }
    if(isAuthenticated && user.role === "admin" && location.pathname.includes("/basecommanderdashboard")){
        return <Navigate to="/admindashboard/home" />;
    }
    return children;
}
export default CheckAuth;