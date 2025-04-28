import { useContext } from "react";
import MenuItemAdd from "./menuItemAdd";
import MenuItemEdit from "./menuItemEdit";
import { menuContext } from "./menu";
import { HiOutlineBan } from "react-icons/hi";
import { CgAddR } from "react-icons/cg";
import { FaTrashAlt } from "react-icons/fa";
import { RiSettings4Fill } from "react-icons/ri";
import { MenuItemType } from "@/app/types";

const MenuItems = ({ items }: { items: MenuItemType[] | null }) => {
  const context = useContext(menuContext);
  if (!context) {
    throw new Error("tableContext must be used within a Provider");
  }
  const {
    sectionedMenu,
    setSectionedMenu,
    refetchData,
    setMenuItems,
    setSlideDownContent,
  } = context;

  if (!sectionedMenu) return;

  const deleteMenuItem = async (id: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/menu/delete/menu-item/${sectionedMenu}/${id}`,
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

  const deleteSectionedMenu = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/menu/delete/sectioned-menu/${sectionedMenu}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      await refetchData();
      setSectionedMenu("");
      setMenuItems(null);
    }
  };

  return (
    <div className="overflow-y-scroll scroll-hidden mt-20">
      <div className="flex ml-10 gap-4 items-center">
        <p className="text-4xl max-sm:text-2xl">{sectionedMenu}</p>
        <button
          onClick={() => {
            setSlideDownContent(<MenuItemAdd />);
          }}
        >
          <CgAddR className="w-10 h-10" />
        </button>

        <button onClick={deleteSectionedMenu}>
          <FaTrashAlt className="w-10 h-10" />
        </button>
      </div>

      {items && (
        <div className="my-8 mx-10 flex flex-wrap gap-4 justify-center">
          {items.map((item) => {
            const imageUrl = item.image.data
              ? `data:${item.image.contentType};base64,${item.image.data}`
              : null;

            return (
              <div key={item._id} className="flex flex-col border w-[400px]">
                <div className="h-[300px] border">
                  {imageUrl ? (
                    <img
                      className="object-cover h-full w-full"
                      src={imageUrl}
                      alt={item.image.name}
                    />
                  ) : (
                    <HiOutlineBan className="w-full h-full" />
                  )}
                </div>
                <div className="flex flex-row justify-between items-center p-4">
                  <p>{item.name}</p>

                  <div className="flex gap-4 ">
                    <button
                      className="bg-blue-500 p-2"
                      onClick={() => {
                        setSlideDownContent(<MenuItemEdit item={item} />);
                      }}
                    >
                      <RiSettings4Fill className="w-7 h-7" />
                    </button>
                    <button
                      className="bg-red-500 p-2"
                      onClick={() => deleteMenuItem(item._id)}
                    >
                      <FaTrashAlt className="w-7 h-7" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MenuItems;
