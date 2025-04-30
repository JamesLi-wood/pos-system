"use client";
import React, { useState, createContext, useMemo } from "react";
import SlideDown from "../components/slidedown";
import Sidebar from "../components/sidebar";
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
    return (
      <div className="w-40 px-4 gap-3 flex flex-col">
        <div className="text-4xl text-center mt-14 mb-6">{tableName}</div>
        <button className="bg-red-500 p-2" onClick={() => setInventory(false)}>
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
        {menu.map((item, idx) => {
          return (
            <p
              key={item.name}
              className={`${
                selectedItem === idx && "bg-blue-600"
              } cursor-pointer text-center rounded-lg p-2 border-transparent border-2 hover:border-white`}
              onClick={() => {
                setSelectedItem(idx);
                setOptions(item);
              }}
            >
              {item.name}
            </p>
          );
        })}
      </div>
    );
  }, [selectedItem]);

  const handleOptionsLoad = useMemo(() => {
    return options.data.map((item) => {
      const imageUrl = `data:${item.image.contentType};base64,${item.image.data}`;

      return (
        <div
          key={item._id}
          className="flex border rounded-3xl p-4 justify-between cursor-pointer h-[200px] w-[500px]"
          onClick={() => {
            setSlidedownContent(<MenuItem item={item} />);
          }}
        >
          <div className="flex flex-col text-xl m-4 ">
            <p>{item.name}</p>
            <p>{`$${item.price}`}</p>
          </div>

          <img
            className="h-full w-[40%] object-cover"
            src={imageUrl}
            alt={`${item.name} image`}
          />
        </div>
      );
    });
  }, [options]);

  return (
    <tableContext.Provider value={contextValue}>
      <div className="flex flex-col justify-between bg-black text-white h-full">
        <div className="flex flex-row h-full items-center">
          <Sidebar>{handleMenuLoad}</Sidebar>

          <div className="overflow-y-scroll w-full h-[90%]">
            <p className="text-4xl mb-8 text-center">{options.name}</p>
            <div className="flex flex-wrap gap-5 justify-center mx-4 pb-4">
              {handleOptionsLoad}
            </div>
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
