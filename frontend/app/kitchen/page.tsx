"use client";
import Link from "next/link";
import { SetStateAction, useEffect, useState } from "react";
import useValidateToken from "../hooks/useValidateToken";
import { useSocket } from "../hooks/useSocket";
import KitchenTicket from "./kitchenTicket";
import { TicketType } from "../types";

const Kitchen = () => {
  useValidateToken();
  const [kitchenTickets, setKitchenTickets] = useState<TicketType[]>([]);
  const socket = useSocket();

  // Initial load.
  useEffect(() => {
    socket.emit("request-kitchen-ticket");
  }, []);

  // Listens to any changes on the ticket.
  useEffect(() => {
    const handleSocketRequest = (data: SetStateAction<TicketType[]>) => {
      setKitchenTickets(data);
    };

    socket.on("get-kitchen-ticket", handleSocketRequest);

    return () => {
      socket.off("get-kitchen-ticket", handleSocketRequest);
    };
  }, [socket]);

  return (
    <div className="h-full bg-black">
      <div className="px-4 py-2">
        <Link
          href={"/"}
          className="cursor-pointer border-2 border-white px-4 py-2 text-3xl text-white"
        >
          BACK
        </Link>
      </div>

      <div className="max-[900px]:grid-cols-2 grid grid-cols-4 gap-4 bg-black p-4 text-xl">
        {kitchenTickets.map((data) => {
          return <KitchenTicket key={data.orderID} data={data} />;
        })}
      </div>
    </div>
  );
};

export default Kitchen;
