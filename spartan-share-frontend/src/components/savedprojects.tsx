import React, { useState, useEffect, useRef } from "react";
import { HeartIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";

// const savedProjects = [
//   {
//     id: 1,
//     title: "Example Project 1",
//     majors: ["Computer Science", "Software Engr"],
//     skills: ["Full stack"],
//     duration: "6 months",
//     favorited: true,
//   },

//   {
//     id: 2,
//     title: "Example Project 2",
//     majors: ["Mechanical Engr", "Software Engr"],
//     skills: ["C++", "C"],
//     duration: "1 Year",
//     favorited: true,
//   },
// ];

type Project = {
  id: number;
  title: string;
  description: string;
  majors: string[];
  skills: string[];
  start_date: string;
  end_date: string;
  graduate_levels: string[];
  creator: { display_name: string };
  favorited?: boolean;
};

export default function SavedProjects() {
  const [savedProjects, setSavedProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const modalRef = useRef(null);
  const router = useRouter();

  const handleToggleFavorite = async (projectId: number) => {
    const token = localStorage.getItem("access");
    if (!token) return;

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/projects/${projectId}/toggle_save/`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        setSavedProjects((prev) =>
          prev.filter((p) => p.id !== projectId)
        );
      } else {
        console.error("Failed to toggle favorite");
      }
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      alert("Please log in first.");
      router.push("/login");
      return;
    }

    fetch("http://127.0.0.1:8000/api/saved-projects/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setSavedProjects(
          data.map((project: Project) => ({
            ...project,
            favorited: true,
          }))
        );
      })
      .catch((err) => {
        console.error("Error loading saved projects:", err);
      });
  }, []);

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

  return (
    <div>
      <h2 className="text-6xl font-bold text-blue-700 mb-3 text-center">Saved Projects</h2>
      <hr className="mb-6 border border-blue-200"></hr>

      <div className="flex flex-wrap gap-10">
        {savedProjects.map((project) => (
          <div key={project.id}
            onClick={() => setSelectedProject(project)}
            className="w-64 border border-black shadow-sm flex flex-col cursor-pointer hover:shadow-lg">
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
              {/* <div className="flex">
                <span className="font-semibold w-20 shrink-0">Duration:</span>
                <span className="whitespace-pre-wrap">{project.duration}</span>
              </div> */}
              <div className="flex">
                <span className="font-semibold w-20 shrink-0">Dates:</span>
                <span>{project.start_date} → {project.end_date}</span>
              </div>
            </div>

            <div className="mt-auto flex justify-end px-3 pb-3">
              {/* <HeartIcon className={`h-5 w-5 cursor-pointer ${project.favorited ? "text-red-500" : "text-gray-400"}`}></HeartIcon> */}
              <HeartIcon
                onClick={() => handleToggleFavorite(project.id)}
                className={`h-5 w-5 cursor-pointer ${project.favorited ? "text-red-500" : "text-gray-400"
                  }`}
              ></HeartIcon>
            </div>
          </div>

        ))}
      </div>
      {selectedProject && (
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div ref={modalRef} className="bg-gray-100 border-2 border-black w-[600px] rounded-md shadow-lg">
            <div className="text-center text-lg font-bold bg-sky-200 py-0.5 border-b-2 border-black rounded">
              {selectedProject.title}
            </div>

            <div className="space-y-5 p-6 text-sm">
              <div className="flex">
                <span className="font-semibold w-32 shrink-0">Project Initiator:</span>
                <span className="font-semibold underline">{selectedProject.creator.display_name}</span>
              </div>

              <div className="flex">
                <span className="font-semibold w-32 shrink-0">Description:</span>
                <span className="whitespace-pre-wrap">{selectedProject.description}</span>
              </div>

              <div className="flex">
                <span className="font-semibold w-32 shrink-0">Dates:</span>
                <span>{selectedProject.start_date} - {selectedProject.end_date}</span>
              </div>

              <div className="flex">
                <span className="font-semibold w-32 shrink-0">Skills Wanted:</span>
                <span>{selectedProject.skills.join(", ")}</span>
              </div>

              <div className="flex">
                <span className="font-semibold w-32 shrink-0">Graduate Level:</span>
                <span>{selectedProject.graduate_levels.join(", ")}</span>
              </div>

              <div className="flex">
                <span className="font-semibold w-32 shrink-0">Majors Wanted:</span>
                <span>{selectedProject.majors.join(", ")}</span>
              </div>
            </div>

            <div className="flex justify-center gap-24 mt-6 pb-6">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-8 py-1 font-semibold border border-black rounded bg-gray-200 hover:bg-gray-300"
              >
                Close
              </button>
              <button className="px-8 py-1 bg-green-500 text-white font-semibold rounded hover:bg-green-600">
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}