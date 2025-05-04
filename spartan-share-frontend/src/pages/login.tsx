import React from "react";
import { useState } from "react";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const res = await fetch("http://127.0.0.1:8000/api/token/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  
    const data = await res.json();
  
    if (res.ok) {
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      alert("Login successful!");
      // Optionally navigate to dashboard or home
      router.push("/home");
    } else {
      alert("Login failed");
      console.error("Login error:", data);
    }
  };

  const handleSignupRedirect = () => {
    router.push("/signup");
  };

  // const login = async () => {
  //   const res = await fetch('http://127.0.0.1:8000/api/token/', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ email, password }),
  //   });

  //   const data = await res.json();
  //   if (res.ok) {
  //     localStorage.setItem('access', data.access);
  //     localStorage.setItem('refresh', data.refresh);
  //     alert('Login successful!');
  //   } else {
  //     alert('Login failed');
  //     console.error(data);
  //   }
  // };

  return (
    <div className="flex h-screen bg-sky-200">
      {/* Please input our logo over here */}
      <div className="w-2/3 flex items-center justify-center">
        <img src="/logo1.png" alt="Logo" />
      </div>

      <div className="w-px h-full bg-gray-600"></div>

      <div className="w-1/5 p-8 ml-auto mr-auto my-auto">
        <h1 className="text-5xl text-center font-bold mb-6">Login</h1>

        <form onSubmit={handleSubmit}>
          <div>
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
                className="w-full pl-10 p-2 border border-gray-400 rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-base font-medium mb-1">
              Enter Password
            </label>
            <div className="relative mb-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-blue-700"></LockClosedIcon>
              </span>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-10 p-2 border border-gray-400 rounded-md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-3 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold"
          >
            Login
          </button>

          <div className="flex justify-center my-4">
            <span className="px-2 text-black">--OR--</span>
          </div>

          <p className="text-center mt-4">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-600 underline">
              Sign up here
            </a>
          </p>

          {/* <button type="button"
            onClick={handleSignupRedirect}
            className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold"
            >Create New Account</button> */}
        </form>
      </div>
    </div>
  );
}
