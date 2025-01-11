import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
const SignUp = () => {
  const [isNewUser, setIsNewUser] = useState(false); // State to track user status
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(null); // null will be the initial state to handle loading
  const navigate = useNavigate(); // Hook to handle navigation

  // Check if user is logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // true if token exists, false otherwise
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isNewUser) {
        const response = await axios.post(
          "http://localhost:5000/api/users/register",
          {
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
          }
        );
        console.log(response);
        setIsNewUser(false);
        navigate("/");
      } else {
        const response = await axios.post(
          "http://localhost:5000/api/users/login",
          {
            email: formData.email,
            password: formData.password,
          }
        );
        console.log(response);
        localStorage.setItem("token", response.data.token);
        setIsLoggedIn(true);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center">
        <div className="max-w-sm bg-gradient-to-b from-white to-blue-50 rounded-3xl p-6 border-4 border-white shadow-lg shadow-blue-200 m-5">
          {isLoggedIn ? (
            <div className="text-center font-extrabold text-2xl text-blue-500">
              You are logged in!
            </div>
          ) : (
            <>
              <div className="text-center font-extrabold text-2xl text-blue-500">
                {isNewUser ? "Sign Up" : "Sign In"}
              </div>
              <form onSubmit={handleSubmit} className="mt-5">
                <input
                  placeholder="E-mail"
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-white border-none py-3 px-4 rounded-xl mt-4 shadow-md shadow-cyan-100 focus:outline-none focus:border-cyan-500 placeholder-gray-400"
                />
                <input
                  placeholder="Password"
                  id="password"
                  name="password"
                  type="password"
                  onChange={handleChange}
                  value={formData.password}
                  required
                  className="w-full bg-white border-none py-3 px-4 rounded-xl mt-4 shadow-md shadow-cyan-100 focus:outline-none focus:border-cyan-500 placeholder-gray-400"
                />
                {isNewUser && (
                  <input
                    placeholder="Confirm Password"
                    id="confirm-password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    type="password"
                    required
                    className="w-full bg-white border-none py-3 px-4 rounded-xl mt-4 shadow-md shadow-cyan-100 focus:outline-none focus:border-cyan-500 placeholder-gray-400"
                  />
                )}
                {!isNewUser && (
                  <span className="block mt-2 ml-2 text-xs text-blue-500">
                    <a href="#" className="no-underline">
                      Forgot Password?
                    </a>
                  </span>
                )}
                <input
                  defaultValue={isNewUser ? "Sign Up" : "Sign In"}
                  type="submit"
                  className="block w-full font-bold bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 mt-5 rounded-xl shadow-lg hover:scale-105 hover:shadow-xl active:scale-95 active:shadow-md transition-transform"
                />
              </form>
              {!isNewUser && (
                <div className="mt-6">
                  <span className="block text-center text-xs text-gray-400">
                    Or Sign in with
                  </span>
                  <div className="flex justify-center gap-4 mt-2">
                    <GoogleLogin
                      onSuccess={(credentialResponse) => {
                        console.log(credentialResponse);
                        const token = credentialResponse.credential;
                        localStorage.setItem("googleToken", token);
                        navigate("/");
                      }}
                      onError={() => {
                        console.log("Google Login Failed");
                      }}
                      useOneTap
                    />
                  </div>
                </div>
              )}
              <span className="block text-center mt-4">
                <a href="#" className="text-blue-500 text-xs no-underline">
                  Learn user licence agreement
                </a>
              </span>
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => setIsNewUser(!isNewUser)}
                  className="text-blue-500 text-xs no-underline"
                >
                  {isNewUser
                    ? "Already have an account? Sign In"
                    : "Don’t have an account? Sign Up"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SignUp;
