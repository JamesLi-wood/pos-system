import React, {
  useState,
  useRef,
  useMemo,
  Dispatch,
  SetStateAction,
} from "react";
import { VscChromeClose } from "react-icons/vsc";

interface GroupType {
  id: number;
  name: React.RefObject<HTMLInputElement | null>;
  price: React.RefObject<HTMLInputElement | null>;
}

interface SingularType {
  id: number;
  title: React.RefObject<HTMLInputElement | null> | null;
  choices: GroupType[];
}

const Groups = ({
  data,
  removeItem,
}: {
  data: GroupType[];
  removeItem: (itemIdx: number) => void;
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
                />
                <input
                  ref={choice.price}
                  type="number"
                  className="text-base my-2 bg-transparent border border-gray-500 p-2 outline-none"
                  placeholder="Price"
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

const MenuItemAdd = ({
  sectionedMenu,
  setSlideDownContent,
}: {
  sectionedMenu: string;
  setSlideDownContent: Dispatch<SetStateAction<React.ReactNode | null>>;
}) => {
  const nameRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLInputElement | null>(null);
  const priceRef = useRef<HTMLInputElement | null>(null);
  const idCounter = useRef(1);
  const [requiredOptions, setRequiredOptions] = useState<SingularType[]>([]);
  const [additionalChoices, setAdditionalChoices] = useState<SingularType[]>([
    {
      id: 0,
      title: null,
      choices: [],
    },
  ]);

  const addMenuItem = async () => {
    const nameField = nameRef.current?.value;
    const descriptionField = descriptionRef.current?.value;
    const priceField = Number(priceRef.current?.value);
    const requiredField = requiredOptions.map((option) => {
      const title = option.title?.current?.value;
      const choices = option.choices.map((choice) => {
        return {
          name: choice.name.current?.value,
          price: Number(choice.price.current?.value),
        };
      });
      return { title: title, choices: choices };
    });
    const additionalField = additionalChoices[0].choices.map((choice) => {
      return {
        name: choice.name.current?.value,
        price: Number(choice.price.current?.value),
      };
    });

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/menu/add/menu-item/${sectionedMenu}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: nameField,
          description: descriptionField,
          price: priceField,
          requiredOptions: requiredField,
          additionalOptions: additionalField,
        }),
      }
    );

    if (response.ok) setSlideDownContent(null);
  };

  const addSingularGroup = () => {
    const newId = idCounter.current++;
    setRequiredOptions((prevState) => [
      ...prevState,
      {
        id: newId,
        title: React.createRef<HTMLInputElement>(),
        choices: [],
      },
    ]);
  };

  const removeSingularGroup = (id: number) => {
    setRequiredOptions((prevState) =>
      prevState.filter((data) => data.id !== id)
    );
  };

  const addGroupItem = (
    setState: Dispatch<SetStateAction<SingularType[]>>,
    idx: number
  ) => {
    const newId = idCounter.current++;
    setState((prevState) => {
      const newState = [...prevState];

      newState[idx] = {
        ...newState[idx],
        choices: [
          ...newState[idx].choices,
          {
            id: newId,
            name: React.createRef<HTMLInputElement>(),
            price: React.createRef<HTMLInputElement>(),
          },
        ],
      };

      return newState;
    });
  };

  const removeGroupItem = (
    setState: Dispatch<SetStateAction<SingularType[]>>,
    groupIdx: number,
    itemId: number
  ) => {
    setState((prevState) => {
      const newState = [...prevState];

      newState[groupIdx] = {
        ...newState[groupIdx],
        choices: newState[groupIdx].choices.filter(
          (data) => data.id !== itemId
        ),
      };

      return newState;
    });
  };

  const loadRequiredOptions = useMemo(() => {
    return (
      <div className="p-4 border border-x-0 border-t-0 border-white">
        <div className="flex justify-center items-center gap-4">
          <p className="text-2xl">Required Options</p>
          <button
            className="border border-gray-500 py-1 px-3"
            onClick={addSingularGroup}
          >
            +
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {requiredOptions.map((data, idx) => {
            return (
              <div key={data.id}>
                <div className="flex gap-4 flex-row items-center justify-center">
                  <p className="text-xl">Title</p>
                  <input
                    ref={data.title}
                    type="text"
                    className="text-base my-2 bg-transparent border border-gray-500 p-2 outline-none"
                  />
                </div>

                <Groups
                  data={data.choices}
                  removeItem={(itemIdx) =>
                    removeGroupItem(setRequiredOptions, idx, itemIdx)
                  }
                />
                <div className="flex justify-center gap-4 mt-2">
                  <button
                    className="bg-green-500 p-2"
                    onClick={() => {
                      addGroupItem(setRequiredOptions, idx);
                    }}
                  >
                    Add Item
                  </button>
                  <button
                    className="bg-red-500 p-2"
                    onClick={() => {
                      removeSingularGroup(data.id);
                    }}
                  >
                    Remove Group
                  </button>
                </div>
                {idx !== requiredOptions.length - 1 && <hr className="my-3" />}
              </div>
            );
          })}
        </div>
      </div>
    );
  }, [requiredOptions]);

  const loadAdditionalChoices = useMemo(() => {
    return (
      <div className="p-4">
        <div className="flex justify-center items-center gap-4">
          <p className="text-2xl">Additional Choices</p>
          <button
            className="border border-gray-500 py-1 px-3"
            onClick={() => addGroupItem(setAdditionalChoices, 0)}
          >
            +
          </button>
        </div>
        <Groups
          data={additionalChoices[0].choices}
          removeItem={(itemIdx) =>
            removeGroupItem(setAdditionalChoices, 0, itemIdx)
          }
        />
      </div>
    );
  }, [additionalChoices]);

  return (
    <div className="bg-inherit">
      <div className="sticky top-0 bg-inherit">
        <p className="text-xl py-5 pl-4">Create menu item</p>
        <hr />
      </div>
      <div className="flex flex-col items-center p-4 border border-x-0 border-t-0 border-white">
        <div className="text-2xl">Name</div>
        <input
          ref={nameRef}
          type="text"
          className="text-base my-2 bg-transparent border border-gray-500 p-2 resize-none text-white w-full outline-none"
        />
      </div>
      <div className="flex flex-col items-center p-4 border border-x-0 border-t-0 border-white">
        <div className="text-2xl">Description</div>
        <input
          ref={descriptionRef}
          type="text"
          className="text-base my-2 bg-transparent border border-gray-500 p-2 resize-none text-white w-full outline-none"
        />
      </div>
      <div className="flex flex-col items-center p-4 border border-x-0 border-t-0 border-white">
        <div className="text-2xl">Price</div>
        <input
          ref={priceRef}
          type="number"
          className="text-base my-2 bg-transparent border border-gray-500 p-2 resize-none text-white w-full outline-none"
          inputMode="numeric"
        />
      </div>
      {loadRequiredOptions}
      {loadAdditionalChoices}
      <button
        className="sticky w-full text-center py-3 bottom-0 bg-green-500"
        onClick={addMenuItem}
      >
        Add to {sectionedMenu}
      </button>
    </div>
  );
};

export default MenuItemAdd;
