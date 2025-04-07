import { useState, useContext, useRef } from "react";
import SlideDown from "../../components/slidedown";
import { menuContext } from "./menu";
import { MenuType } from "@/app/types";

const SectionedMenu = ({ menu }: { menu: MenuType[] }) => {
  const context = useContext(menuContext);
  if (!context) {
    throw new Error("tableContext must be used within a Provider");
  }
  const {
    refetchData,
    setMenuItems,
    setSectionedMenu,
    slideDownContent,
    setSlideDownContent,
  } = context;
  const [showDelete, setShowDelete] = useState(-1);
  const [paginate, setPaginate] = useState(0);

  const addSectionedMenu = async (name: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/menu/add/sectioned-menu`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      }
    );

    if (response.ok) {
      await refetchData();
      setSlideDownContent(null);
    }
  };

  const deleteSectionedMenu = async (name: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/menu/delete/sectioned-menu/${name}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      await refetchData();
      setSlideDownContent(null);
    }
  };

  const AddMenu = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState(false);

    const handleSubmit = () => {
      if (!inputRef.current) return;

      const input = inputRef.current.value;
      if (input === "") {
        setError(true);
        return;
      }

      addSectionedMenu(input);
    };
    return (
      <div className="mt-40">
        <div>Add</div>
        <input ref={inputRef} type="text" className="text-black" />
        <button onClick={handleSubmit}>submit</button>
        {error && <div>Please Enter Something</div>}
      </div>
    );
  };

  const DeleteMenu = ({ name }: { name: string }) => {
    return (
      <div className="mt-40">
        <p>{`Are you sure you want to delete ${name}?`}</p>
        <button
          onClick={() => {
            deleteSectionedMenu(name);
          }}
        >
          Delete
        </button>
      </div>
    );
  };

  const paginateDown = () => {
    if (paginate - 5 < 0) return;
    setPaginate((prevState) => (prevState -= 5));
  };

  const paginateUp = () => {
    if (paginate + 5 > menu.length - 1) return;
    setPaginate((prevState) => (prevState += 5));
  };

  return (
    <div className="flex flex-row max-md:flex-col">
      <button
        className="bg-green-500 px-4 py-2"
        onClick={() => {
          setSlideDownContent(<AddMenu />);
        }}
      >
        Add Sectioned Menu
      </button>

      <div className="flex gap-5 flex-row max-md:flex-col">
        {menu.length > 5 && <button onClick={paginateDown}>{`<`}</button>}
        {[...Array(5)].map((_, idx) => {
          const item = menu[paginate + idx];
          if (!item) return;

          return (
            <div
              key={item.name}
              className="flex border p-2"
              onClick={() => {
                setMenuItems(item.data);
                setSectionedMenu(item.name);
                showDelete === idx ? setShowDelete(-1) : setShowDelete(idx);
              }}
            >
              <p>{item.name}</p>
              {showDelete === idx && (
                <button
                  onClick={() => {
                    setSlideDownContent(<DeleteMenu name={item.name} />);
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          );
        })}
        {menu.length > 5 && <button onClick={paginateUp}>{`>`}</button>}
      </div>

      {slideDownContent && (
        <SlideDown
          handleRemove={() => {
            setSlideDownContent(null);
          }}
        >
          {slideDownContent}
        </SlideDown>
      )}
    </div>
  );
};

export default SectionedMenu;
