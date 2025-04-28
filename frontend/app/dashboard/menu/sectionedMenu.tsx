import { useState, useEffect, useContext, useRef } from "react";
import { menuContext } from "./menu";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { MenuType } from "@/app/types";

const SectionedMenu = ({ menu }: { menu: MenuType[] }) => {
  const context = useContext(menuContext);
  if (!context) {
    throw new Error("tableContext must be used within a Provider");
  }
  const { refetchData, setMenuItems, setSectionedMenu, setSlideDownContent } =
    context;
  const [paginate, setPaginate] = useState(0);

  useEffect(() => {
    setPaginate(0);
  }, [menu]);

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
      setSectionedMenu(name);
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

  const paginateDown = () => {
    if (paginate - 5 < 0) return;
    setPaginate((prevState) => (prevState -= 5));
  };

  const paginateUp = () => {
    if (paginate + 5 > menu.length - 1) return;
    setPaginate((prevState) => (prevState += 5));
  };

  return (
    <div className="overflow-x-scroll scroll-hidden absolute left-0 top-0 right-0 flex items-center gap-6 bg-blue-500 px-4 py-3">
      <button
        className="bg-green-500 px-4 py-2 "
        onClick={() => {
          setSlideDownContent(<AddMenu />);
        }}
      >
        Add
      </button>

      <div className="flex gap-5 flex-row">
        {menu.length > 5 && (
          <button className="border px-3" onClick={paginateDown}>
            <SlArrowLeft />
          </button>
        )}
        {[...Array(5)].map((_, idx) => {
          const item = menu[paginate + idx];
          if (!item) return;

          return (
            <div
              key={item.name}
              className="flex border p-2 cursor-pointer"
              onClick={() => {
                setMenuItems(item.data);
                setSectionedMenu(item.name);
              }}
            >
              <p>{item.name}</p>
            </div>
          );
        })}
        {menu.length > 5 && (
          <button className="border px-3" onClick={paginateUp}>
            <SlArrowRight />
          </button>
        )}
      </div>
    </div>
  );
};

export default SectionedMenu;
