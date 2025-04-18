"use client";
import { useState } from "react";
import Link from "next/link";
import Takeout from "./takeout";
import Order from "./order";
import { MenuType } from "../types";

const Table = ({
  menu,
  tables,
  loading,
}: {
  menu: MenuType[];
  tables: Array<string>;
  loading: boolean;
}) => {
  const [inventory, setInventory] = useState(false);
  const [tableName, setTableName] = useState("");

  const activateInventory = async (table: string) => {
    setInventory(true);
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
                  onClick={() => {
                    activateInventory(table);
                  }}
                >
                  {`Table ${table}`}
                </div>
              );
            })}
          </div>
        )}

        <div className="w-60 border-l-4 border-[rgb(61,61,61)] overflow-y-scroll scroll-hidden">
          <div className="flex w-full justify-center my-4">
            <Link
              className="w-[90%] rounded-xl bg-red-500 py-2 text-center"
              href={"/"}
            >
              BACK
            </Link>
          </div>

          <Takeout
            activateInventory={() => {
              activateInventory("takeout");
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      {!inventory ? (
        <RenderTables />
      ) : (
        <Order menu={menu} tableName={tableName} setInventory={setInventory} />
      )}
    </>
  );
};

export default Table;
