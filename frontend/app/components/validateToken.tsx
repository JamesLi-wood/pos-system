"use client";
import React, { useEffect } from "react";
import { redirect } from "next/navigation";

const ValidateToken = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userLog = sessionStorage.getItem("userConnected");

    if (!token) redirect("/auth");

    const payload = JSON.parse(atob(token.split(".")[1]));
    const hasTokenExpired = Date.now() > payload.exp * 1000;

    /* Continues session as long as the user's token is valid
    or is currently connected. */
    if (hasTokenExpired && !userLog) {
      localStorage.removeItem("token");
      redirect("/auth");
    }

    // Will connect the user as long as token hasn't expired.
    if (!userLog) {
      sessionStorage.setItem("userConnected", "true");
    }
  }, []);

  return <div>{children}</div>;
};

export default ValidateToken;
