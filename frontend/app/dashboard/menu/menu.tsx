import { useState, createContext } from "react";
import SectionedMenu from "./sectionedMenu";
import MenuItems from "./menuItems";
import { MenuItemType } from "../../types";
import useFetchRestaurantData from "@/app/hooks/useFetchRestaurantData";
import { dashboardMenuContextType } from "../../types";

export const menuContext = createContext<dashboardMenuContextType | undefined>(
  undefined
);

const Menu = () => {
  const { menu, refetchData } = useFetchRestaurantData();
  const [menuItems, setMenuItems] = useState<MenuItemType[] | null>(null);
  const [sectionedMenu, setSectionedMenu] = useState("");
  const [slideDownContent, setSlideDownContent] =
    useState<React.ReactNode | null>(null);

  const contextValue = {
    refetchData,
    setMenuItems,
    sectionedMenu,
    setSectionedMenu,
    slideDownContent,
    setSlideDownContent,
  };

  return (
    <div className="flex max-md:flex-row flex-col border w-full">
      <menuContext.Provider value={contextValue}>
        <SectionedMenu menu={menu} />

        <MenuItems items={menuItems} />
      </menuContext.Provider>
    </div>
  );
};

export default Menu;
