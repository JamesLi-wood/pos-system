import { useEffect, useState } from "react";
import useWindowDimensions from "../hooks/useWindowDimension";
import { useSocket } from "../hooks/useSocket";
import Modal from "../components/modal";
import Item from "./item";
import { TakeoutTicketType } from "../types";

const Takeout = ({ takeOrder }: { takeOrder: () => void }) => {
  const socket = useSocket();
  const [takeoutTickets, setTakeoutTickets] = useState<TakeoutTicketType[]>([]);
  const [ticket, setTicket] = useState<TakeoutTicketType | null>(null);
  const width = useWindowDimensions();

  useEffect(() => {
    if (socket) socket.emit("request-takeout-ticket");
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleSocketRequest = (data: TakeoutTicketType[]) => {
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

  const TakeoutDetail = ({ detail }: { detail: TakeoutTicketType }) => {
    return (
      <div className="h-full px-4">
        <div className="bg-inherit text-3xl">
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

        <button
          className="cursor-pointer rounded border-none bg-red-500 p-4 text-white"
          onClick={() => {
            removeOrder(detail.orderID);
            setTicket(null);
          }}
        >
          Remove
        </button>
      </div>
    );
  };

  return (
    <div className="h-[80%]">
      <div className="flex items-center gap-5 mb-5">
        <p className="text-center text-2xl">Takeout</p>
        <button
          className="cursor-pointer rounded border-none bg-blue-600 p-4 text-white"
          onClick={takeOrder}
        >
          Create Order
        </button>
      </div>

      <div className="flex h-[85%] justify-between gap-8">
        <div className="w-full flex flex-col items-center gap-4 overflow-y-scroll scroll-hidden">
          {takeoutTickets.map((data: TakeoutTicketType) => {
            return (
              <div
                key={data.orderID}
                className="p-4 cursor-pointer bg-white text-black w-full rounded-2xl"
                onClick={() => setTicket(data)}
              >
                <div className="flex gap-5">
                  <p>{`Order #${data.orderID}`}</p>
                  <p>{data.phoneNumber}</p>
                </div>
                <p>{data.name}</p>
              </div>
            );
          })}
        </div>

        {ticket &&
          (width <= 750 ? (
            <Modal
              height={80}
              width={80}
              altWidthDimensions={750}
              altHeight={80}
              altWidth={80}
              removeModal={() => setTicket(null)}
            >
              <TakeoutDetail detail={ticket} />
            </Modal>
          ) : (
            <div className="w-2/5 bg-white text-black overflow-y-scroll">
              <TakeoutDetail detail={ticket} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default Takeout;
