"use client";
import Table from "./table";
import useValidateToken from "../hooks/useValidateToken";
import useFetchRestaurantData from "../hooks/useFetchRestaurantData";

const TablePage = () => {
  useValidateToken();
  const { menu, tables, loading } = useFetchRestaurantData();

  return (
    <div className="h-full">
      <Table menu={menu} tables={tables} loading={loading} />
    </div>
  );
};

export default TablePage;
