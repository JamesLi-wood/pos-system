"use client";
import { useState, useEffect } from "react";
import Table from "./table";
import useValidateToken from "../hooks/useValidateToken";

const TablePage = () => {
  useValidateToken();
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
      <Table menu={menu} tables={tables} />
    </div>
  );
};

export default TablePage;
