import React, { useContext, useState } from "react";
import { tableContext } from "./order";
import { VscAdd, VscChromeMinimize } from "react-icons/vsc";
import useCounter from "../hooks/useCounter";

import { MenuItemData } from "./types";

const MenuItem = ({ item }: { item: MenuItemData }) => {
  const context = useContext(tableContext);
  if (!context) {
    throw new Error("tableContext must be used within a Provider");
  }

  const { removeSlidedownContent, setCurrentOrder, setCurrentPrice } = context;
  const { counter, increment, decrement } = useCounter();

  return (
    <div className="bg-inherit">
      <div className="border border-blue-500 h-96">IMG</div>
      <div className="px-4 bg-inherit text-xl">
        <p className="sticky top-0 bg-inherit text-3xl py-4">{item.name}</p>
        <p className="text-base">{item.description}</p>
        <hr className="my-4 border-[1.5px] border-gray-500 sticky top-[4.2rem]" />
      </div>

      <div className="p-4 sticky gap-4 flex bottom-0 left-0 right-0 bg-inherit">
        <hr className="my-4 border-[1.5px] border-gray-500 absolute top-0 right-0 left-0 mt-1" />
        <div className="flex py-2 items-center border border-gray-200 rounded-lg">
          <button className="cursor-pointer px-4 py-2" onClick={decrement}>
            <VscChromeMinimize />
          </button>
          <p className="text-center w-8">{counter}</p>
          <button className="cursor-pointer px-4 py-2" onClick={increment}>
            <VscAdd />
          </button>
        </div>
        <button className="px-3 rounded-lg bg-green-500 w-full flex justify-between items-center">
          <p>Add {counter === 1 ? "Item" : `${counter} Items`}</p>
          <p>${item.price * counter}</p>
        </button>
      </div>
    </div>
  );
};

export default MenuItem;
