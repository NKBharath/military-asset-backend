import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { baseCommanderLogin } from "../../controller/loginController";
import { User, Lock, LogIn } from "lucide-react";
import toast from "react-hot-toast";

function BaseCommanderLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (event) => {
    event.preventDefault();
    const formdata = { username, password };

    dispatch(baseCommanderLogin(formdata)).then((data) => {
      if (data?.payload?.success) {
        toast.success("Login successful!");
        navigate("/basecommanderdashboard/home");
      } else {
        toast.error(data?.payload?.message);
      }
    });
  };

  return (
  <div className="w-full flex flex-col items-center px-4 md:px-0">
    <div className="text-white flex flex-col gap-4 w-full max-w-md">
      <div className="flex flex-wrap justify-center items-center gap-3 text-lg font-semibold">
        <Link
          to="/login/adminlogin"
          className="hover:text-[#008000] transition px-4 py-2 rounded-lg">Admin</Link>
        <h1 className="bg-[#008000] text-white px-4 py-2 rounded-lg shadow">
          Base Commander
        </h1>
        <Link
          to="/login/logisticlogin"
          className="hover:text-[#008000] transition px-4 py-2 rounded-lg">Logistics Officer</Link>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 w-full mt-3  rounded-xl shadow-lg">
        <label className="font-medium text-gray-400">USERNAME</label>
        <div className="flex items-center bg-[#0F1319] border border-gray-500 rounded px-3 py-2">
          <User className="text-gray-400 mr-2" size={20} />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="User ID"
            required
            className="w-full outline-none text-gray-400 placeholder:text-gray-400 bg-transparent"
          />
        </div>
        <label className="font-medium text-gray-400">PASSWORD</label>
        <div className="flex items-center bg-[#0F1319] border border-gray-500 rounded px-3 py-2 mb-2">
          <Lock className="text-gray-400 mr-2" size={20} />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full outline-none text-gray-400 placeholder:text-gray-400 bg-transparent"
          />
        </div>
        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-[#008000] hover:bg-[#008C5A] transition text-white font-semibold py-2 rounded-lg shadow-md"
        >
          <LogIn size={20} />
          Login
        </button>
      </form>
    </div>
  </div>
);

}

export default BaseCommanderLogin;
