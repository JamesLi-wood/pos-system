"use client";
import useTimer from "../hooks/useTimer";
import { KitchenTicketType } from "../types";

const KitchenTicket = ({
  data,
  removeTicket,
}: {
  data: KitchenTicketType;
  removeTicket: () => void;
}) => {
  const [formatTime] = useTimer(data.dateCreated);

  return (
    <div className="flex flex-col justify-between bg-white">
      <div className="bg-[rgb(50,205,50)] flex flex-row justify-between px-4 py-2 text-white">
        <p>{`Order ${data.orderID}`}</p>
        <p>{formatTime()}</p>
      </div>

      <div className="h-full py-2">
        {data.ticket.map((order, idx) => {
          const requiredOptions = order.requiredOptions;
          const additionalOptions = order.additionalOptions;

          return (
            <div key={idx} className="px-4 py-1">
              <p>{`${order.quantity} ${order.name}`}</p>
              {requiredOptions.length > 0 && (
                <p className="ml-4">{`- ${requiredOptions.join(", ")}`}</p>
              )}
              {additionalOptions.length > 0 && (
                <p className="ml-4">{`- ${additionalOptions.join(", ")}`}</p>
              )}
              {order.specialRequests && (
                <p className="ml-4">{`- ${order.specialRequests}`}</p>
              )}
            </div>
          );
        })}
      </div>

      <button
        className="bg-[rgb(50,205,50)] cursor-pointer px-4 py-2 text-center text-white"
        onClick={removeTicket}
      >
        Press to complete
      </button>
    </div>
  );
};

export default KitchenTicket;
