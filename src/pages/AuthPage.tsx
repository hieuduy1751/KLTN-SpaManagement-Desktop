import { useState } from "react";
import { Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/reduxHooks";
import { doLogin } from "../store/slices/authSlice";
import { adminSignUp } from "../services/admin.service";
import { message } from "antd";

export default function AuthPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formSubmit = async (e: any) => {
    setErrorMessage("");
    setLoading(true);
    e.preventDefault();
    if (!isSigningUp) {
      dispatch(
        doLogin({
          email,
          password,
        })
      )
        .unwrap()
        .then(() => navigate("/home/accounts"))
        .catch((err) => {
          setErrorMessage(err.message);
          setLoading(false);
        });
    } else {
      if (confirmPassword !== password) {
        setErrorMessage("Password doesn't match");
      } else {
        if (
          await adminSignUp({
            username,
            password,
            confirmPassword,
            email,
          })
        ) {
          messageApi.open({
            type: "success",
            content: "Sign Up successfully",
          });
          setIsSigningUp(false)
          setLoading(false)
        } else {
          messageApi.open({
            type: "error",
            content: "Sign Up failed!",
          });
          setLoading(false)
        }
      }
    }
  };

  const handleSwitchMode = () => {
    setIsSigningUp((prev) => !prev);
  };

  return (
    <div className="w-full h-[100vh] flex justify-center items-center">
      {contextHolder}
      <div className="w-50">
        <h4 className="text-4xl font-bold mb-4">
          {isSigningUp ? "Sign Up" : "Login"}
        </h4>
        <form className="flex flex-col gap-4" onSubmit={formSubmit}>
          {isSigningUp && (
            <input
              type="text"
              placeholder="Username"
              className="border border-gray-300 p-2 rounded-md"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          )}

          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 p-2 rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border border-gray-300 p-2 rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {isSigningUp && (
            <input
              type="password"
              placeholder="Confirm Password"
              className="border border-gray-300 p-2 rounded-md"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}
          <small className="text-red-500">{errorMessage}</small>
          <button
            type="submit"
            className="bg-white text-green-500 border p-2 rounded-md"
          >
            <Spin className="mr-3" spinning={loading} />
            {isSigningUp ? "Sign Up" : "Login"}
          </button>
          <button
            type="button"
            className="text-blue-500 border-none p-2 rounded-md"
            onClick={handleSwitchMode}
          >
            {isSigningUp ? "Login" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
