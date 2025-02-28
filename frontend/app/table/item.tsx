import React, { useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
import { SlArrowDown } from "react-icons/sl";
import { OrderType } from "../types";

const Item = ({
  item,
  handleRemove,
  showDelete,
}: {
  item: OrderType;
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
        <div className="ml-4">
          {item.singularOptions.length > 0 && (
            <p>{`- ${item.singularOptions.join(", ")}`}</p>
          )}
          {item.multipleOptions.length > 0 && (
            <p>{`- ${item.multipleOptions.join(", ")}`}</p>
          )}
          {item.specialRequests && <p>{`- ${item.specialRequests}`}</p>}
        </div>
      )}
    </div>
  );
};

export default Item;
