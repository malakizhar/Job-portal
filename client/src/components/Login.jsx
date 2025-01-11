import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [state, setState] = useState("Login");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isTextDataSubmited, setIsTextDataSubmited] = useState(false);
  const { setShowRecruiterLogin, backendUrl, setCompanyToken, setCompanyData } =
    useContext(AppContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (state === "Sign up" && !isTextDataSubmited) {
      setIsTextDataSubmited(true);
      return;
    }

    try {
      if (state === "Login") {
        const { data } = await axios.post(`${backendUrl}/api/company/login`, {
          email,
          password,
        });

        if (data.success) {
          setCompanyData(data.company);
          setCompanyToken(data.token);
          localStorage.setItem("companyToken", data.token);
          setShowRecruiterLogin(false);
          navigate("/dashboard");
        } else {
          toast.error(data.message);
        }
      } else {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        if (image) formData.append("image", image);

        const { data } = await axios.post(
          `${backendUrl}/api/company/register`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (data.success) {
          setCompanyData(data.company);
          setCompanyToken(data.token);
          localStorage.setItem("companyToken", data.token);
          setShowRecruiterLogin(false);
          navigate("/dashboard");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const buttonText =
    state === "Login"
      ? "Login"
      : isTextDataSubmited
      ? "Create Account"
      : "Next";

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
      <form
        onSubmit={onSubmitHandler}
        className="relative bg-white p-10 rounded-xl text-slate-500 w-full max-w-md mx-auto"
      >
        <h2 className="text-center text-2xl text-neutral-700 font-medium">
          Recruiter {state}
        </h2>
        <p className="text-sm">Welcome back! Please sign in to continue</p>

        {state === "Sign up" && isTextDataSubmited ? (
          <div className="mt-5">
            <label htmlFor="image-upload" className="cursor-pointer">
              <div className="border-2 border-dashed p-4 rounded-xl text-center">
                {imagePreview ? (
                  <div>
                    <img
                      src={imagePreview}
                      alt="Company Logo Preview"
                      className="w-32 h-32 object-cover rounded-full mx-auto"
                    />
                    <p className="mt-2">Company Logo Uploaded</p>
                  </div>
                ) : (
                  <>
                    <img
                      src={assets.upload_area}
                      alt="Upload area"
                      className="w-24 h-24 mx-auto"
                    />
                    <p>Upload Company Logo</p>
                  </>
                )}
              </div>
            </label>
            <input
              type="file"
              id="image-upload"
              hidden
              onChange={handleImageChange}
              aria-label="Upload Company Logo"
            />
          </div>
        ) : (
          <>
            {state !== "Login" && (
              <div className="border px-4 py-2 flex items-center gap-2 mt-5 rounded-full">
                <img src={assets.person_icon} alt="Person Icon" />
                <input
                  className="outline-none text-sm"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  placeholder="Company Name"
                  required
                />
              </div>
            )}

            <div className="border px-4 py-2 flex items-center gap-2 mt-5 rounded-full">
              <img src={assets.lock_icon} alt="Lock Icon" />
              <input
                className="outline-none text-sm"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="Email"
                required
              />
            </div>

            <div className="border px-4 py-2 flex items-center gap-2 mt-5 rounded-full">
              <img src={assets.lock_icon} alt="Lock Icon" />
              <input
                className="outline-none text-sm"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="Password"
                required
              />
            </div>
          </>
        )}
        {state === "Login" && (
          <p className="text-sm text-blue-600 my-4 cursor-pointer">
            Forgot password?
          </p>
        )}

        <button
          type="submit"
          className="bg-blue-600 w-full text-white py-2 mt-1 rounded-full"
        >
          {buttonText}
        </button>

        {state === "Login" ? (
          <p className="mt-5 text-center">
            Don’t have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => setState("Sign up")}
            >
              Sign up
            </span>
          </p>
        ) : (
          <p className="mt-5 text-center">
            Already have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => setState("Login")}
            >
              Login
            </span>
          </p>
        )}

        <img
          onClick={(e) => setShowRecruiterLogin(false)}
          src={assets.cross_icon}
          alt="Close Modal"
          className="absolute top-5 right-5 cursor-pointer"
        />
      </form>
    </div>
  );
};

export default Login;
