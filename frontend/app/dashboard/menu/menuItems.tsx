import { useEffect, useState } from "react";
import { MenuItemType } from "@/app/types";
import SlideDown from "@/app/components/slidedown";
import MenuItemAdd from "./menuItemAdd";
import MenuItemEdit from "./menuItemEdit";

const MenuItems = ({
  items,
  sectionedMenu,
}: {
  items: MenuItemType[] | null;
  sectionedMenu: string;
}) => {
  const [showEdit, setShowEdit] = useState(-1);
  const [slideDownContent, setSlideDownContent] =
    useState<React.ReactNode | null>(null);

  useEffect(() => {
    setShowEdit(-1);
  }, [items]);

  return (
    <div>
      {items && (
        <>
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
                      setSlideDownContent(
                        <MenuItemEdit
                          item={item}
                          sectionedMenu={sectionedMenu}
                          setSlideDownContent={setSlideDownContent}
                        />
                      );
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
              setSlideDownContent(
                <MenuItemAdd
                  sectionedMenu={sectionedMenu}
                  setSlideDownContent={setSlideDownContent}
                />
              );
            }}
          >
            Add
          </button>
        </>
      )}

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
