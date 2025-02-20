"use client";
import { useState } from "react";
import { redirect } from "next/navigation";
const Auth = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState({
    state: false,
    message: "",
  });

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.token);
      sessionStorage.setItem("userConnected", "true");
      redirect("/table");
    } else {
      const error = await response.json();
      setError({
        state: true,
        message: error.message,
      });
    }
  };

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex h-full flex-col items-center justify-center bg-blue-500 text-xl text-white">
      <form
        onSubmit={handleSubmit}
        method="post"
        className={`flex w-[70%] flex-col items-center rounded-2xl border-2 py-8 ${
          error.state ? "border-red-600" : "border-white"
        }`}
      >
        <p>(RESTAURANT NAME) LOGIN</p>
        <div className="mb-4 flex w-4/5 flex-col">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            autoComplete="off"
            className="mt-1 h-8 border-none pl-4 text-base text-black outline-none"
          />
        </div>
        <div className="mb-4 flex w-4/5 flex-col">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="mt-1 h-8 border-none pl-4 text-base text-black outline-none"
          />
        </div>
        <div className="text-red-600">{error.state && error.message}</div>

        <input
          type="submit"
          placeholder="Login"
          name="login"
          className="hover:bg-[rgb(10,120,120)] h-8 w-4/5 cursor-pointer border-none bg-teal-500"
        />
      </form>
    </div>
  );
};

export default Auth;
