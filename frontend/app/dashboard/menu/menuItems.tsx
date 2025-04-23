import { useContext } from "react";
import MenuItemAdd from "./menuItemAdd";
import MenuItemEdit from "./menuItemEdit";
import { menuContext } from "./menu";
import { HiOutlineBan } from "react-icons/hi";
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
    <div className="overflow-y-scroll">
      <div className="flex ml-4 mb-4 gap-4">
        <p className="text-4xl">{sectionedMenu}</p>
        <button
          className="bg-green-500 px-4 py-2"
          onClick={() => {
            setSlideDownContent(<MenuItemAdd />);
          }}
        >
          Add Menu Item
        </button>
        <button className="bg-red-500 px-4 py-2" onClick={deleteSectionedMenu}>
          Delete
        </button>
      </div>

      {items && (
        <div className="flex flex-row flex-wrap gap-4 justify-center">
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
                <div className="flex flex-row justify-between items-center px-4">
                  <p>{item.name}</p>

                  <div className="flex gap-4 border">
                    <button
                      className="bg-blue-500 p-2"
                      onClick={() => {
                        setSlideDownContent(<MenuItemEdit item={item} />);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 p-2"
                      onClick={() => deleteMenuItem(item._id)}
                    >
                      Delete
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
