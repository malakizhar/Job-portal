import { createContext, useEffect, useState } from "react";
import { jobsData } from "../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";
const AppContext = createContext();

export const AppContextProvider = (props) => {
  const [searchFilter, setSearchFilter] = useState({
    title: "",
    location: "",
  });
  const [isSearch, setIsSearch] = useState();
  const [jobs, setJobs] = useState([]);
  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);
  const [companyToken, setCompanyToken] = useState(null);
  const [companyData, setCompanyData] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const[userData, setUserData] = useState(null);
  const[userApplication, setUserApplication] = useState([]);

  const fetchJobs = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs`);
      if (data.success) {
        setJobs(data.jobs);
        console.log(data.jobs);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //fuction to fetch company data
  const fetchCompanyData = async () => {
    if (!companyToken) {
      console.error("No company token found, please log in.");
      return;
    }

    try {
      const { data } = await axios.get(`${backendUrl}/api/company/company`, {
        headers: {
          Authorization: `Bearer ${companyToken}`,
        },
      });

      console.log("Response Data:", data); // Log the entire response

      if (data.success) {
        setCompanyData(data.Company);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching company data:", error); // Log the error if something goes wrong
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (companyToken) {
      fetchCompanyData();
    }
  }, [companyToken]);

  useEffect(() => {
    fetchJobs();

    const storedCompanyToken = localStorage.getItem("companyToken");
    if (storedCompanyToken) {
      setCompanyToken(storedCompanyToken);
    }
  }, []);

  const value = {
    searchFilter,
    setSearchFilter,
    isSearch,
    setIsSearch,
    jobs,
    setShowRecruiterLogin,
    setJobs,
    showRecruiterLogin,
    companyToken,
    setCompanyToken,
    companyData,
    backendUrl,
    setCompanyData,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export { AppContext };
