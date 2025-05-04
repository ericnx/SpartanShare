import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Profile() {
  // const [bio, setBio] = useState(
  //   "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  // );

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [biography, setBiography] = useState("");
  const [major, setMajor] = useState("");
  const [level, setLevel] = useState("");

  const router = useRouter();

  const token = typeof window !== "undefined" ? localStorage.getItem("access") : null;

  useEffect(() => {
    if (!token) {
      alert("Please log in.");
      router.push("/login");
      return;
    }

    fetch("http://127.0.0.1:8000/api/users/me/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Token may be invalid or expired");
        return res.json();
      })
      .then((data) => {
        setDisplayName(data.display_name);
        setEmail(data.email);
        setBiography(data.biography || "");
        setMajor(data.major || "");
        setLevel(data.level || "");
      })
      .catch((err) => {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        router.push("/login");
      });
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/users/me/", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          display_name: displayName,
          biography,
          major,
          level,
        }),
      });

      if (res.ok) {
        alert("Profile updated!");
      } else {
        alert("Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving profile.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-6xl font-bold text-blue-700 mb-3 text-center">
        Edit Profile
      </h2>
      <hr className="mb-6 border border-blue-200"></hr>

      <div className="mb-4">
        <label className="block text-xl font-semibold mb-1">Name:</label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full border border-gray-400 rounded px-3 py-2">
        </input>
      </div>

      <div className="mb-4">
        <p className="text-xl font-semibold inline-block w-16">Email:</p>
        <input
          type="email"
          value={email}
          disabled
          className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 cursor-not-allowed">
        </input>
      </div>

      <div className="mb-4">
        <label className="block text-xl font-semibold mb-1">Major:</label>
        <input
          type="text"
          value={major}
          onChange={(e) => setMajor(e.target.value)}
          className="w-full border border-gray-400 rounded px-3 py-2">
        </input>
      </div>

      <div className="mb-4">
        <label className="block text-xl font-semibold mb-1">Level:</label>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="w-full border border-gray-400 rounded px-3 py-2">
          <option value="" disabled hidden>Select Level</option>
          <option value="Undergrad">Undergraduate</option>
          <option value="Graduate">Graduate</option>
        </select>
      </div>

      <div className="mb-6 flex items-start">
        <label className="text-xl font-semibold flex-shrink-0 w-28">Biography:</label>
        <textarea 
          value={biography}
          onChange={(e) => setBiography(e.target.value)}
          className="w-full h-44 p-2 border border-gray-400 rounded resize-none">
          </textarea>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 shadow">Save Changes</button>
      </div>
    </div>
  );
}
