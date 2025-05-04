import React, { useState, useEffect, useRef } from "react";
import { HeartIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";

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
  favorited: boolean;
  has_applied: boolean;
};

export default function BrowseProjects() {
  const [search, setSearch] = useState("");
  const [selectedMajor, setSelectedMajor] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const modalRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) return;

    // Fetch projects
    fetch("http://127.0.0.1:8000/api/projects/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setProjects(data);
      })
      .catch((err) => console.error("Failed to fetch projects", err));

    // Fetch current user info
    fetch("http://127.0.0.1:8000/api/users/me/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((userData) => setCurrentUser(userData.display_name))
      .catch((err) => console.error("Failed to fetch user", err));
  }, []);

  const handleToggleFavorite = async (projectId: number) => {
    const token = localStorage.getItem("access");
    if (!token) {
      alert("Please log in to favorite projects.");
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/projects/${projectId}/toggle_save/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        const updated = await res.json();
        setProjects((prev) =>
          prev.map((p) => (p.id === projectId ? updated : p))
        );
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setSelectedProject(null);
      }
    };

    if (selectedProject) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedProject]);

  const handleApply = async (projectId: number) => {
    const token = localStorage.getItem("access");
    if (!token) {
      alert("Please log in to apply.");
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/projects/${projectId}/apply/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.ok) {
        alert("Application submitted!");
        setProjects((prev) =>
          prev.map((p) =>
            p.id === projectId ? { ...p, has_applied: true } : p
          )
        );
        setSelectedProject(null);
      } else {
        const error = await res.json();
        alert(error.detail || "Failed to apply.");
      }
    } catch (err) {
      console.error("Error applying:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <div>
      <h2 className="text-6xl font-bold text-blue-700 mb-3 text-center">
        Browse Projects
      </h2>
      <hr className="mb-6 border border-blue-200"></hr>

      <div className="flex items-center justify-center gap-4 mb-6">
        <input
          type="text"
          placeholder="🔍Search Title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-400 rounded px-3 py-2 w-5/12"
        ></input>

        <select
          value={selectedMajor}
          onChange={(e) => setSelectedMajor(e.target.value)}
          className="bg-gray-200 border border-gray-400 rounded px-2 py-2 w-36"
        >
          <option value="" disabled hidden>
            Major
          </option>
          <option>Computer Science</option>
          <option>Software Engr</option>
          <option>Mechanical Engr</option>
        </select>

        <select
          value={selectedDuration}
          onChange={(e) => setSelectedDuration(e.target.value)}
          className="bg-gray-200 border border-gray-400 rounded px-2 py-2 w-36"
        >
          <option value="" disabled hidden>
            Duration
          </option>
          <option>1 Month</option>
          <option>3 Months</option>
          <option>6 Months</option>
          <option>1 Year+</option>
        </select>
      </div>

      {/* <div className="relative"> */}
      <div className="flex flex-wrap justify-center gap-10">
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => setSelectedProject(project)}
            className="w-64 border  border-black shadow-sm cursor-pointer hover:shadow-lg flex flex-col"
          >
            <div className="bg-sky-200 px-2 py-1 border-b border-black text-center font-bold">
              {project.title}
            </div>

            <div className="p-3 text-sm space-y-3">
              <div className="flex">
                <span className="font-semibold w-20 shrink-0">Majors:</span>
                <span className="whitespace-pre-wrap">
                  {project.majors.join(", ")}
                </span>
              </div>
              <div className="flex">
                <span className="font-semibold w-20 shrink-0">Skills:</span>
                <span className="whitespace-pre-wrap">
                  {project.skills.join(", ")}
                </span>
              </div>
              <div className="flex">
                {/* <span className="font-semibold w-20 shrink-0">Duration:</span>
                  <span className="whitespace-pre-wrap">{project.duration}</span> */}
                {/* temporarily changed this, will find a way to make duration = end - start later */}
                <span className="font-semibold w-20 shrink-0">Dates:</span>
                <span>
                  {project.start_date} → {project.end_date}
                </span>
              </div>
            </div>

            {/* <div className="flex justify-end px-3 pb-3">
                <HeartIcon className={`h-5 w-5 cursor-pointer ${project.favorited ? "text-red-500" : "text-gray-400"}`}></HeartIcon>
              </div> */}
            <div className="mt-auto flex justify-end px-3 pb-3">
              <HeartIcon
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleFavorite(project.id);
                }}
                className={`h-5 w-5 cursor-pointer ${
                  project.favorited ? "text-red-500" : "text-gray-400"
                }`}
              />
            </div>
          </div>
        ))}
      </div>

      {selectedProject && (
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="bg-gray-100 border-2 border-black w-[600px] rounded-md shadow-lg"
          >
            <div className="text-center text-lg font-bold bg-sky-200 py-0.5 border-b-2 border-black rounded">
              {selectedProject.title}
            </div>

            <div className="space-y-5 p-6">
              <div className="flex">
                <span className="font-semibold w-32 shrink-0">
                  Project Initiator:
                </span>{" "}
                <span className="font-semibold underline cursor-pointer whitespace-pre-wrap">
                  {selectedProject.creator.display_name}
                </span>
              </div>

              <div className="flex">
                <span className="font-semibold w-32 shrink-0">
                  Description:
                </span>
                <span className="whitespace-pre-wrap">
                  {selectedProject.description}
                </span>
              </div>

              <div className="flex">
                <span className="font-semibold w-32 shrink-0">Dates:</span>
                <span className="whitespace-pre-wrap">
                  {selectedProject.start_date} - {selectedProject.end_date}
                </span>
              </div>

              <div className="flex">
                <span className="font-semibold w-32 shrink-0">
                  Skills Wanted:
                </span>
                <span className="whitespace-pre-wrap">
                  {selectedProject.skills.join(", ")}
                </span>
              </div>

              <div className="flex">
                <span className="font-semibold w-32 shrink-0">
                  Graduate Level:
                </span>
                <span className="whitespace-pre-wrap">
                  {selectedProject.graduate_levels.join(", ")}
                </span>
              </div>

              <div className="flex">
                <span className="font-semibold w-32 shrink-0">
                  Majors Wanted:{" "}
                </span>
                <span className="whitespace-pre-wrap">
                  {selectedProject.majors.join(", ")}
                </span>
              </div>
            </div>

            <div className="flex justify-center gap-24 mt-6 pb-6">
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="px-8 py-1 font-semibold border border-black rounded bg-gray-200 hover:bg-gray-300"
              >
                Close
              </button>
              {/* <button
                onClick={() => handleApply(selectedProject.id)}
                className="px-8 py-1 bg-green-500 text-white font-semibold rounded hover:bg-green-600"
              >
                Apply
              </button> */}
              {/* {selectedProject.has_applied ? (
                <div className="px-8 py-1 bg-gray-300 text-black font-semibold rounded">
                  Already Applied
                </div>
              ) : (
                <button
                  onClick={() => handleApply(selectedProject.id)}
                  className="px-8 py-1 bg-green-500 text-white font-semibold rounded hover:bg-green-600"
                >
                  Apply
                </button>
              )} */}
              {selectedProject.creator.display_name === currentUser ? (
                <div className="px-8 py-1 bg-gray-300 text-black font-semibold rounded">
                  This is your project
                </div>
              ) : selectedProject.has_applied ? (
                <div className="px-8 py-1 bg-gray-300 text-black font-semibold rounded">
                  Already Applied
                </div>
              ) : (
                <button
                  onClick={() => handleApply(selectedProject.id)}
                  className="px-8 py-1 bg-green-500 text-white font-semibold rounded hover:bg-green-600"
                >
                  Apply
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
    // </div>
  );
}
