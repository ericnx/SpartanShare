import React, { useState, useEffect } from "react";

export default function Profile() {
  const [bio, setBio] = useState("");
  const [user, setUser] = useState<{
    display_name: string;
    email: string;
  } | null>(null);

  const storedUser = localStorage.getItem("user");
  const userData = JSON.parse(storedUser);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      const token = userData.user.token;

      if (token) {
        fetch("http://localhost:8000/profile/details/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            setUser({ ...data, token }); // add token back so handleSave still works
            setBio(data.biography || "");
          })
          .catch((err) => console.error("Failed to fetch profile:", err));
      }
    }
  }, []);

  const handleSave = async () => {
    console.log("token ", userData.user.token);
    try {
      const res = await fetch("http://localhost:8000/profile/update/", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${userData.user.token}`,
        },
        body: JSON.stringify({ biography: bio }),
      });

      if (res.ok) {
        alert("Biography updated successfully");
      } else {
        const errorData = await res.json();
        alert("Failed to update bio: " + JSON.stringify(errorData));
      }
    } catch (error) {
      console.error("Update bio error:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-6xl font-bold text-blue-700 mb-3 text-center">
        Edit Profile
      </h2>
      <hr className="mb-6 border border-blue-200"></hr>

      <div className="mb-4">
        <p className="text-xl font-semibold inline-block w-16">Name:</p>
        <span className="text-xl">{user?.display_name || "Loading..."}</span>
      </div>

      <div className="mb-4">
        <p className="text-xl font-semibold inline-block w-16">Email:</p>
        <span className="text-xl">{user?.email || "Loading..."}</span>
      </div>

      <div className="mb-6 flex items-start">
        <label className="text-xl font-semibold flex-shrink-0 w-28">
          Biography:
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full h-44 p-2 border border-gray-400 rounded resize-none"
        ></textarea>
      </div>

      <div className="flex justify-center">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 shadow"
          onClick={handleSave}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
