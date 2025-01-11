import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { assets, jobsApplied } from "../assets/assets";
import moment from "moment";

const Application = () => {
  const [isEdit, setEdit] = useState(false);
  const [resume, setResume] = useState(null);

  const handleResumeUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setResume(uploadedFile);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container px-4 min-h-[65vh] 2xl:px20 mx-auto my-10">
        <h2 className="text-xl font-semibold">Your Resume</h2>
        <div className="flex gap-2 mb-6 mt-3">
          {isEdit ? (
            <>
              <label
                className="flex items-center  gap-2"
                htmlFor="resumeUpload"
              >
                <p className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg mr-2">
                  Select Resume
                </p>
                <input
                  id="resumeUpload"
                  onChange={handleResumeUpload}
                  accept="application/pdf"
                  type="file"
                  hidden
                />
                <img src={assets.profile_upload_icon} alt="" />
                <button
                  className="bg-green-100 text-green-600 px-4   py-2 rounded-lg"
                  onClick={() => setEdit(false)}
                >
                  Save
                </button>
              </label>
            </>
          ) : (
            <div className="flex gap-2">
              <a
                className="bg-blue-100 text-blue-600 px-4 py-2
               rounded-lg"
                href=""
              >
                Resume
              </a>
              <button
                onClick={() => setEdit(true)}
                className="text-gray-500 border-2 border-gray-300 rounded-lg px-4 py-2"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        <h2 className="text-xl font-semibold mb-4">Jobs Applied</h2>
        <table className="min-w-full  bg-white border rounded-lg">
          <thead className="">
            <tr className="">
              <th className="py-3 px-4 border-b text-left">Company</th>
              <th className="py-3 px-4 border-b text-left">Job Title</th>
              <th className="py-3 px-4 border-b text-left max-sm:hidden">
                Location
              </th>
              <th className="py-3 px-4 border-b text-left">Date</th>
              <th className="py-3 px-4 border-b text-left">Status</th>
            </tr>
          </thead>

          <tbody className="">
            {jobsApplied.map((job, index) =>
              true ? (
                <tr key={index}>
                  <td className="py-3 px-4 flex items-center gap-2 border-b">
                    <img
                      src={job.logo}
                      alt={`${job.company} logo`}
                      className="w-8 h-8"
                    />
                    {job.company}
                  </td>
                  <td className="py-2 px-4 border-b">{job.title}</td>
                  <td className="py-2 px-4 border-b max-sm:hidden">
                    {job.location}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {moment(job.date).format("ll")}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <span
                      className={`${
                        job.status === "Accepted"
                          ? "bg-green-300 "
                          : job.status === "Rejected"
                          ? "bg-red-300"
                          : "bg-blue-300"
                      } px-4 py-1.5 rounded`}
                    >
                      {job.status}
                    </span>
                  </td>
                </tr>
              ) : null
            )}
          </tbody>
        </table>
      </div>

      <Footer />
    </>
  );
};

export default Application;
