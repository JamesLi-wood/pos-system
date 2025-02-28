import { useContext, useState, useRef, useMemo } from "react";
import { VscAdd, VscChromeMinimize } from "react-icons/vsc";
import useCounter from "../hooks/useCounter";
import { tableContext } from "./order";
import { MenuItemType } from "../types";

const MenuItem = ({ item }: { item: MenuItemType }) => {
  const context = useContext(tableContext);
  if (!context) {
    throw new Error("tableContext must be used within a Provider");
  }

  const { removeSlidedownContent, setCurrentOrder, setCurrentPrice } = context;
  const { counter, increment, decrement } = useCounter();
  const [singularOptions, setSingularOptions] = useState(
    Array(item.singularOptions.length).fill(null)
  );
  const [multipleOptions, setMultipleOptions] = useState(
    Array(item.multipleOptions.choices?.length).fill(null)
  );
  const [additionalPrice, setAdditionalPrice] = useState(0);
  const specialRequestRef = useRef<HTMLTextAreaElement>(null);

  const addOrder = async () => {
    const totalPrice = item.price * counter + additionalPrice;
    const order = {
      name: item.name,
      price: totalPrice,
      quantity: counter,
      singularOptions: singularOptions.filter((item) => item !== null),
      multipleOptions: multipleOptions.filter((item) => item !== null),
      specialRequests: specialRequestRef.current
        ? specialRequestRef.current.value
        : "",
    };

    setCurrentPrice((prevState) => (prevState += totalPrice));
    setCurrentOrder((prevState) => [...prevState, order]);
    removeSlidedownContent();
  };

  const singularOptionMenu = useMemo(() => {
    if (item.singularOptions.length < 0) return;

    const handleSingular = (idx: number, choice: string) => {
      const newArr = [...singularOptions];
      newArr[idx] = choice;

      setSingularOptions(newArr);
    };

    return (
      <div>
        {item.singularOptions.map((option, idx) => {
          return (
            <div key={option.title}>
              <div>
                <div className="flex justify-between">
                  <p className="text-2xl">{option.title}</p>
                  <p className="flex items-center rounded-3xl bg-gray-200 px-2 text-base text-gray-300 bg-neutral-800">
                    Required
                  </p>
                </div>

                <p className="text-base">Select an option</p>
              </div>

              {option.choices.map((choice) => {
                return (
                  <label
                    key={choice}
                    className="flex flex-row items-center cursor-pointer mt-2"
                  >
                    <input
                      type="radio"
                      className="h-8 w-6"
                      name={`singular-selection${idx}`}
                      checked={singularOptions[idx] === choice}
                      onChange={() => {
                        handleSingular(idx, choice);
                      }}
                    />
                    <p className="ml-2">{choice}</p>
                  </label>
                );
              })}
              <hr className="my-4 border-[1.5px] border-gray-500" />
            </div>
          );
        })}
      </div>
    );
  }, [singularOptions]);

  const multipleOptionMenu = useMemo(() => {
    if (!item.multipleOptions.choices) return;

    const handleMultiple = (
      choice: { name: string; price: number },
      idx: number
    ) => {
      const name = choice.name;
      const price = choice.price;

      const newArr = [...multipleOptions];

      if (newArr[idx] === name) {
        newArr[idx] = null; // unselects.
        setAdditionalPrice((prevState) => prevState - price);
      } else {
        newArr[idx] = name; // selects.
        setAdditionalPrice((prevState) => prevState + price);
      }

      setMultipleOptions(newArr);
    };

    return (
      <div>
        <p className="text-2xl">{item.multipleOptions.title}</p>
        <div>
          {item.multipleOptions.choices.map((choice, idx) => {
            return (
              <label
                key={choice.name}
                className="flex flex-row items-center cursor-pointer mt-2"
              >
                <input
                  type="checkbox"
                  className="h-8 w-6"
                  checked={multipleOptions[idx] === choice.name}
                  onChange={() => {
                    handleMultiple(choice, idx);
                  }}
                />
                <div className="ml-2 flex justify-between w-full">
                  <p>{choice.name}</p>
                  <p>+${choice.price}</p>
                </div>
              </label>
            );
          })}
        </div>
        <hr className="my-4 border-[1.5px] border-gray-500" />
      </div>
    );
  }, [multipleOptions]);

  const specialRequestMenu = useMemo(() => {
    return (
      <div>
        <p>Special Requests</p>
        <textarea
          id="special-requests"
          ref={specialRequestRef}
          className="text-base my-2 bg-transparent border border-gray-500 p-2 resize-none text-white w-full outline-none"
          placeholder="Add special request"
          rows={3}
        />
      </div>
    );
  }, []);

  return (
    <div className="bg-inherit">
      <div className="border border-blue-500 h-96">IMG</div>
      <div className="px-4 bg-inherit text-xl">
        <p className="sticky top-0 bg-inherit text-3xl py-4">{item.name}</p>
        <p className="text-base">{item.description}</p>
        <hr className="my-4 border-[1.5px] border-gray-500 sticky top-[4.2rem]" />

        {singularOptionMenu}
        {multipleOptionMenu}
        {specialRequestMenu}
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
        <button
          className="px-3 rounded-lg bg-green-500 w-full flex justify-between items-center"
          onClick={addOrder}
        >
          <p>Add {counter === 1 ? "Item" : `${counter} Items`}</p>
          <p>${item.price * counter + additionalPrice}</p>
        </button>
      </div>
    </div>
  );
};

export default MenuItem;
