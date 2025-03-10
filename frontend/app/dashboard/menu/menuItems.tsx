import { useEffect, useState } from "react";
import { MenuItemType } from "@/app/types";

const MenuItems = ({ items }: { items: MenuItemType[] }) => {
  const [showEdit, setShowEdit] = useState(-1);

  useEffect(() => {
    setShowEdit(-1);
  }, [items]);

  return (
    <div>
      {items.map((item, idx) => {
        return (
          <div
            key={item.name}
            className="flex"
            onClick={() => {
              showEdit === idx ? setShowEdit(-1) : setShowEdit(idx);
            }}
          >
            <p>{item.name}</p>
            {showEdit === idx && <button>Edit</button>}
          </div>
        );
      })}
    </div>
  );
};

export default MenuItems;
