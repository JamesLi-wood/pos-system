import { useState, useRef, useMemo, Dispatch, SetStateAction } from "react";

interface GroupType {
  id: number;
  title: string;
  choices: {
    name: string;
    price: number;
  }[];
}
const Groups = ({
  data,
  addItem,
  removeItem,
  handleNameChange,
  handlePriceChange,
}: {
  data: GroupType;
  addItem: () => void;
  removeItem: (itemIdx: number) => void;
  handleNameChange: (itemIdx: number, value: string) => void;
  handlePriceChange: (itemIdx: number, value: number) => void;
}) => {
  return (
    <div>
      <div>GROUP {data.id}</div>
      <div>
        {data.choices.map((choice, idx) => {
          return (
            <div key={idx} className="flex gap-4">
              <p>choice {idx}</p>
              <input
                type="text"
                className="text-black"
                onChange={(e) => handleNameChange(idx, e.target.value)}
                value={choice.name}
              />
              <input
                type="number"
                className="text-black"
                onChange={(e) => handlePriceChange(idx, Number(e.target.value))}
                value={choice.price}
              />
              <button onClick={() => removeItem(idx)}>remove</button>
            </div>
          );
        })}
      </div>
      <button onClick={addItem}>ADD ITEM</button>
    </div>
  );
};

const MenuItemAdd = () => {
  const nameRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLInputElement | null>(null);
  const priceRef = useRef<HTMLInputElement | null>(null);
  const [singularGroup, setSingularGroup] = useState<number[]>([]);
  const [singularData, setSingularData] = useState<GroupType[]>([]);
  const idCounter = useRef(1);

  const addMenuItem = () => {
    console.log(nameRef.current?.value);
    console.log(descriptionRef.current?.value);
    console.log(priceRef.current?.value);
    console.log(singularData)
  };

  const addSingularGroup = () => {
    const newID = idCounter.current++;
    setSingularGroup((prevState) => [...prevState, newID]);
    setSingularData((prevState) => [
      ...prevState,
      {
        id: newID,
        title: "",
        choices: [],
      },
    ]);
  };

  const removeSingularGroup = (id: number) => {
    setSingularGroup((prevState) =>
      prevState.filter((groupID) => groupID !== id)
    );
    setSingularData((prevState) => prevState.filter((data) => data.id !== id));
  };

  const addGroupItem = (
    setState: Dispatch<SetStateAction<GroupType[]>>,
    idx: number
  ) => {
    setState((prevState) => {
      const newState = [...prevState];
      newState[idx] = {
        ...newState[idx],
        choices: [...newState[idx].choices, { name: "", price: 0 }],
      };
      return newState;
    });
  };

  const removeGroupItem = (
    setState: Dispatch<SetStateAction<GroupType[]>>,
    groupIdx: number,
    itemIdx: number
  ) => {
    setState((prevState) => {
      const newState = [...prevState];
      newState[groupIdx] = {
        ...newState[groupIdx],
        choices: newState[groupIdx].choices.filter((_, idx) => idx !== itemIdx),
      };
      return newState;
    });
  };

  const handleNameChange = (
    setState: Dispatch<SetStateAction<GroupType[]>>,
    groupIdx: number,
    itemIdx: number,
    value: string
  ) => {
    setState((prevState) => {
      const newState = [...prevState];
      newState[groupIdx].choices[itemIdx].name = value;
      return newState;
    });
  };

  const handlePriceChange = (
    setState: Dispatch<SetStateAction<GroupType[]>>,
    groupIdx: number,
    itemIdx: number,
    value: number
  ) => {
    setState((prevState) => {
      const newState = [...prevState];
      newState[groupIdx].choices[itemIdx].price = value;
      return newState;
    });
  };

  const loadSingularGroups = useMemo(() => {
    return (
      <div>
        {singularGroup.map((id, idx) => {
          return (
            <div key={idx} className="border">
              <Groups
                data={singularData[idx]}
                addItem={() => addGroupItem(setSingularData, idx)}
                removeItem={(itemIdx) =>
                  removeGroupItem(setSingularData, idx, itemIdx)
                }
                handleNameChange={(itemIdx, value) =>
                  handleNameChange(setSingularData, idx, itemIdx, value)
                }
                handlePriceChange={(itemIdx, value) =>
                  handlePriceChange(setSingularData, idx, itemIdx, value)
                }
              />
              <button
                onClick={() => {
                  removeSingularGroup(id);
                }}
              >
                REMOVE
              </button>
            </div>
          );
        })}
      </div>
    );
  }, [singularGroup, singularData]);

  return (
    <div>
      <p>Please fill out the fields</p>

      <div>
        <div>Name</div>
        <input ref={nameRef} type="text" className="text-black" />
      </div>
      <div>
        <div>Description</div>
        <input ref={descriptionRef} type="text" className="text-black" />
      </div>
      <div>
        <div>Price</div>
        <input ref={priceRef} type="number" className="text-black" />
      </div>

      <div>
        <p>Singular Options</p>
        {loadSingularGroups}
        <button onClick={addSingularGroup}>+</button>
      </div>

      <div className="flex flex-col">
        <p>Multiple Options</p>

        <div>
          <button>+</button>
        </div>
      </div>

      <button onClick={addMenuItem}>ADD</button>
    </div>
  );
};

export default MenuItemAdd;
