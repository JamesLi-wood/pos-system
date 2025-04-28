import { useState, createContext, useEffect } from "react";
import SlideDown from "@/app/components/slidedown";
import SectionedMenu from "./sectionedMenu";
import MenuItems from "./menuItems";
import useFetchRestaurantData from "@/app/hooks/useFetchRestaurantData";
import { dashboardMenuContextType, MenuItemType } from "../../types";

export const menuContext = createContext<dashboardMenuContextType | undefined>(
  undefined
);

const Menu = () => {
  const { menu, refetchData} = useFetchRestaurantData();
  const [menuItems, setMenuItems] = useState<MenuItemType[] | null>(null);
  const [sectionedMenu, setSectionedMenu] = useState("");
  const [slideDownContent, setSlideDownContent] =
    useState<React.ReactNode | null>(null);

  const contextValue = {
    refetchData,
    setMenuItems,
    sectionedMenu,
    setSectionedMenu,
    setSlideDownContent,
  };

  useEffect(() => {
    if (sectionedMenu) {
      const data = menu.find((item) => item.name == sectionedMenu)?.data;
      if (data) setMenuItems(data);
    }
  }, [menu]);

  return (
    <div className="relative flex flex-col w-full">
      <menuContext.Provider value={contextValue}>
        <SectionedMenu menu={menu} />
        <MenuItems items={menuItems} />

        {slideDownContent && (
          <SlideDown
            handleRemove={() => {
              setSlideDownContent(null);
            }}
          >
            {slideDownContent}
          </SlideDown>
        )}
      </menuContext.Provider>
    </div>
  );
};

export default Menu;
