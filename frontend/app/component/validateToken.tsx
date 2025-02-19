"use client";
import React, { useEffect } from "react";
import { redirect } from "next/navigation";

const ValidateToken = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) redirect("/auth");

    const payload = JSON.parse(atob(token.split(".")[1]));
    const expirationDate = payload.exp * 1000;
    if (Date.now() > expirationDate) {
      localStorage.removeItem("token");
      redirect("/auth");
    }
  }, []);

  return <div>{children}</div>;
};

export default ValidateToken;
