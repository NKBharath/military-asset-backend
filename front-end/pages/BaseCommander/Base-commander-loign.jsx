import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { baseCommanderLogin } from "../../controller/loginController";

function BaseCommanderLogin() {
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
        dispatch(baseCommanderLogin(formdata)).then((data)=>{
            if(data?.payload?.success){
                alert("Login successful!");
                navigate("/basecommanderdashboard/home");
            }else{
                console.log(data?.payload?.message);
            }
        })
    }
    return (
        <div>
            <div className="text-white flex gap-4 ">
                <Link to="/login/adminlogin">Admin</Link>
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
    );
}

export default BaseCommanderLogin;