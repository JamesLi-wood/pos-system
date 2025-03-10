import { useEffect, useMemo, useState } from "react";
import SectionedMenu from "./sectionedMenu";
import MenuItems from "./menuItems";
import { MenuType, MenuItemType } from "../../types";

const Menu = () => {
  const [menu, setMenu] = useState<MenuType[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/menu`)
      .then((res) => res.json())
      .then((data) => {
        setMenu(data.menu);
        setMenuItems(data.menu[0].data);
      });
  }, []);

  const displaySectionedMenu = useMemo(() => {
    return <SectionedMenu menu={menu} setMenuItems={setMenuItems} />;
  }, [menu]);

  return (
    <div className="flex">
      {displaySectionedMenu}

      <MenuItems items={menuItems} />
    </div>
  );
};

export default Menu;
