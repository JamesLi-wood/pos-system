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
  const [requiredOptions, setRequiredOptions] = useState(
    Array(item.requiredOptions.length).fill({
      name: null,
      price: 0,
      selected: null,
    })
  );
  const [additionalOptions, setAdditionalOptions] = useState(
    Array(item.additionalOptions.length).fill(null)
  );
  const [additionalPrice, setAdditionalPrice] = useState(0);
  const specialRequestRef = useRef<HTMLTextAreaElement>(null);
  const imageUrl = `data:${item.image.contentType};base64,${item.image.data}`;

  const addOrder = async () => {
    let singularIdx = -1;

    const newArr = [...requiredOptions];
    newArr.map((item, idx) => {
      if (!item.name) {
        newArr[idx] = { ...newArr[idx], selected: false };
        if (singularIdx === -1) singularIdx = idx;
      }
    });

    if (singularIdx !== -1) {
      setRequiredOptions(newArr);
      const doc = document.getElementById(`singular${singularIdx}`);
      if (doc) doc.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const totalPrice = item.price * counter + additionalPrice;
    const order = {
      name: item.name,
      price: totalPrice,
      quantity: counter,
      requiredOptions: requiredOptions.map((item) => item.name),
      additionalOptions: additionalOptions.filter((item) => item !== null),
      specialRequests: specialRequestRef.current
        ? specialRequestRef.current.value
        : "",
    };

    setCurrentPrice((prevState) => (prevState += totalPrice));
    setCurrentOrder((prevState) => [...prevState, order]);
    removeSlidedownContent();
  };

  const requiredOptionMenu = useMemo(() => {
    if (item.requiredOptions.length < 0) return;

    const handleRequiredChange = (
      idx: number,
      choice: { name: string; price: number }
    ) => {
      setAdditionalPrice(
        (prevState) => prevState - requiredOptions[idx].price + choice.price
      );
      setRequiredOptions((prevState) => {
        const newArr = [...prevState];
        newArr[idx] = {
          name: choice.name,
          price: choice.price,
          selected: true,
        };
        return newArr;
      });
    };

    return (
      <div>
        {item.requiredOptions.map((option, idx) => {
          return (
            <div key={option.title} id={`singular${idx}`}>
              <div>
                <div className="flex justify-between">
                  <p className="text-2xl">{option.title}</p>
                  <p
                    className={`flex items-center rounded-3xl ${
                      requiredOptions[idx].selected === false
                        ? "bg-red-500 text-white"
                        : "bg-gray-200"
                    } px-2 text-base text-gray-300 bg-neutral-800`}
                  >
                    Required
                  </p>
                </div>

                <p className="text-base">Select an option</p>
              </div>

              {option.choices.map((choice) => {
                return (
                  <label
                    key={choice.name}
                    className="flex flex-row items-center cursor-pointer mt-2"
                  >
                    <input
                      type="radio"
                      className="h-8 w-6"
                      name={`singular-selection${idx}`}
                      checked={requiredOptions[idx].name === choice.name}
                      onChange={() => {
                        handleRequiredChange(idx, choice);
                      }}
                    />
                    <div className="ml-2 flex justify-between w-full">
                      <p>{choice.name}</p>
                      {choice.price !== 0 && (
                        <p>{`+${choice.price.toFixed(2)}`}</p>
                      )}
                    </div>
                  </label>
                );
              })}
              <hr className="my-4 border-[1.5px] border-gray-500" />
            </div>
          );
        })}
      </div>
    );
  }, [requiredOptions]);

  const additionalOptionMenu = useMemo(() => {
    if (item.additionalOptions.length <= 0) return;

    const handleAdditionalChange = (
      choice: { name: string; price: number },
      idx: number
    ) => {
      const name = choice.name;
      const price = choice.price;

      const newArr = [...additionalOptions];

      if (newArr[idx] === name) {
        newArr[idx] = null; // unselects.
        setAdditionalPrice((prevState) => prevState - price);
      } else {
        newArr[idx] = name; // selects.
        setAdditionalPrice((prevState) => prevState + price);
      }

      setAdditionalOptions(newArr);
    };

    return (
      <div>
        <p className="text-2xl">Additional Choices</p>
        <div>
          {item.additionalOptions.map((choice, idx) => {
            return (
              <label
                key={choice.name}
                className="flex flex-row items-center cursor-pointer mt-2"
              >
                <input
                  type="checkbox"
                  className="h-8 w-6"
                  checked={additionalOptions[idx] === choice.name}
                  onChange={() => {
                    handleAdditionalChange(choice, idx);
                  }}
                />
                <div className="ml-2 flex justify-between w-full">
                  <p>{choice.name}</p>
                  <p>{`+${choice.price.toFixed(2)}`}</p>
                </div>
              </label>
            );
          })}
        </div>
        <hr className="my-4 border-[1.5px] border-gray-500" />
      </div>
    );
  }, [additionalOptions]);

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
      <img
        className="h-96 w-full object-fill"
        src={imageUrl}
        alt={`${item.image.name} image`}
      />

      <div className="px-4 bg-inherit text-xl">
        <p className="sticky top-0 bg-inherit text-3xl py-4 mt-1">
          {item.name}
        </p>
        <p className="text-base">{item.description}</p>
        <hr className="my-4 border-[1.5px] border-gray-500 sticky top-[4.2rem]" />

        {requiredOptionMenu}
        {additionalOptionMenu}
        {specialRequestMenu}
      </div>

      <div className="p-4 sticky gap-4 flex -bottom-1 left-0 right-0 bg-inherit">
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
          <p>{`$${(item.price * counter + additionalPrice).toFixed(2)}`}</p>
        </button>
      </div>
    </div>
  );
};

export default MenuItem;
