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

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [skills, setSkills] = useState("");
  const [majors, setMajors] = useState("");
  const [graduateLevel, setGraduateLevel] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("access");

    if (!token) {
      alert("You must be logged in to create a project.");
      return;
    }

    const body = {
      title,
      description,
      start_date: startDate,
      end_date: endDate,
      skills: skills.split(",").map(s => s.trim()),
      majors: majors.split(",").map(m => m.trim()),
      graduate_levels_wanted: [graduateLevel],
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/api/projects/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const newProject = await res.json();
        setProjects(prev => [...prev, newProject]);
        setShowModal(false);
        resetForm();
      } else {
        const err = await res.json();
        console.error("Failed to create project:", err);
        alert("Failed to create project.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong.");
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStartDate("");
    setEndDate("");
    setSkills("");
    setMajors("");
    setGraduateLevel("");
  };


  useEffect(() => {
    const token = localStorage.getItem("access");

    if (!token) {
      alert("Please log in first.");
      router.push("/login");
      return;
    }

    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    const isExpired = tokenPayload.exp * 1000 < Date.now();
    if (isExpired) {
      alert("Session expired. Please log in again.");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      router.push("/login");
    }

    fetch("http://127.0.0.1:8000/api/projects/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Projects fetch response:", data);
        if (Array.isArray(data)) {
          setProjects(data);
        } else {
          console.error("Expected array but got:", data);
          setProjects([]);  // fallback to empty
        }
      })
      .catch((err) => {
        console.error("Error fetching projects:", err);
        setProjects([]);
      });
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
  
          <form className="space-y-5 p-6" onSubmit={handleSubmit}>
            <div className="flex justify-between">
              <label className="w-1/4 font-semibold">Enter Title:</label>
              <input type="text" placeholder="Title" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-3/4 border border-black rounded px-2 py-1"></input>
            </div>
  
            <div className="flex justify-between">
              <label className="w-1/4 font-semibold">Enter Description:</label>
              <textarea placeholder="Description"
                onChange={(e) => setDescription(e.target.value)}
                className="w-3/4 border border-black rounded px-2 py-1 h-24"></textarea>
            </div>
  
            <div className="flex justify-between">
              <label className="w-1/3 font-semibold">Start and End Date:</label>
              <div className="w-2/3 flex gap-2">
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border border-black rounded px-2"></input>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}  className="border border-black rounded px-2"></input>
              </div>
            </div>
  
            <div className="flex justify-between">
              <label className="w-1/4 font-semibold">Skills Wanted:</label>
              <input type="text" placeholder="Skills"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-3/4 border border-black rounded px-2 py-1 h-12"></input>
            </div>
  
            <div className="flex justify-between">
              <label className="w-1/4 font-semibold">Graduate Level:</label>
              <select value={graduateLevel} onChange={(e) => setGraduateLevel(e.target.value)}
                className="w-3/4 border border-black rounded px-2 py-1">
                <option value="" disabled hidden>Select Level</option>
                <option value="Undergrad/Grad">Undergrad/Grad</option>
                <option value="Undergrad">Undergrad</option>
                <option value="Graduate">Graduate</option>
              </select>
            </div>
  
            {/* <div className="flex justify-between">
              <label className="w-1/4 font-semibold">Majors Wanted:</label>
              <select className="w-3/4  border border-black rounded px-2 py-1">
                <option value="" disabled hidden>Select Majors</option>
                <option>Computer Science</option>
                <option>Software Engr</option>
                <option>Computer Engr</option>
                <option>Mechanical Engr</option>
              </select>
            </div> */}

              <div className="flex justify-between">
                <label className="w-1/4 font-semibold">Majors Wanted:</label>
                <input type="text" placeholder="Comma-separated"
                  value={majors}
                  onChange={(e) => setMajors(e.target.value)}
                  className="w-3/4 border border-black rounded px-2 py-1">
                </input>
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