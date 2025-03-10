"use client";
import Link from "next/link";
import useValidateToken from "../hooks/useValidateToken";
import { useState } from "react";
import Menu from "./menu/menu";
import Employees from "./employees";

const Dashboard = () => {
  useValidateToken();
  const [dashboardContent, setDashboardContent] = useState(<Menu />);

  return (
    <div className="flex h-full bg-black text-white">
      <div className="border-8 border-y-0 border-l-0 border-t-none border-r-gray-500 justify-between flex flex-col h-full py-10 px-7">
        <div className="scroll-hidden flex flex-col gap-2 overflow-y-scroll">
          <p className="border border-black text-2xl mb-4">Restaurant Name</p>
          <button
            className="bg-gray-500 hover:bg-gray-800 py-3 rounded-lg"
            onClick={() => {
              setDashboardContent(<Menu />);
            }}
          >
            Menu
          </button>
          <button
            className="bg-gray-500 hover:bg-gray-800 py-3 rounded-lg"
            onClick={() => {
              setDashboardContent(<Employees />);
            }}
          >
            Employees
          </button>
          <button></button>
        </div>

        <Link className="bg-red-500" href={"/"}>
          BACK
        </Link>
      </div>
      {dashboardContent}
    </div>
  );
};

export default Dashboard;
