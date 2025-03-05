import React, { useState } from "react";
import { SlArrowDown } from "react-icons/sl";
import { OrderType } from "../types";

const Item = ({ item }: { item: OrderType }) => {
  const [showExtra, setShowExtra] = useState(false);

  return (
    <div className="w-full">
      <div className="flex justify-between mt-2">
        <div className="flex items-center gap-2">
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
