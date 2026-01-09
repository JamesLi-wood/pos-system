"use client";
import { useState } from "react";
import useValidateToken from "../hooks/useValidateToken";
import useFetchRestaurantData from "../hooks/useFetchRestaurantData";
import Link from "next/link";
import Takeout from "./takeout";
import Order from "./order";

const Table = () => {
  useValidateToken();
  const { menu, tables, loading } = useFetchRestaurantData();
  const [tableName, setTableName] = useState("");
  const [renderContent, setRenderContent] = useState("tables");
  const [mode, setMode] = useState("");

  const exitOrder = () => {
    setRenderContent("tables");
    setMode("");
  };

  const takeOrder = (table: string) => {
    setMode("order");
    setRenderContent("");
    setTableName(table);
  };

  const RenderTables = () => {
    return (
      <div className="flex justify-between h-full bg-black text-white">
        {loading ? (
          <div>LOADING</div>
        ) : (
          <div className="border mt-4 border-black flex-1 flex flex-col items-center gap-4">
            {tables.map((table) => {
              return (
                <div
                  id={table}
                  key={table}
                  className="h-[100px] w-[90%] rounded-xl border border-[rgb(211, 211, 211)] cursor-pointer justify-center items-center flex"
                  onClick={() => takeOrder(table)}
                >
                  {`Table ${table}`}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const RenderOrderHistory = () => {
    return <div>Order history</div>;
  };

  const Header = () => {
    return (
      <div className="flex">
        <div
          onClick={() => {
            setRenderContent("tables");
          }}
        >
          Tables
        </div>
        <div
          onClick={() => {
            setRenderContent("takeoutOrders");
          }}
        >
          Takeout
        </div>
        <div
          onClick={() => {
            setRenderContent("orderHistory");
          }}
        >
          Orders
        </div>
        <div>
          <Link
            className="w-[90%] rounded-xl bg-red-500 py-2 text-center"
            href={"/"}
          >
            BACK
          </Link>
        </div>
      </div>
    );
  };
  return (
    <>
      {renderContent ? (
        <>
          <Header />
          {renderContent == "tables" && <RenderTables />}
          {renderContent == "takeoutOrders" && (
            <Takeout takeOrder={() => takeOrder("takeout")} />
          )}
          {renderContent == "orderHistory" && <RenderOrderHistory />}
        </>
      ) : (
        <>
          {mode == "order" && (
            <Order menu={menu} tableName={tableName} exitOrder={exitOrder} />
          )}
        </>
      )}
    </>
  );
};

export default Table;
