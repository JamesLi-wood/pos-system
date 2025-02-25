"use client"
import useTimer from "../hooks/useTimer";
import { KitchenTicketType } from "../table/types";
import { useSocket } from "../hooks/useSocket";

const KitchenTicket = ({ data }: { data: KitchenTicketType }) => {
  const [formatTime] = useTimer(data.dateCreated);
  const socket = useSocket();

  const remove = (id: number) => {
    socket.emit("remove-kitchen-ticket", id);
  };

  return (
    <div className="flex flex-col justify-between bg-white">
      <div className="bg-[rgb(50,205,50)] flex flex-row justify-between px-4 py-2 text-white">
        <div>{`Order ${data.orderID}`}</div>
        <div>{formatTime()}</div>
      </div>

      <div className="h-full py-2">
        {data.ticket.map((order, idx) => {
          return (
            <div
              key={idx}
              className="px-4 py-1"
            >{`${order.quantity} ${order.name}`}</div>
          );
        })}
      </div>

      <div
        className="bg-[rgb(50,205,50)] cursor-pointer px-4 py-2 text-center text-white"
        onClick={() => remove(data.orderID)}
      >
        Press to complete
      </div>
    </div>
  );
};

export default KitchenTicket;
