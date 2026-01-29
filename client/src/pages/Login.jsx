import React, { useState } from "react";
import login from '../assets/login.webp'
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/slices/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("user loginned successfully")
    dispatch(loginUser({email,password}))
    navigate('/');

  }


  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch('http://localhost:9000/api/v1/user/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential: credentialResponse.credential,
        }),
      });

      const data = await res.json();
      console.log(data);  // You’ll get JWTs or user info
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <div className="flex">
      <div className="w-full md:w-1/2 flex-col flex justify-center items-center p-8 md:p-12">
        <form
          action=""
          className="w-full max-w-md bg-white p-8 rounded-lg border shadow-sm"
        >
          <div className="flex justify-center mb-6">
            <h2 className="text-xl font-medium">Rabbit</h2>
          </div>
          <h2 className="text-2xl font-bold mb-6">Hey There! ✋</h2>
          <p className="text-center mb-6">
            Enter your username and password to Login
          </p>
          <div className="mb-4 ">
            <label className="block text-sm font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your email address"
            />
          </div>
          <div className="mb-4 ">
            <label className="block text-sm font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            Sign In
          </button>

          <p className="mt-6 text-center text-sm ">Dont't have an account?
            <Link to="/register" className="text-blue-500">Register</Link>
          </p>
        </form>
        <div className="w-full max-w-md mt-4">
    <div className="flex items-center my-4">
      <hr className="flex-grow border-gray-300" />
      <span className="mx-3 text-sm text-gray-500">OR</span>
      <hr className="flex-grow border-gray-300" />
    </div>

    <div className="flex justify-center">
      <div className="scale-105 hover:scale-110 transition-transform">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => console.log("Login Failed")}
          />   
          </div>
    </div>
</div>
      </div>
      <div className="hidden md:block w-1/2 bg-gray-500">
        <div className="h-full flex flex-col justify-center items-center"><img src={login} alt="Login to account" className="w-full h-[750px] object-cover" /></div></div>
    </div>
  );
};

export default Login;
