import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function Applications() {
  const router = useRouter();
  const [appliedProjects, setAppliedProjects] = useState([]);
  const [myPostedProjects, setMyPostedProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access");
    const fetchPostedProjects = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/my-projects/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setMyPostedProjects(data);
      } catch (err) {
        console.error("Failed to fetch posted projects", err);
      }
    };

    fetchPostedProjects();
  }, []);

  useEffect(() => {
    const fetchAppliedProjects = async () => {
      const token = localStorage.getItem("access");

      if (!token) {
        alert("login to view your applications");
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("http://127.0.0.1:8000/api/applied-projects", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          console.log("data: ", data);
          setAppliedProjects(data);
        } else {
          const error = await res.json();
          alert(error.detail);
        }
      } catch (error) {
        console.log(error);
      }

      try {
        const res = await fetch("http://127.0.0.1:8000/api/applied-projects");
      } catch (error) {}
    };

    fetchAppliedProjects();
  }, []);

  const fetchApplicants = async (projectId) => {
    try {
      const token = localStorage.getItem("access");
      const res = await fetch(
        `http://127.0.0.1:8000/api/projects/${projectId}/view_applicants/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setApplicants(data);
      const selectedProject = myPostedProjects.find(
        (project) => project.id === projectId
      );
      setSelectedProject(selectedProject);
      setShowModal(true);
      console.log("Applicants:", data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-10">
      <h2 className="text-6xl font-bold text-blue-700 mb-3 text-center">
        Applications
      </h2>
      <hr className="mb-6 border border-blue-200" />

      {/* My Projects */}
      <h3 className="text-2xl font-bold mb-4">My Projects:</h3>
      <div className="flex flex-wrap gap-6 mb-10">
        {myPostedProjects.map((project) => (
          <div key={project.id} className="w-64 border border-black">
            <div className="bg-sky-200 px-2 py-1 border-b border-black text-center font-bold">
              {project.title}
            </div>
            <div
              className="text-center py-2 border-t border-black hover:underline text-blue-600 cursor-pointer"
              onClick={() => {
                fetchApplicants(project.id);
              }}
            >
              View Applicants
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[500px] max-h-[80vh] overflow-y-auto relative">
            <button
              className="absolute top-2 right-4 text-xl font-bold text-gray-600 hover:text-black"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
            <h2 className="text-xl p-1 font-bold mb-4 bg-sky-200 border border-black text-center">
              Applicants for {selectedProject?.title}
            </h2>
            {applicants.length === 0 ? (
              <p className="text-gray-600 text-center">No applicants yet.</p>
            ) : (
              <ul className="space-y-4 bg-gray-100 list-decimal">
                {applicants.map((applicant) => (
                  <ol
                    key={applicant.id}
                    className="border rounded p-4 shadow-sm flex flex-col justify-between h-full"
                  >
                    <div className="flex flex-col mb-4">
                      <p className="text-lg font-bold">
                        {applicant.display_name}
                      </p>
                      <p className="text-sm">Email: {applicant.email}</p>
                      <p className="text-sm">
                        Biography: {applicant.biography}
                      </p>
                    </div>

                    <div className="flex justify-center items-center space-x-4">
                      <button
                        title="Accept"
                        className="border font-semibold text-sm h-3 m-4 p-3 bg-green-500 flex justify-center items-center rounded-md"
                      >
                        Accept
                      </button>
                      <button
                        title="Reject"
                        className="border font-semibold text-sm h-3 p-3 bg-red-500 flex justify-center items-center rounded-md"
                      >
                        Reject
                      </button>
                    </div>
                  </ol>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

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
                <span className="font-semibold w-20 shrink-0">Dates:</span>
                <span>
                  {project.start_date} → {project.end_date}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
