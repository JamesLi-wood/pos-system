"use client";
import { useState } from "react";
import useValidateToken from "../hooks/useValidateToken";
import Sidebar from "../components/sidebar";
import Menu from "./menu/menu";
import Employees from "./employees";
import Link from "next/link";

const Dashboard = () => {
  useValidateToken();
  const [dashboardContent, setDashboardContent] = useState(<Menu />);

  return (
    <div className="flex h-full bg-black text-white">
      <Sidebar>
        <div className="flex flex-col gap-5 mx-5 my-10 w-max">
          <p className="text-2xl">Restaurant Name</p>
          <button
            className="rounded-lg bg-blue-500 py-2 hover:bg-blue-700"
            onClick={() => {
              setDashboardContent(<Menu />);
            }}
          >
            Menu
          </button>
          <button
            className="rounded-lg bg-blue-500 py-2 hover:bg-blue-700"
            onClick={() => {
              setDashboardContent(<Employees />);
            }}
          >
            Employees
          </button>

          <Link className="bg-red-500 text-center py-2" href={"/"}>
            BACK
          </Link>
        </div>
      </Sidebar>

      {dashboardContent}
    </div>
  );
};

export default Dashboard;
