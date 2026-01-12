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

  const exitOrder = (renderContent: string) => {
    setRenderContent(renderContent);
    setMode("");
  };

  const takeOrder = (table: string) => {
    setMode("order");
    setRenderContent("");
    setTableName(table);
  };

  const RenderTables = () => {
    return (
      <div className="flex justify-between">
        {loading ? (
          <div>LOADING</div>
        ) : (
          <div className="mt-4 flex-1 flex flex-col items-center gap-4">
            {tables.map((table) => {
              return (
                <div
                  id={table}
                  key={table}
                  className="h-[100px] w-full rounded-xl border border-[rgb(211, 211, 211)] cursor-pointer justify-center items-center flex"
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
    const contents = [
      {
        title: "Tables",
        renderContent: "tables",
      },
      {
        title: "Takeout",
        renderContent: "takeoutOrders",
      },
      {
        title: "Orders",
        renderContent: "orderHistory",
      },
    ];

    return (
      <div className="gap-3 flex py-4">
        {contents.map((content) => {
          return (
            <button
              key={content.title}
              className="bg-blue-600 hover:bg-blue-800 p-3 rounded-lg"
              onClick={() => {
                setRenderContent(content.renderContent);
              }}
            >
              {content.title}
            </button>
          );
        })}

        <button className="bg-red-600 hover:bg-red-800 p-3 rounded-lg">
          <Link href={"/"}>BACK</Link>
        </button>
      </div>
    );
  };
  return (
    <div className="bg-black text-white h-full">
      {renderContent ? (
        <div className="h-full px-10">
          <Header />
          {renderContent == "tables" && <RenderTables />}
          {renderContent == "takeoutOrders" && (
            <Takeout takeOrder={() => takeOrder("takeout")} />
          )}
          {renderContent == "orderHistory" && <RenderOrderHistory />}
        </div>
      ) : (
        <>
          {mode == "order" && (
            <Order menu={menu} tableName={tableName} exitOrder={exitOrder} />
          )}
        </>
      )}
    </div>
  );
};

export default Table;
