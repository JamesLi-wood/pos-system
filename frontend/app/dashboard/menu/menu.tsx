import { useState } from "react";
import SectionedMenu from "./sectionedMenu";
import MenuItems from "./menuItems";
import { MenuItemType } from "../../types";
import useFetchRestaurantData from "@/app/hooks/useFetchRestaurantData";

const Menu = () => {
  const { menu, refetchData } = useFetchRestaurantData();
  const [menuItems, setMenuItems] = useState<MenuItemType[] | null>(null);
  const [sectionedMenu, setSectionedMenu] = useState("");

  return (
    <div className="flex">
      <SectionedMenu
        menu={menu}
        setMenuItems={setMenuItems}
        setSectionedMenu={setSectionedMenu}
        refetchData={refetchData}
      />

      <MenuItems items={menuItems} sectionedMenu={sectionedMenu} />
    </div>
  );
};

export default Menu;
