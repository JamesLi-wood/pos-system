"use client";
import React, { useState, createContext } from "react";
import SlideDown from "../components/slidedown";
import Ticket from "./ticket";
import MenuItem from "./menuItem";
import { MenuType, OrderType, TableContextType } from "../types";

export const tableContext = createContext<TableContextType | undefined>(
  undefined
);

const Order = ({
  menu,
  tableName,
  setInventory,
}: {
  menu: MenuType[];
  tableName: string;
  setInventory: Function;
}) => {
  const [options, setOptions] = useState<MenuType>(menu[0]);
  const [slidedownContent, setSlidedownContent] =
    useState<React.ReactNode | null>(null);
  const [selectedItem, setSelectedItem] = useState(0);
  const [currentOrder, setCurrentOrder] = useState<OrderType[]>([]);
  const [currentPrice, setCurrentPrice] = useState(0);

  const removeSlidedownContent = () => {
    setSlidedownContent(null);
  };

  const contextValue = {
    menu,
    tableName,
    setInventory,
    removeSlidedownContent,
    currentOrder,
    setCurrentOrder,
    currentPrice,
    setCurrentPrice,
  };

  return (
    <tableContext.Provider value={contextValue}>
      <div
        className={`bg-black text-white h-full ${
          slidedownContent && "pointer-events-none"
        }`}
      >
        <div className="flex gap-4">
          <div className="text-4xl">{tableName}</div>
          <button
            className="bg-red-500 p-2"
            onClick={() => setInventory(false)}
          >
            Return
          </button>
          <button
            className="bg-green-500 p-2"
            onClick={() => {
              setSlidedownContent(<Ticket />);
            }}
          >
            View Ticket
          </button>
        </div>

        <div className="border flex">
          <div className="border px-2">
            {menu.map((item, idx) => {
              return (
                <div
                  key={item.name}
                  className={`${
                    selectedItem === idx && "bg-gray-800"
                  } mb-2 cursor-pointer rounded-lg border-2 border-transparent p-2 hover:border-gray-300`}
                  onClick={() => {
                    setOptions(item);
                    setSelectedItem(idx);
                  }}
                >
                  {item.name}
                </div>
              );
            })}
          </div>

          <div className="w-full">
            <div>{options.name}</div>
            <div className="grid grid-cols-4">
              {options.data.map((item) => {
                return (
                  <div
                    key={item._id}
                    className="border cursor-pointer"
                    onClick={() => {
                      setSlidedownContent(<MenuItem item={item} />);
                    }}
                  >
                    <div>IMG</div>
                    <div>{item.name}</div>
                    <div>${item.price}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {slidedownContent && (
          <SlideDown handleClick={removeSlidedownContent}>
            {slidedownContent}
          </SlideDown>
        )}
      </div>
    </tableContext.Provider>
  );
};

export default Order;
