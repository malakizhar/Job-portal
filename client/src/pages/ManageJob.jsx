import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";
function ManageJob() {
  const navigate = useNavigate();
  const { companyToken } = useContext(AppContext);
  const [jobs, setJobs] = useState([]); // Initialize jobs as an empty array

  // Fetch company jobs from the backend API
  const fetchCompanyJobs = async () => {
    try {
      console.log("Fetching jobs...");
      const { data } = await axios.get(
        "http://localhost:5000/api/company/list-jobs",
        {
          headers: { Authorization: `Bearer ${companyToken}` },
        }
      );

      if (data.success) {
        setJobs([...data.jobData].reverse()); // Set jobs state with fetched data
        console.log("Jobs fetched:", data.jobData);
      } else {
        toast.error(data.message); // Show error if no jobs found
      }
    } catch (error) {
      console.error("Error fetching company jobs:", error);
      toast.error("An error occurred while fetching jobs.");
    }
  };

  //functin  to change jobvisibility
  const changeJobVisibility = async (id) => {
    try {
      const { data } = await axios.post(
        `http://localhost:5000/api/company/change-visibility`,
        {
          id,
        },
        {
          headers: { Authorization: `Bearer ${companyToken}` },
        }
      );
      if (data.success) {
        toast.success(data.message);
        fetchCompanyJobs();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error changing job visibility:", error);
      toast.error(error.message);
    }
  };

  // Call fetchCompanyJobs when companyToken is available
  useEffect(() => {
    if (companyToken) {
      fetchCompanyJobs();
    }
  }, [companyToken]);

  return (
    <div className="container mx-auto p-4">
      <div>
        <table className="w-full max-w-4xl bg-white border border-gray-200 max-sm:text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4 text-left">#</th>
              <th className="py-2 px-4 text-left">Job Title</th>
              <th className="py-2 px-4 text-left max-sm:hidden">Date</th>
              <th className="py-2 px-4 text-left max-sm:hidden">Location</th>
              <th className="py-2 px-4 text-left">Applicants</th>
              <th className="py-2 px-4 text-left">Visible</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job, index) => (
              <tr className="text-gray-700 mt-2" key={job._id}>
                <td className="py-2 px-4 border-b ml-5 mt-2 text-center">
                  {index + 1}
                </td>
                <td className="py-2 px-4 border-b ml-5 mt-2 text-center flex">
                  <span>{job.title}</span>
                </td>
                <td className="py-2 px-4 ml-5 border-b max-sm:hidden">
                  {moment(job.date).format("ll")} {/* Format the date */}
                </td>
                <td className="py-2 px-4 ml-5 border-b max-sm:hidden">
                  {job.location}
                </td>
                <td className="py-2 px-4 border-b ml-5">
                  {job.noOfApplicants} {/* Display the number of applicants */}
                </td>
                <td className="py-2 px-4 border-b ml-5">
                  <div className="relative inline-block text-left group">
                    <input
                      onChange={() => changeJobVisibility(job._id)}
                      className="scale-125 ml-4"
                      type="checkbox"
                      checked={job.visible}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Button Container for better alignment */}
        <div className="flex justify-end mt-4">
          <button
            onClick={() => navigate("/dashboard/add-job")} // Placeholder for adding functionality
            className="w-28 py-3 bg-black text-white rounded"
          >
            Add New Job
          </button>
        </div>
      </div>
    </div>
  );
}

export default ManageJob;
