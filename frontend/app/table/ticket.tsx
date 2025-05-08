import { useState, useContext, useEffect, useRef } from "react";
import { useSocket } from "../hooks/useSocket";
import { tableContext } from "./order";
import Item from "./item";
import { VscChromeClose } from "react-icons/vsc";
import { TicketType } from "../types";

const Ticket = () => {
  const context = useContext(tableContext);
  if (!context) {
    throw new Error("tableContext must be used within a Provider");
  }

  const {
    tableName,
    currentOrder,
    setCurrentOrder,
    currentPrice,
    setCurrentPrice,
    setInventory,
  } = context;
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [price, setPrice] = useState(0);
  const [showDelete, setShowDelete] = useState(false);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const phoneRef = useRef<HTMLInputElement | null>(null);
  const socket = useSocket();

  const fetchTickets = async () => {
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/order/ticket/get-ticket/${tableName}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setTickets(data.ticket);
        setPrice(data.price);
      });
  };

  useEffect(() => {
    if (tableName !== "takeout") fetchTickets();
  }, []);

  const removeItem = async (orderIdx: number, itemIdx: number) => {
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/order/ticket/remove-item/${tableName}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderIdx: orderIdx,
          itemIdx: itemIdx,
        }),
      }
    );

    if (tableName !== "takeout") fetchTickets();
  };

  const removeCurrentItem = (idx: number) => {
    setCurrentPrice((prevState) => prevState - currentOrder[idx].price);
    setCurrentOrder((prevState) =>
      prevState.filter((data, pos) => idx !== pos)
    );
  };

  const sendKitchen = async () => {
    const isTakeout = tableName === "takeout";

    if (isTakeout) {
      const hasName = nameRef.current?.value !== "";
      const hasNumber = phoneRef.current?.value !== "";
      if (!hasName || !hasNumber) {
        return;
      }
    }

    if (currentOrder.length === 0) return;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/order/ticket/add-ticket/${tableName}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticket: currentOrder,
          totalPrice: currentPrice,
          name: nameRef.current?.value,
          phoneNumber: phoneRef.current?.value,
        }),
      }
    );

    if (response.ok) {
      if (isTakeout) {
        if (socket) socket.emit("request-takeout-ticket");
        setInventory(false);
      } else {
        fetchTickets();
        setCurrentOrder([]);
        setCurrentPrice(0);
      }

      if (socket) socket.emit("request-kitchen-ticket");
    }
  };

  const handlePay = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/order/ticket/clear-ticket/${tableName}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      fetchTickets();
      setCurrentOrder([]);
      setCurrentPrice(0);
    }
  };

  return (
    <div className="bg-inherit h-full flex flex-col justify-between">
      <div className="bg-inherit">
        <div className="sticky top-0 bg-inherit z-10 px-4">
          <p className="py-4 text-2xl">{tableName}</p>
          {tableName === "takeout" && (
            <div className="flex flex-col mb-4 gap-2">
              <div className="flex gap-2">
                <p>NAME</p>
                <input
                  className="text-base bg-transparent border border-gray-500 resize-none text-white w-full outline-none"
                  type="text"
                  ref={nameRef}
                />
              </div>
              <div className="flex gap-2">
                <p>NUMBER</p>
                <input
                  className="text-base bg-transparent border border-gray-500 resize-none text-white w-full outline-none"
                  type="tel"
                  inputMode="numeric"
                  ref={phoneRef}
                />
              </div>
            </div>
          )}

          <hr className="mb-2" />
        </div>
        <div className="flex flex-col px-4">
          {tickets.length !== 0 && (
            <p className="text-center">Previous orders</p>
          )}
          {tickets.map((orders, ticketIdx) => {
            return (
              <div key={orders.orderID}>
                {orders.ticket.map((item: any, itemIdx: number) => {
                  return (
                    <div key={itemIdx} className="flex">
                      {showDelete && (
                        <button
                          className="w-7 flex items-center justify-center p-1 cursor-pointer border-none bg-[rgb(255,0,0)] text-white"
                          onClick={() => removeItem(ticketIdx, itemIdx)}
                        >
                          <VscChromeClose />
                        </button>
                      )}
                      <Item item={item} />
                    </div>
                  );
                })}
                {ticketIdx !== tickets.length - 1 && <hr className="my-2" />}
              </div>
            );
          })}

          {currentOrder.length !== 0 && (
            <>
              {tickets.length !== 0 && <hr />}
              <p className="text-center">Current order</p>
              {currentOrder.map((order, idx) => {
                return (
                  <div key={idx} className="flex">
                    {showDelete && (
                      <button
                        className="w-7 flex items-center justify-center p-1 cursor-pointer border-none bg-[rgb(255,0,0)] text-white"
                        onClick={() => removeCurrentItem(idx)}
                      >
                        <VscChromeClose />
                      </button>
                    )}
                    <Item item={order} />
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>

      <div className="sticky bottom-0 bg-inherit left-0 right-0 p-4">
        <hr />
        <div className="flex justify-between text-xl">
          <p>Subtotal</p>
          <p>{`$${(price + currentPrice).toFixed(2)}`}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="bg-green-500 p-2" onClick={sendKitchen}>
            Send to kitchen
          </button>
          <button
            className="bg-red-500 p-2"
            onClick={() => setShowDelete((prevState) => !prevState)}
          >
            Remove Item
          </button>
          {tableName !== "takeout" && (
            <>
              <button className="bg-green-500 p-2" onClick={handlePay}>
                Pay
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ticket;
