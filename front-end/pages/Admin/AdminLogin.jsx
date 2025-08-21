import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { adminlogin } from "../../controller/loginController";
import { useDispatch } from "react-redux";
import { User, Lock, LogIn } from "lucide-react";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (event) => {
    event.preventDefault();
    const formdata = { username, password };

    dispatch(adminlogin(formdata)).then((data) => {
      if (data?.payload?.success) {
        alert("Login successful!");
        navigate("/admindashboard/home");
      } else {
        console.log(data?.payload?.message);
      }
    });
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-white flex flex-col gap-4 w-full max-w-md">
        <div className="flex flex-wrap justify-center items-center gap-3 text-lg font-semibold">
          <h1 className="bg-[#00A36C] text-white px-4 py-2 rounded-lg shadow">
            Admin
          </h1>
          <Link
            to="/login/basecommanderlogin"
            className="hover:text-[#00A36C] transition"
          >
            Base Commander
          </Link>
          <Link
            to="/login/logisticlogin"
            className="hover:text-[#00A36C] transition"
          >
            Logistics Officer
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-full bg-[#1A1F29] p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center bg-gray-200 rounded px-3 py-2">
            <User className="text-gray-600 mr-2" size={20} />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="User ID"
              required
              className="w-full bg-transparent outline-none text-black"
            />
          </div>

          <div className="flex items-center bg-gray-200 rounded px-3 py-2">
            <Lock className="text-gray-600 mr-2" size={20} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full bg-transparent outline-none text-black"
            />
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-[#00A36C] hover:bg-[#008C5A] transition text-white font-semibold py-2 rounded-lg shadow-md"
          >
            <LogIn size={20} />
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
