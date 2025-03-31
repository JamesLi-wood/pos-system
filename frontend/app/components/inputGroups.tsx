import { VscChromeClose } from "react-icons/vsc";

interface MenuItemType {
  id: number;
  name: React.RefObject<HTMLInputElement | null>;
  defaultName: string;
  price: React.RefObject<HTMLInputElement | null>;
  defaultPrice: number;
}

const InputGroups = ({
  data,
  removeItem,
}: {
  data: MenuItemType[];
  removeItem: (itemId: number) => void;
}) => {
  return (
    <div className="flex flex-col items-center">
      {data.map((choice, idx) => {
        return (
          <div key={choice.id}>
            <div className="flex flex-row gap-4 justify-center">
              <div className="flex flex-col">
                <input
                  ref={choice.name}
                  type="text"
                  className="text-base my-2 bg-transparent border border-gray-500 p-2 outline-none"
                  placeholder="Name"
                  defaultValue={choice.defaultName}
                />
                <input
                  ref={choice.price}
                  type="number"
                  className="text-base my-2 bg-transparent border border-gray-500 p-2 outline-none"
                  placeholder="Price"
                  defaultValue={
                    choice.defaultPrice == -1 ? "" : choice.defaultPrice
                  }
                />
              </div>
              <button
                className="bg-red-500 h-10 my-2 p-3"
                onClick={() => removeItem(choice.id)}
              >
                <VscChromeClose />
              </button>
            </div>
            {idx !== data.length - 1 && <hr className="my-3" />}
          </div>
        );
      })}
    </div>
  );
};

export default InputGroups;
