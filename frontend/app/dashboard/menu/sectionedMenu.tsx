import { useState, Dispatch, SetStateAction } from "react";
import SlideDown from "../../components/slidedown";
import { MenuType, MenuItemType } from "@/app/types";

const SectionedMenu = ({
  menu,
  setMenuItems,
}: {
  menu: MenuType[];
  setMenuItems: Dispatch<SetStateAction<MenuItemType[]>>;
}) => {
  const [showDelete, setShowDelete] = useState(-1);
  const [slideDownContent, setSlideDownContent] = useState(false);

  return (
    <div>
      {menu.map((item, idx) => {
        return (
          <div
            key={item.name}
            className="flex"
            onClick={() => {
              setMenuItems(item.data);
              showDelete === idx ? setShowDelete(-1) : setShowDelete(idx);
            }}
          >
            <p>{item.name}</p>
            {showDelete === idx && (
              <button
                onClick={() => {
                  setSlideDownContent(true);
                }}
              >
                Delete
              </button>
            )}
          </div>
        );
      })}

      {slideDownContent && (
        <SlideDown
          handleRemove={() => {
            setSlideDownContent(false);
          }}
        >
          <div>Are you sure you want to delete?</div>
        </SlideDown>
      )}
    </div>
  );
};

export default SectionedMenu;
