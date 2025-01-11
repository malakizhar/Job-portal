import React, { useContext, useState } from "react";
import { assets } from "../assets/assets.js";
import { Link } from "react-router-dom"; 
import { AppContext } from "../context/AppContext.jsx";

const Navbar = () => {
  // State to track user login status and user profile
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "user@example.com",
  }); // Simulate user data

  const { setShowRecruiterLogin } = useContext(AppContext);

  // Handle Logout
  const handleLogout = () => {
    setIsLoggedIn(false); // Simulate logging out
    setUserProfile(null); // Reset user profile
  };

  return (
    <div className="shadow py-4">
      <div className="container px-4 2xl:px-20 mx-auto flex justify-between items-center">
        <Link to="/">
          <img src={assets.logo} alt="Logo" />
        </Link>
        <div className="flex gap-4 max-sm:text-xs">
          {isLoggedIn ? (
            <>
              <div className="flex items-center gap-3">
                <div>
                  <Link to="/Application">
                    {" "}
                    <span className=" underline text-blue-700">
                      Applied Jobs
                    </span>
                  </Link>
                  <span> | </span>
                  <p className="max-sm:hidden">
                    Hi, {userProfile.firstName + " " + userProfile.lastName}
                  </p>
                </div>
                <Link to="/profile">
                  <button className=" px-6 sm:px-9 py-2 rounded-full flex items-center">
                    <img
                      src={assets.profile_img}
                      alt="Profile"
                      className="w-8 h-8 rounded-full mr-2"
                    />
                  </button>
                </Link>
              </div>
            </>
          ) : (
            <div className="flex gap-5">
              <Link to="">
                <button
                  className="border text-black px-6 sm:px-9 py-2 rounded-full hover:bg-gray-100 transition ease-in-out"
                  onClick={() => setShowRecruiterLogin(true)} // Simulate login
                >
                  Recruiter Login
                </button>
              </Link>
              <Link to="/signUp">
                <button
                  className="bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full hover:bg-blue-700 transition ease-in-out"
                  onClick={() => setIsLoggedIn(true)} // Simulate login
                >
                  Login
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
