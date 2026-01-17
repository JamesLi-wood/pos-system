import { useState, useContext, useEffect, useRef } from "react";
import { useSocket } from "../hooks/useSocket";
import { tableContext } from "./order";
import Item from "./item";
import { OrderType } from "../types";

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
    exitOrder,
  } = context;
  const [tickets, setTickets] = useState<OrderType[]>([]);
  const [price, setPrice] = useState(0);
  const [selectedItem, setSelectedItem] = useState({
    mode: "",
    itemIdx: -1,
  });
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

  const removeItem = async (itemIdx: number) => {
    if (selectedItem.mode == "currentTicket") {
      const idx = selectedItem.itemIdx;
      setCurrentPrice((prevState) => prevState - currentOrder[idx].price);
      setCurrentOrder((prevState) =>
        prevState.filter((data, pos) => idx !== pos)
      );
      setSelectedItem({
        mode: "",
        itemIdx: -1,
      });
      return;
    }

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/order/ticket/remove-item/${tableName}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemIdx: itemIdx,
        }),
      }
    );

    setSelectedItem({
      mode: "",
      itemIdx: -1,
    });
    if (tableName !== "takeout") fetchTickets();
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
        exitOrder("takeoutOrders");
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
      `${process.env.NEXT_PUBLIC_API_URL}/order/ticket/pay-order/${tableName}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      if (socket) socket.emit("request-completed-orders");
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
          {tickets.map((ticket, idx) => {
            const selected =
              selectedItem.mode == "previousTicket" &&
              selectedItem.itemIdx == idx;

            return (
              <div
                key={idx}
                className={`${selected && "bg-red-500"} cursor-pointer`}
                onClick={() =>
                  setSelectedItem({
                    mode: "previousTicket",
                    itemIdx: idx,
                  })
                }
              >
                <Item item={ticket} />
              </div>
            );
          })}

          {currentOrder.length !== 0 && (
            <>
              {tickets.length !== 0 && <hr className="my-2" />}
              <p className="text-center">Current order</p>
              {currentOrder.map((order, idx) => {
                const selected =
                  selectedItem.mode == "currentTicket" &&
                  selectedItem.itemIdx == idx;

                return (
                  <div
                    key={idx}
                    className={`${selected && "bg-red-500"} cursor-pointer`}
                    onClick={() => {
                      setSelectedItem({
                        mode: "currentTicket",
                        itemIdx: idx,
                      });
                    }}
                  >
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
          <button className="bg-blue-500 p-2" onClick={sendKitchen}>
            Send to kitchen
          </button>
          {tableName !== "takeout" && (
            <>
              <button className="bg-green-500 p-2" onClick={handlePay}>
                Pay
              </button>
            </>
          )}
          {selectedItem.mode && (
            <button
              className="bg-red-500 p-2"
              onClick={() => removeItem(selectedItem.itemIdx)}
            >
              Remove Item
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ticket;
