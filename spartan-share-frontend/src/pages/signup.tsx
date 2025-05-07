import React from "react";
import { useState } from "react";
import {
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!email || !password || !name) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          // username: email,
          display_name: name,
          email: email,
          password: password,
          major: "",
          level: "",
        }),
      });

      const payload = await res.json(); // read raw response

      if (res.ok) {
        alert("Account created!");
        window.location.href = "/login";
      } else {
        console.error("Signup error:", payload);
        alert("Signup failed: " + JSON.stringify(payload));
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("An error occurred during signup.");
    }
  };

  return (
    <div className="flex h-screen bg-sky-200">
      <div className="w-2/3 flex items-center justify-center">
        <img src="/logo1.png" alt="Logo" />
      </div>
      <div className="w-px h-full bg-gray-600"></div>
      <div className="w-1/5 p-8 ml-auto mr-auto my-auto">
        <h1 className="text-4xl text-center font-bold mb-6">
          Create Your Account
        </h1>

        <form onSubmit={handleSubmit}>
          <div>
            <label className="block text-base font-medium mb-1">Name</label>
            <div className="relative mb-3">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-blue-700"></UserIcon>
              </span>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 p-2 border border-gray-400 rounded-md"
              ></input>
            </div>
            <label className="block text-base font-medium mb-1">
              SJSU Email address
            </label>
            <div className="relative mb-3">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeIcon className="h-5 w-5 text-blue-700"></EnvelopeIcon>
              </span>
              <input
                type="email"
                placeholder="email@sjsu.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 p-2 border border-gray-400 rounded-md"
              ></input>
            </div>
          </div>

          <div>
            <label className="block text-base font-medium mb-1">
              Enter Password
            </label>
            <div className="relative mb-3">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-blue-700"></LockClosedIcon>
              </span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 p-2 border border-gray-400 rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-base font-medium mb-1">
              Confirm Password
            </label>
            <div className="relative mb-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-blue-700"></LockClosedIcon>
              </span>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 p-2 border border-gray-400 rounded-md"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-3 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold"
          >
            Create Account
          </button>
        </form>

        <div className="flex justify-center my-4">
          <span className="px-2 text-black">--OR--</span>
        </div>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 underline">
            Log in here
          </a>
        </p>
      </div>
    </div>
  );
}
