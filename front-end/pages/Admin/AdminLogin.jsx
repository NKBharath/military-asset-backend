import { Link, useNavigate } from "react-router-dom";
import {  useState } from "react";
import { adminlogin } from "../../controller/loginController";
import { useDispatch } from "react-redux";
function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleSubmit = (event) =>{
        event.preventDefault();
        const formdata = {
            username,
            password
        };
        dispatch(adminlogin(formdata)).then((data)=>{
            if(data?.payload?.success){
                console.log(data);
                alert("Login successful!");
                navigate("/admindashboard/home");
            }else{
                console.log(data?.payload?.message);
            }
        })
    }
    return ( 
        <div>
            <div className="text-white flex flex-col gap-4 ">
                <div className="flex gap-3 text-2xl font-bold justify-center items-center">
                    <h1 className="bg-gray-200 text-black  p-2 ">Admin</h1>
                    <Link to="/login/basecommanderlogin">Base Commander</Link>
                    <Link to="/login/logisticlogin">Logistics Officer</Link>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-3/4">
                    <input type="text" value={username} onChange={(e)=> setUsername(e.target.value)}
                        placeholder="User ID" required className="bg-gray-200 p-2 rounded text-black"
                        />
                    <input type="password" value={password} onChange={(e)=> setPassword(e.target.value)}
                        placeholder="Password" required  className="bg-gray-200 p-2 rounded text-black"/>
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
     );
}

export default AdminLogin;