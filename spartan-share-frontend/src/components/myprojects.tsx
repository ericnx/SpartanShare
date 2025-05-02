import React, { useState, useEffect, useRef } from "react";
import { useRouter } from"next/router";
// import NewProjectModal from "./newprojectmodal"

// const Projects = [
//   {
//     id: 1,
//     title: "Example Project 1",
//     majors: ["Computer Science", "Software Engr"],
//     skills: ["Full stack"],
//     duration: "6 months",
//   },

//   {
//     id: 2,
//     title: "Example Project 2",
//     majors: ["Mechanical Engr", "Software Engr"],
//     skills: ["C++", "C"],
//     duration: "1 Year",
//   },
// ];

type Project = {
  id: number;
  title: string;
  description: string;
  creator: { display_name: string };
  start_date: string;
  end_date: string;
  skills: string[];
  majors: string[];
  graduate_levels: string[];
}

export default function MyProjects() {
  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const modalRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access");

    if (!token) {
      alert("Please log in first.");
      router.push("/login");
      return;
    }

    // Fetch the projects this user created
    fetch("http://127.0.0.1:8000/api/projects/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);


  return (
    // <div className="max-w-6xl mx-auto">
    <div>
      <h2 className="text-6xl font-bold text-blue-700 mb-3 text-center">My Projects</h2>
      <hr className="mb-6 border border-blue-200"></hr>

      <div className="mb-10 flex justify-start">
        <div className="w-48 h-40 border border-gray-400 rounded-lg flex items-center justify-center 
                      text-gray-600 font-semibold text-xl hover:shadow cursor-pointer"
             onClick={() => setShowModal(true)}>
          + CREATE<br></br>
          NEW<br></br>
          PROJECT
        </div>
      </div>

      <h3 className="text-2xl font-bold mb-4">My Posted Projects:</h3>

      <div className="flex flex-wrap gap-10">
        {projects.map((project) => (
          <div key={project.id}
            className="w-64 border border-black shadow-sm">
            <div className="bg-sky-200 px-2 py-1 border-b border-black text-center font-bold">
              {project.title}
            </div>

            <div className="p-3 text-sm space-y-3">
              <div className="flex">
                <span className="font-semibold w-20 shrink-0">Majors:</span>
                <span className="whitespace-pre-wrap">{project.majors.join(", ")}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-20 shrink-0">Skills:</span>
                <span className="whitespace-pre-wrap">{project.skills.join(", ")}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-20 shrink-0">Dates:</span>
                <span>{project.start_date} → {project.end_date}</span>
              </div>
              {/* temporarily changed this, will find a way to make duration = end - start later */}
              {/* <div className="flex">
                <span className="font-semibold w-20 shrink-0">Duration:</span>
                <span className="whitespace-pre-wrap">{project.duration}</span>
              </div> */}
            </div>

            <div className="flex justify-between px-3 pb-3">
              <button className="text-blue-600 font-semibold hover:underline">Edit</button>
              <button className="text-red-600 font-semibold hover:underline">Delete Project</button>
            </div>
          </div>
        ))}
      </div>

      {/* {showModal && <NewProjectModal onClose={() => setShowModal(false)} />} */}
      {showModal && (
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
        <div ref={modalRef} className="bg-gray-100 border-2 border-black w-[600px] rounded-md shadow-lg">
          <h2 className="text-center text-lg font-bold bg-sky-200 py-0.5 border-b-2 border-black rounded">New Project</h2>
  
          <form className="space-y-5 p-6">
            <div className="flex justify-between">
              <label className="w-1/4 font-semibold">Enter Title:</label>
              <input type="text" placeholder="Title" className="w-3/4 border border-black rounded px-2 py-1"></input>
            </div>
  
            <div className="flex justify-between">
              <label className="w-1/4 font-semibold">Enter Description:</label>
              <textarea placeholder="Description" className="w-3/4 border border-black rounded px-2 py-1 h-24"></textarea>
            </div>
  
            <div className="flex justify-between">
              <label className="w-1/3 font-semibold">Start and End Date:</label>
              <div className="w-2/3 flex gap-2">
                <input type="date" className="border border-black rounded px-2"></input>
                <input type="date" className="border border-black rounded px-2"></input>
              </div>
            </div>
  
            <div className="flex justify-between">
              <label className="w-1/4 font-semibold">Skills Wanted:</label>
              <input type="text" placeholder="Skills" className="w-3/4 border border-black rounded px-2 py-1 h-12"></input>
            </div>
  
            <div className="flex justify-between">
              <label className="w-1/4 font-semibold">Graduate Level:</label>
              <select className="w-3/4 border border-black rounded px-2 py-1">
                <option value="" disabled hidden>Select Level</option>
                <option>Undergrad/Grad</option>
                <option>Undergrad</option>
                <option>Graduate</option>
              </select>
            </div>
  
            <div className="flex justify-between">
              <label className="w-1/4 font-semibold">Majors Wanted:</label>
              <select className="w-3/4  border border-black rounded px-2 py-1">
                <option value="" disabled hidden>Select Majors</option>
                <option>Computer Science</option>
                <option>Software Engr</option>
                <option>Computer Engr</option>
                <option>Mechanical Engr</option>
              </select>
            </div>
  
            <div className="flex justify-center gap-24 mt-6">
              <button 
                type="button"
                onClick={() => setShowModal(false)}
                className="px-8 py-0.5 border border-black bg-gray-200 hover:bg-gray-300 rounded">Cancel
              </button>
              <button 
                type="submit" 
                className="px-8 border border-black bg-gray-200 hover:bg-gray-300 rounded">Post Project
              </button>
            </div>
          </form>
        </div>
      </div>
      )}
    </div>
  )
}