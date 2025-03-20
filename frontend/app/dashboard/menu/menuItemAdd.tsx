import { useState, useRef, useMemo } from "react";

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
}: {
  data: GroupType;
  addItem: () => void;
  removeItem: (itemIdx: number) => void;
}) => {
  return (
    <div>
      <div>GROUP {data.id}</div>
      <div>
        {data.choices.map((choice, idx) => {
          return (
            <div key={idx} className="flex gap-4">
              <p>choice {idx}</p>
              <input type="text" className="text-black" />
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

  const addSingularItem = (idx: number) => {
    setSingularData((prevState) => {
      const newState = [...prevState];
      newState[idx] = {
        ...newState[idx],
        choices: [...newState[idx].choices, { name: "", price: 0 }],
      };
      return newState;
    });
  };

  const removeSingularItem = (groupIdx: number, itemIdx: number) => {
    setSingularData((prevState) => {
      const newState = [...prevState];
      newState[groupIdx] = {
        ...newState[groupIdx],
        choices: newState[groupIdx].choices.filter((_, idx) => idx !== itemIdx),
      };
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
                addItem={() => addSingularItem(idx)}
                removeItem={(itemIdx) => removeSingularItem(idx, itemIdx)}
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
