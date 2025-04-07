import { useContext } from "react";
import MenuItemAdd from "./menuItemAdd";
import MenuItemEdit from "./menuItemEdit";
import SlideDown from "@/app/components/slidedown";
import { menuContext } from "./menu";
import { MenuItemType } from "@/app/types";

const MenuItems = ({ items }: { items: MenuItemType[] | null }) => {
  const context = useContext(menuContext);
  if (!context) {
    throw new Error("tableContext must be used within a Provider");
  }
  const {
    sectionedMenu,
    slideDownContent,
    refetchData,
    setMenuItems,
    setSlideDownContent,
  } = context;

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
      setMenuItems(null);
      setSlideDownContent(null);
    }
  };

  return (
    <div className="overflow-y-scroll">
      {items && (
        <div className="flex flex-row flex-wrap justify-center">
          {items.map((item) => {
            return (
              <div key={item._id} className="flex flex-col border w-96">
                <div className="h-32 border">IMAGE</div>
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
          <button
            onClick={() => {
              setSlideDownContent(<MenuItemAdd />);
            }}
          >
            Add
          </button>
        </div>
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
