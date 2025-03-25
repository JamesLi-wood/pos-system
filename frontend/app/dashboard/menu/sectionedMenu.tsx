import { useState, Dispatch, SetStateAction, useRef } from "react";
import SlideDown from "../../components/slidedown";
import { MenuType, MenuItemType } from "@/app/types";

const SectionedMenu = ({
  menu,
  setMenuItems,
  setSectionedMenu,
  refetchData,
}: {
  menu: MenuType[];
  setMenuItems: Dispatch<SetStateAction<MenuItemType[] | null>>;
  setSectionedMenu: Dispatch<SetStateAction<string>>;
  refetchData: () => Promise<void>;
}) => {
  const [showDelete, setShowDelete] = useState(-1);
  const [slideDownContent, setSlideDownContent] =
    useState<React.ReactNode | null>(null);

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

  return (
    <div>
      {menu.map((item, idx) => {
        return (
          <div key={item.name} className="flex">
            <p
              onClick={() => {
                setMenuItems(item.data);
                setSectionedMenu(item.name);
                showDelete === idx ? setShowDelete(-1) : setShowDelete(idx);
              }}
            >
              {item.name}
            </p>
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
      <button
        onClick={() => {
          setSlideDownContent(<AddMenu />);
        }}
      >
        Add
      </button>

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
