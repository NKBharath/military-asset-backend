import Sample from "./pages/sample";
import {Route, Routes} from "react-router-dom";
import Loginlayout from "../layout/login";
import AdminLogin from "../pages/AdminLogin";
import BaseCommanderLogin from "../pages/Base-commander-loign";
import LogisticOfficerLogin from "../pages/Logistics-officer-login";
import AdminDashboardLayout from "../layout/AdminDashboard";
import CheckAuth from "../checkAuth/checkAuth";
import { useSelector } from "react-redux";
function App() {
  const {user, isAuthenticated} = useSelector((state) => state.auth);
 
  return (
    <Routes>
      <Route path="/login" element={<Loginlayout />}>
        <Route path="adminlogin" element={<AdminLogin />} />
        <Route path="basecommanderlogin" element={<BaseCommanderLogin/>}/>
        <Route path="logisticlogin" element={<LogisticOfficerLogin/>}/>
      </Route>
      <Route path="/admindashboard" element={
        <CheckAuth isAuthenticated={isAuthenticated} user={user}>
          <AdminDashboardLayout/>
        </CheckAuth>}>
        <Route path="sample" element={<Sample />} />
      </Route>
    </Routes>
  )
}

export default App
