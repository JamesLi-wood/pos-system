"use client";
import { useState } from "react";
import { login } from "@/actions/login";
import { redirect } from "next/navigation";

const Auth = () => {
  const [errorMsg, setErrorMsg] = useState("");

  async function handleLogin(formData: FormData) {
    const result = await login(formData);

    if (result.error) {
      setErrorMsg(result.error);
    } else {
      localStorage.setItem("token", result.token);
      sessionStorage.setItem("userConnected", "true");
      redirect("/table");
    }
  }

  return (
    <div className="flex h-full flex-col items-center justify-center bg-blue-500 text-xl text-white">
      <form
        action={handleLogin}
        className={`flex w-[70%] flex-col items-center rounded-2xl border-2 py-8 ${
          errorMsg ? "border-red-600" : "border-white"
        }`}
      >
        <h1>POS LOGIN</h1>
        <div className="mb-4 flex w-4/5 flex-col">
          <label>Username</label>
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="mt-1 h-8 border-none pl-4 text-base text-black outline-none"
            required
          />
        </div>
        <div className="mb-4 flex w-4/5 flex-col">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="mt-1 h-8 border-none pl-4 text-base text-black outline-none"
            required
          />
        </div>

        {errorMsg && <div className="text-red-600">{errorMsg}</div>}

        <button className="hover:bg-[rgb(10,120,120)] h-8 w-4/5 cursor-pointer border-none bg-teal-500">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Auth;
