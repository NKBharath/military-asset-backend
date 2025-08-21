import {Route, Routes} from "react-router-dom";
import Loginlayout from "../layout/login";
import LogisticOfficerLogin from "../pages/Logistics-officer-login";
import AdminDashboardLayout from "../layout/AdminDashboard";
import CheckAuth from "../common/checkAuth";
import { useDispatch, useSelector } from "react-redux";
import AdminDashboard from "../pages/Admin/home";
import AdminLogin from "../pages/Admin/AdminLogin";
import AdminPurchases from "../pages/Admin/Purchases";
import AdminTransfers from "../pages/Admin/Transfers";
import BaseCommanderLogin from "../pages/BaseCommander/Base-commander-loign";
import BaseCommanderDashboardLayout from "../layout/BaseCommanderDashboardLayout";
import BaseCommanderDashboard from "../pages/BaseCommander/home";
import BaseCommanderPurchases from "../pages/BaseCommander/Purchases";
import BaseCommanderTransfers from "../pages/BaseCommander/Transfers";
import {Toaster} from "react-hot-toast";
import { useEffect } from "react";
import { loadUserFromStorage } from "../controller/loginController";
import LandingPage from "./landing";
function App() {
  const dispatch = useDispatch();
  const {user, isAuthenticated,rehydrated} = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);
  if(!rehydrated) {
    return <div>loading..</div>
  }
  
  return (
    <>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Loginlayout />}>
        <Route path="adminlogin" element={<AdminLogin />} />
        <Route path="basecommanderlogin" element={<BaseCommanderLogin/>}/>
        <Route path="logisticlogin" element={<LogisticOfficerLogin/>}/>
      </Route>
      <Route path="/admindashboard" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <AdminDashboardLayout/>
          </CheckAuth>}>
            <Route path="home" element={<AdminDashboard />} />
            <Route path="purchases" element={<AdminPurchases />} />
            <Route path="transfers" element={<AdminTransfers />} />
      </Route>
      <Route path="/basecommanderdashboard" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <BaseCommanderDashboardLayout/>
          </CheckAuth>}>
            <Route path="home" element={<BaseCommanderDashboard />} />
            <Route path="purchases" element={<BaseCommanderPurchases />} />
            <Route path="transfers" element={<BaseCommanderTransfers />} />
      </Route>
    </Routes>
    <Toaster
        position="bottom-right"
        toastOptions={{
          success: {
            style: {
              background: "#00A36C", // ✅ your previous color scheme
              color: "white",
            },
          },
          error: {
            style: {
              background: "#dc2626",
              color: "white",
            },
          },
        }}
      />
    </>
  )
}

export default App
