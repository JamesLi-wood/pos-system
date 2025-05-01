import { SetStateAction, useEffect, useState, useMemo } from "react";
import { useSocket } from "../hooks/useSocket";
import { TicketType } from "../types";
import Item from "./item";

const Takeout = ({
  activateInventory,
  setSlidedownContent,
}: {
  activateInventory: () => void;
  setSlidedownContent: React.Dispatch<
    React.SetStateAction<React.ReactNode | null>
  >;
}) => {
  const [takeoutTickets, setTakeoutTickets] = useState<TicketType[]>([]);
  const socket = useSocket();

  useEffect(() => {
    if (socket) socket.emit("request-takeout-ticket");
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleSocketRequest = (data: SetStateAction<TicketType[]>) => {
      setTakeoutTickets(data);
    };

    socket.on("get-takeout-ticket", handleSocketRequest);
    return () => {
      socket.off("get-takeout-ticket", handleSocketRequest);
    };
  }, [socket]);

  const removeOrder = async (id: number) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/order/ticket/remove-takeout-ticket`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderID: id,
        }),
      }
    );

    if (response.ok) {
      if (socket) socket.emit("request-takeout-ticket");
    }
  };

  const TakeoutDetail = ({ detail }: { detail: TicketType }) => {
    return (
      <div className="bg-inherit px-4">
        <div className="sticky top-0 z-10 bg-inherit text-3xl">
          <p className="py-4">{`Order# ${detail.orderID}`}</p>
          <hr />
        </div>

        <div className="my-2 flex gap-2 text-lg">
          <p>{detail.name}</p>
          <p>{detail.phoneNumber}</p>
        </div>
        <hr />

        <div className="text-lg">
          {detail.ticket.map((ticket, idx) => {
            return <Item key={idx} item={ticket} />;
          })}
        </div>
      </div>
    );
  };

  return (
    <div>
      <p className="text-center text-2xl">Takeout</p>
      <div>
        <div className="flex justify-center py-4 mb-2">
          <button
            className="cursor-pointer rounded border-none bg-blue-600 p-4 text-white"
            onClick={activateInventory}
          >
            Create Order
          </button>
        </div>

        <div className="flex items-center flex-col">
          {takeoutTickets.map((data: TicketType) => {
            return (
              <div
                key={data.orderID}
                className="py-4 bg-white text-black mb-2 w-[90%] rounded-2xl"
              >
                <div className="flex flex-col items-start justify-between px-4">
                  <div>
                    <p>{`Order #${data.orderID}`}</p>
                    <p>{data.name}</p>
                    <p>{data.phoneNumber}</p>
                  </div>
                  <div className="flex mt-2 w-full gap-1 justify-center">
                    <button
                      className="cursor-pointer rounded border-none bg-blue-600 p-4 text-white"
                      onClick={() => {
                        setSlidedownContent(<TakeoutDetail detail={data} />);
                      }}
                    >
                      Details
                    </button>
                    <button
                      className="cursor-pointer rounded border-none bg-red-500 p-4 text-white"
                      onClick={() => removeOrder(data.orderID)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Takeout;
