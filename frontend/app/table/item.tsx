import { useState } from "react";
import { SlArrowDown } from "react-icons/sl";
import { OrderType } from "../types";

const Item = ({ item }: { item: OrderType }) => {
  const [showExtra, setShowExtra] = useState(false);

  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-between py-1 items-center">
        <SlArrowDown
          onClick={() => setShowExtra((prevState) => !prevState)}
          className={`mr-2 cursor-pointer transform transition-transform ${
            showExtra && "-rotate-180"
          }`}
        />
        <div className="flex-1 min-w-0">
          <p className="truncate">{`${item.quantity}x ${item.name}`}</p>
        </div>
        <p>{`$${item.price.toFixed(2)}`}</p>
      </div>

      {showExtra && (
        <div className="ml-4">
          {item.requiredOptions.length > 0 && (
            <p>{`- ${item.requiredOptions.join(", ")}`}</p>
          )}
          {item.additionalOptions.length > 0 && (
            <p>{`- ${item.additionalOptions.join(", ")}`}</p>
          )}
          {item.specialRequests && <p>{`- ${item.specialRequests}`}</p>}
        </div>
      )}
    </div>
  );
};

export default Item;
