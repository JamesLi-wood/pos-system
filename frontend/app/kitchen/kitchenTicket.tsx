"use client";
import { useMemo } from "react";
import useTimer from "../hooks/useTimer";
import { useSocket } from "../hooks/useSocket";
import { TicketType } from "../types";

const KitchenTicket = ({ data }: { data: TicketType }) => {
  const [formatTime] = useTimer(data.dateCreated);
  const socket = useSocket();

  const remove = (id: number) => {
    socket.emit("remove-kitchen-ticket", id);
  };

  const ticketMap = useMemo(() => {
    return data.ticket.map((order, idx) => {
      return (
        <div key={idx} className="px-4 py-1">
          <p>{`${order.quantity} ${order.name}`}</p>
        </div>
      );
    });
  }, []);

  return (
    <div className="flex flex-col justify-between bg-white">
      <div className="bg-[rgb(50,205,50)] flex flex-row justify-between px-4 py-2 text-white">
        <p>{`Order ${data.orderID}`}</p>
        <p>{formatTime()}</p>
      </div>

      <div className="h-full py-2">{ticketMap}</div>

      <button
        className="bg-[rgb(50,205,50)] cursor-pointer px-4 py-2 text-center text-white"
        onClick={() => remove(data.orderID)}
      >
        Press to complete
      </button>
    </div>
  );
};

export default KitchenTicket;
