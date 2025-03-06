"use client";
import React, { useState, createContext, useMemo } from "react";
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

  const handleMenuLoad = useMemo(() => {
    return menu.map((item, idx) => {
      return (
        <p
          key={item.name}
          className={`${
            selectedItem === idx && "bg-gray-800"
          } cursor-pointer text-center rounded-lg p-2 border-transparent border-2 hover:border-gray-300`}
          onClick={() => {
            setOptions(item);
            setSelectedItem(idx);
          }}
        >
          {item.name}
        </p>
      );
    });
  }, [selectedItem]);

  const handleOptionsLoad = useMemo(() => {
    return options.data.map((item) => {
      return (
        <div
          key={item._id}
          className="border cursor-pointer h-40"
          onClick={() => {
            setSlidedownContent(<MenuItem item={item} />);
          }}
        >
          <div>IMG</div>
          <p>{item.name}</p>
          <p>${item.price}</p>
        </div>
      );
    });
  }, [options]);

  return (
    <tableContext.Provider value={contextValue}>
      <div className="flex flex-col justify-between bg-black text-white h-full">
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

        <div className="flex flex-row h-[90%]">
          <div className="overflow-y-scroll ml-4 mr-6 gap-2 flex flex-col flex-none">
            {handleMenuLoad}
          </div>

          <div className="grow border border-red-500 overflow-y-scroll">
            <p>{options.name}</p>
            <div className="grid grid-cols-4">{handleOptionsLoad}</div>
          </div>
        </div>

        {slidedownContent && (
          <SlideDown handleRemove={removeSlidedownContent}>
            {slidedownContent}
          </SlideDown>
        )}
      </div>
    </tableContext.Provider>
  );
};

export default Order;
