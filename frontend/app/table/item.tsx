import React, { useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
import { SlArrowDown } from "react-icons/sl";
import { OrderItem } from "./types";

const Item = ({
  item,
  handleRemove,
  showDelete,
}: {
  item: OrderItem;
  handleRemove: () => void;
  showDelete: Boolean;
}) => {
  const [showExtra, setShowExtra] = useState(false);

  return (
    <div>
      <div className="flex justify-between mt-2">
        <div className="flex items-center gap-2">
          {showDelete && (
            <button
              className="w-7 flex items-center justify-center p-1 cursor-pointer border-none bg-[rgb(255,0,0)] text-white"
              onClick={handleRemove}
            >
              <VscChromeClose />
            </button>
          )}
          <p>{`${item.quantity}x ${item.name}`}</p>
          <SlArrowDown
            onClick={() => setShowExtra((prevState) => !prevState)}
            className={`cursor-pointer transform transition-transform ${
              showExtra && "-rotate-180"
            }`}
          />
        </div>
        <p>{`$${item.price}`}</p>
      </div>

      {showExtra && (
        <div>
          <div className="flex gap-2 flex-wrap">
            {item.singularOptions.map((option, idx) => {
              const separator =
                idx != item.singularOptions.length - 1 ? "," : "";
              return <p key={idx}>{`${option}${separator} `}</p>;
            })}
          </div>

          <div className="flex gap-2 flex-wrap">
            {item.multipleOptions.map((option, idx) => {
              const separator =
                idx != item.multipleOptions.length - 1 ? "," : "";
              return <p key={idx}>{`${option}${separator} `}</p>;
            })}
          </div>

          <div className="flex gap-2 flex-wrap">
            <p>{item.specialRequests}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Item;
