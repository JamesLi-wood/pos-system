import { SetStateAction, useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import { KitchenTicketType } from "./types";

const Takeout = ({ activateInventory }: { activateInventory: () => void }) => {
  const [takeoutTickets, setTakeoutTickets] = useState<any>([]);
  const socket = useSocket();

  useEffect(() => {
    socket.emit("request-takeout-ticket");
  }, []);

  useEffect(() => {
    const handleSocketRequest = (data: SetStateAction<KitchenTicketType[]>) => {
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
      socket.emit("request-takeout-ticket");
    }
  };

  return (
    <div>
      <div className="text-center">Takeout</div>
      <div>
        <div className="flex justify-center bg-gray-300 py-4">
          <button
            className="cursor-pointer rounded border-none bg-[rgb(0,139,139)] p-4 text-white"
            onClick={activateInventory}
          >
            Create Order
          </button>
        </div>

        {takeoutTickets.map((data: any) => {
          return (
            <div key={data.orderID} className="border border-black py-4">
              <div className="flex flex-col items-start justify-between">
                <div className="">
                  <div>{`Order#: ${data.orderID}`}</div>
                  <div>Customer Name</div>
                  <div>Customer Phone Number</div>
                </div>
                <div className="flex w-full gap-1 justify-center">
                  <button className="cursor-pointer rounded border-none bg-[rgb(0,139,139)] p-4 text-white">
                    Details
                  </button>
                  <button
                    className="cursor-pointer rounded border-none bg-[rgb(255,0,0)] p-4 text-white"
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
  );
};

export default Takeout;
