"use client";
import { useState } from "react";
import Link from "next/link";
import Takeout from "./takeout";
import Order from "./order";
import { MenuType } from "../types";

const Table = ({
  menu,
  tables,
}: {
  menu: MenuType[];
  tables: Array<string>;
}) => {
  const [inventory, setInventory] = useState(false);
  const [tableName, setTableName] = useState("");

  const activateInventory = async (table: string) => {
    setInventory(true);
    setTableName(table);
  };

  const RenderTables = () => {
    return (
      <div className="flex justify-between h-full">
        <div>
          {tables.map((table) => {
            return (
              <div
                id={table}
                key={table}
                className="h-[100px] w-[100px] border border-red-500"
                onClick={() => {
                  activateInventory(table);
                }}
              >
                {`Table ${table}`}
              </div>
            );
          })}
        </div>

        <div className="w-60 border border-red-500 overflow-y-scroll scroll-hidden">
          <Link className="bg-red-500" href={"/"}>
            BACK
          </Link>
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
