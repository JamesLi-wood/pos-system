import { useState, useContext, useEffect, useRef } from "react";
import { useSocket } from "../hooks/useSocket";
import { tableContext } from "./order";
import Item from "./item";
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
  const [hasScrollbar, setHasScrollbar] = useState(false);
  const socket = useSocket();

  const fetchTickets = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/ticket/get-ticket`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tableName }),
    })
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
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/ticket/remove-item`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tableName: tableName,
        orderIdx: orderIdx,
        itemIdx: itemIdx,
      }),
    });

    if (tableName !== "takeout") fetchTickets();
  };

  const removeCurrentItem = (idx: number) => {
    setCurrentPrice((prevState) => prevState - currentOrder[idx].price);
    setCurrentOrder((prevState) =>
      prevState.filter((data, pos) => idx !== pos)
    );
  };

  const sendKitchen = async () => {
    if (currentOrder.length === 0) return;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/order/ticket/add-ticket`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tableName: tableName,
          ticket: currentOrder,
          totalPrice: currentPrice,
        }),
      }
    );

    if (response.ok) {
      if (tableName === "takeout") {
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
      `${process.env.NEXT_PUBLIC_API_URL}/order/ticket/clear-ticket`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tableName: tableName,
        }),
      }
    );

    if (response.ok) {
      fetchTickets();
      setCurrentOrder([]);
      setCurrentPrice(0);
    }
  };

  const activateDelete = () => {
    setShowDelete((prevState) => !prevState);
  };

  useEffect(() => {
    const checkScrollbar = () => {
      const parent = document.getElementById("slidedown-component");

      if (parent) {
        setHasScrollbar(parent.scrollHeight > parent.clientHeight);
      }
    };

    setTimeout(checkScrollbar, 10);

    window.addEventListener("resize", checkScrollbar);

    return () => {
      window.removeEventListener("resize", checkScrollbar);
    };
  }, []);

  return (
    <div className="bg-inherit">
      <div className="sticky top-0 bg-inherit z-10 px-4">
        <p className="py-4 text-2xl">{tableName}</p>
        <hr className="mb-2" />
      </div>
      <div className={`flex flex-col px-4 ${!hasScrollbar && "pb-20"}`}>
        {tickets.length !== 0 && <p className="text-center">Previous orders</p>}
        {tickets.map((orders, ticketIdx) => {
          return (
            <div key={orders.orderID}>
              {orders.ticket.map((item: any, itemIdx: number) => {
                return (
                  <Item
                    key={itemIdx}
                    item={item}
                    handleRemove={() => removeItem(ticketIdx, itemIdx)}
                    showDelete={showDelete}
                  />
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
                <Item
                  key={idx}
                  item={order}
                  handleRemove={() => removeCurrentItem(idx)}
                  showDelete={showDelete}
                />
              );
            })}
          </>
        )}
      </div>

      <div
        className={`${
          hasScrollbar ? "sticky" : "absolute"
        } bottom-0 bg-inherit left-0 right-0 px-4`}
      >
        <hr />
        <div className="flex justify-between text-xl">
          <p>Subtotal</p>
          <p>${(price + currentPrice).toFixed(2)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="bg-green-500 p-2" onClick={sendKitchen}>
            Send to kitchen
          </button>
          <button className="bg-red-500 p-2" onClick={activateDelete}>
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
