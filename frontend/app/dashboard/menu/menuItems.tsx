import { useEffect, useState } from "react";
import { MenuItemType } from "@/app/types";
import SlideDown from "@/app/components/slidedown";
import MenuItemAdd from "./menuItemAdd";
import MenuItemEdit from "./menuItemEdit";

const MenuItems = ({ items }: { items: MenuItemType[] }) => {
  const [showEdit, setShowEdit] = useState(-1);
  const [slideDownContent, setSlideDownContent] =
    useState<React.ReactNode | null>(null);

  useEffect(() => {
    setShowEdit(-1);
  }, [items]);

  return (
    <div>
      {items.map((item, idx) => {
        return (
          <div key={item._id} className="flex">
            <p
              onClick={() => {
                showEdit === idx ? setShowEdit(-1) : setShowEdit(idx);
              }}
            >
              {item.name}
            </p>
            {showEdit === idx && (
              <button
                onClick={() => {
                  setSlideDownContent(<MenuItemEdit />);
                }}
              >
                Edit
              </button>
            )}
          </div>
        );
      })}
      <button
        onClick={() => {
          setSlideDownContent(<MenuItemAdd />);
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

export default MenuItems;
