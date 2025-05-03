import React from "react";

const postedProjects = [
  { id: 1, title: "Example Project 1" },
  { id: 2, title: "Example Project 2" },
  { id: 3, title: "Example Project 3" },
];

const appliedProjects = [
  {
    id: 4,
    title: "Example Project 3.14159",
    majors: ["Applied Math"],
    skills: ["Basic Algebra", "Partial Differential Equations"],
    duration: "2 Years",
  },
];

export default function Applications() {
  return (
    <div className="p-10">
      <h2 className="text-6xl font-bold text-blue-700 mb-3 text-center">Applications</h2>
      <hr className="mb-6 border border-blue-200" />

      {/* My Projects */}
      <h3 className="text-2xl font-bold mb-4">My Projects:</h3>
      <div className="flex flex-wrap gap-6 mb-10">
        {postedProjects.map((project) => (
          <div key={project.id} className="w-64 border border-black">
            <div className="bg-sky-200 px-2 py-1 border-b border-black text-center font-bold">
              {project.title}
            </div>
            <div className="text-center py-2 border-t border-black hover:underline text-blue-600 cursor-pointer">
              View Applicants
            </div>
          </div>
        ))}
      </div>

      {/* Applied Projects */}
      <h3 className="text-2xl font-bold mb-4">Projects I have Applied to:</h3>
      <div className="flex flex-wrap gap-6">
        {appliedProjects.map((project) => (
          <div key={project.id} className="w-64 border border-black shadow-sm">
            <div className="bg-sky-200 px-2 py-1 border-b border-black text-center font-bold">
              {project.title}
            </div>
            <div className="p-3 text-sm space-y-3">
              <div className="flex">
                <span className="font-semibold w-20 shrink-0">Majors:</span>
                <span>{project.majors.join(", ")}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-20 shrink-0">Skills:</span>
                <span>{project.skills.join(", ")}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-20 shrink-0">Duration:</span>
                <span>{project.duration}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
