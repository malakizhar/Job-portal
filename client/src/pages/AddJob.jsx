import React, { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css"; // Import Quill's CSS
import { JobCategories, JobLocations } from "../assets/assets";
import axios from "axios";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
const AddJob = () => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("Bangalore");
  const [category, setCategory] = useState("programming");
  const [level, setLevel] = useState("Beginner level");
  const [salary, setSalary] = useState(0);
  const editorRef = useRef(null);
  const quillRef = useRef(null); // Reference for the Quill instance

  const { companyToken } = useContext(AppContext);

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Write job description here...",
      });
    }
  }, []);

  const onSubmitHandle = async (e) => {
    e.preventDefault();
    try {
      if (!companyToken) {
        toast.error("Company token not found. Please log in.");
        return;
      }

      const description = quillRef.current.root.innerHTML;
      console.log({ title, location, category, level, salary, description });

      const { data } = await axios.post(
        "http://localhost:5000/api/company/post-job",
        { title, location, category, level, salary, description },
        {
          headers: { Authorization: `Bearer ${companyToken}` },
        }
      );

      if (data.success) {
        toast.success("Job added successfully");
        setTitle("");
        setSalary(0);
        quillRef.current.root.innerHTML = "";
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error posting job:", error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <form
      className="container p-4 flex flex-col w-full items-start gap-3"
      onSubmit={onSubmitHandle}
    >
      <div className="w-full">
        <p className="mb-2">Job Title</p>
        <input
          className="w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded"
          type="text"
          placeholder="Type here"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          required
        />
      </div>

      <div className="w-full max-w-lg">
        <p className="my-2">Job Description</p>
        <div ref={editorRef}></div>
      </div>

      <div className="flex gap-2 flex-col sm:flex-row w-full sm:gap-8">
        <div>
          <p className="mb-2">Job Category</p>
          <select
            className="w-full px-3 py-2 border-2 border-gray-300 rounded"
            onChange={(e) => setCategory(e.target.value)}
            value={category}
          >
            {JobCategories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-2">Job Location</p>
          <select
            className="w-full px-3 py-2 border-2 border-gray-300 rounded"
            onChange={(e) => setLocation(e.target.value)}
            value={location}
          >
            {JobLocations.map((location, index) => (
              <option key={index} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-2">Job Level</p>
          <select
            className="w-full px-3 py-2 border-2 border-gray-300 rounded"
            onChange={(e) => setLevel(e.target.value)}
            value={level}
          >
            <option value="Beginner level">Beginner level</option>
            <option value="Intermediate level">Intermediate level</option>
            <option value="senior level">senior level</option>
          </select>
        </div>
      </div>

      <div>
        <p className="mb-2">Job Salary</p>
        <input
          min={0}
          className="w-full px-3 py-2 border-2 border-gray-300 rounded sm:w-[120px]"
          onChange={(e) => setSalary(e.target.value)}
          value={salary}
          type="number"
          placeholder="25000"
        />
      </div>

      <button
        type="submit"
        className="w-28 py-3 mt-4 bg-black text-white rounded"
      >
        Add
      </button>
    </form>
  );
};

export default AddJob;
