import React, { useState } from "react";
import { useRouter } from 'next/router';
import Link from "next/link";
import Profile from "../components/profile";
import MyProjects from "../components/myprojects";
import BrowseProjects from "../components/browseprojects";
import SavedProjects from "../components/savedprojects";
import Applications from "../components/applications";

export default function Home() {
  const [selected, setSelected] = useState("projects");
  const router = useRouter();

  const renderContent = () => {
    switch (selected) {
      case "profile":
        return <Profile></Profile>;
      case "my-projects":
        return <MyProjects></MyProjects>;
      case "projects":
        return <BrowseProjects></BrowseProjects>;
      case "saved-projects":
        return <SavedProjects></SavedProjects>;
      case "applications":
        return <Applications></Applications>;
      default:
        return <BrowseProjects></BrowseProjects>;
    }
  };

  const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    router.push('/login');
  };

  return (
    <div className="flex h-screen">
      
      <aside className="w-96 bg-sky-200 flex flex-col justify-between">
        <div>

          <div className="px-6 py-8">
            <img src="/logo2.png" alt="Logo" className="mx-auto w-40"></img>
          </div>

          <nav className="flex flex-col items-center gap-5 px-4">
            <button
              onClick={() => setSelected("profile")}
              className="w-56 py-2 bg-blue-700 text-white font-bold rounded-md hover:bg-blue-800"
            >Profile</button>
            
            <button
              onClick={() => setSelected("my-projects")}
              className="w-56 py-2 bg-white text-black font-bold border border-gray-300 rounded-md hover:bg-gray-100"
            >My Projects</button>

            <button
              onClick={() => setSelected("projects")}
              className="w-56 py-2 bg-blue-700 text-white font-bold rounded-md hover:bg-blue-800"
            >Browse Projects</button>

            <button
              onClick={() => setSelected("saved-projects")}
              className="w-56 py-2 bg-white text-black font-bold border border-gray-300 rounded-md hover:bg-gray-100"
            >Saved Projects</button>

            <button
              onClick={() => setSelected("applications")}
              className="w-56 py-2 bg-blue-700 text-white font-bold rounded-md hover:bg-blue-800"
            >Applications</button>
          </nav>
        </div>

        <div>
          {/* <Link
            href="/login"
            className="text-blue-600 hover:underline flex items-center gap-1"
          >
            <span className="text-xl">◀Log Out</span>
          </Link> */}
          <button onClick={logout} className="text-blue-600 hover:underline flex items-center gap-1">◀Log Out</button>
        </div>
      </aside>

      <main className="flex-grow p-10 overflow-y-auto bg-white relative">
        {renderContent()}
      </main>
    </div>
  );
}