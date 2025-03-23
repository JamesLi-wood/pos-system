import React, {
  useState,
  useRef,
  useMemo,
  Dispatch,
  SetStateAction,
} from "react";

interface GroupType {
  id: number;
  name: React.RefObject<HTMLInputElement | null>;
  price: React.RefObject<HTMLInputElement | null>;
}

interface SingularType {
  id: number;
  title: React.RefObject<HTMLInputElement | null>;
  choices: GroupType[];
}

const Groups = ({
  data,
  addItem,
  removeItem,
}: {
  data: GroupType[];
  addItem: () => void;
  removeItem: (itemIdx: number) => void;
}) => {
  return (
    <div>
      <div>
        {data.map((choice) => {
          return (
            <div key={choice.id} className="flex gap-4">
              <p>choice {choice.id}</p>
              <input ref={choice.name} type="text" className="text-black" />
              <input ref={choice.price} type="number" className="text-black" />
              <button onClick={() => removeItem(choice.id)}>remove</button>
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
  const idCounter = useRef(1);
  const [singularGroup, setSingularGroup] = useState<SingularType[]>([]);
  const [multipleGroup, setMultipleGroup] = useState<SingularType[]>([
    {
      id: 0,
      title: React.createRef<HTMLInputElement>(),
      choices: [],
    },
  ]);

  const addMenuItem = () => {
    console.log(nameRef.current?.value);
    console.log(descriptionRef.current?.value);
    console.log(priceRef.current?.value);
    console.log(singularGroup);
    console.log(multipleGroup);
  };

  const addSingularGroup = () => {
    const newId = idCounter.current++;
    setSingularGroup((prevState) => [
      ...prevState,
      {
        id: newId,
        title: React.createRef<HTMLInputElement>(),
        choices: [],
      },
    ]);
  };

  const removeSingularGroup = (id: number) => {
    setSingularGroup((prevState) => prevState.filter((data) => data.id !== id));
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

  const loadSingularGroups = useMemo(() => {
    return (
      <div>
        {singularGroup.map((data, idx) => {
          return (
            <div key={data.id} className="border">
              <input ref={data.title} type="text" className="text-black" />
              <Groups
                data={data.choices}
                addItem={() => addGroupItem(setSingularGroup, idx)}
                removeItem={(itemIdx) =>
                  removeGroupItem(setSingularGroup, idx, itemIdx)
                }
              />
              <button
                onClick={() => {
                  removeSingularGroup(data.id);
                }}
              >
                REMOVE
              </button>
            </div>
          );
        })}
        <button onClick={addSingularGroup}>+</button>
      </div>
    );
  }, [singularGroup]);

  const loadMultipleGroup = useMemo(() => {
    return (
      <div>
        <div className="border">
          <input
            ref={multipleGroup[0].title}
            type="text"
            className="text-black"
          />
          <Groups
            data={multipleGroup[0].choices}
            addItem={() => addGroupItem(setMultipleGroup, 0)}
            removeItem={(itemIdx) =>
              removeGroupItem(setMultipleGroup, 0, itemIdx)
            }
          />
        </div>
      </div>
    );
  }, [multipleGroup]);

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
      </div>

      <div className="flex flex-col">
        <p>Multiple Options</p>
        {loadMultipleGroup}
      </div>

      <button onClick={addMenuItem}>ADD</button>
    </div>
  );
};

export default MenuItemAdd;
