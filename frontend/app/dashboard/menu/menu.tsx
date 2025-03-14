import { useEffect, useMemo, useState } from "react";
import SectionedMenu from "./sectionedMenu";
import MenuItems from "./menuItems";
import { MenuItemType } from "../../types";
import useFetchRestaurantData from "@/app/hooks/useFetchRestaurantData";

const Menu = () => {
  const { menu, loading, refetchData } = useFetchRestaurantData();
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);

  useEffect(() => {
    if (!loading && menu.length > 0) setMenuItems(menu[0].data);
  }, [menu, loading]);

  const displaySectionedMenu = useMemo(() => {
    return (
      <SectionedMenu
        menu={menu}
        setMenuItems={setMenuItems}
        refetchData={refetchData}
      />
    );
  }, [menu]);

  return (
    <div className="flex">
      {displaySectionedMenu}

      <MenuItems items={menuItems} />
    </div>
  );
};

export default Menu;
