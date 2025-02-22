"use client";
import ValidateToken from "../components/validateToken";
import { useState, useEffect } from "react";
import Table from "./table";

const TablePage = () => {
  const [menu, setMenu] = useState([]);
  const [tables, setTables] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/menu`)
      .then((res) => res.json())
      .then((data) => {
        setMenu(data.menu);
        setTables(data.tables);
      });
  }, []);

  return (
    <div className="h-full">
      <ValidateToken />
      <Table menu={menu} tables={tables} />
    </div>
  );
};

export default TablePage;
