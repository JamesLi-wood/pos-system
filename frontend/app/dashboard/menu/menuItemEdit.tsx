import { useRef, useEffect, useContext, useMemo } from "react";
import useMenuItemConfig from "@/app/hooks/useMenuItemConfig";
import InputGroups from "@/app/components/inputGroups";
import { menuContext } from "./menu";
import { MenuItemType } from "@/app/types";

const MenuItemEdit = ({ item }: { item: MenuItemType }) => {
  const context = useContext(menuContext);
  if (!context) {
    throw new Error("tableContext must be used within a Provider");
  }
  const { sectionedMenu, setMenuItems, refetchData, setSlideDownContent } =
    context;
  const fieldRefs = useMenuItemConfig();
  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return; // Prevent running twice
    didRun.current = true;
    item.requiredOptions.forEach((data, idx) => {
      fieldRefs.addRequiredGroup(data.title);
      data.choices.forEach((choice) =>
        fieldRefs.addRequiredItem(idx, choice.name, choice.price)
      );
    });
    item.additionalOptions.forEach((option) =>
      fieldRefs.addAdditionalItem(option.name, option.price)
    );
  }, []);

  const applyChanges = async () => {
    const nameField = fieldRefs.nameRef.current?.value;
    const descriptionField = fieldRefs.descriptionRef.current?.value;
    const priceField = Number(fieldRefs.priceRef.current?.value);
    const requiredField = fieldRefs.requiredOptions.map((option) => {
      const title = option.title?.current?.value;
      const choices = option.choices.map((choice) => {
        return {
          name: choice.name.current?.value,
          price: Number(choice.price.current?.value),
        };
      });
      return { title: title, choices: choices };
    });
    const additionalField = fieldRefs.additionalChoices.map((choice) => {
      return {
        name: choice.name.current?.value,
        price: Number(choice.price.current?.value),
      };
    });

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/menu/update/${sectionedMenu}/${item._id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: nameField,
          description: descriptionField,
          price: priceField,
          requiredOptions: requiredField,
          additionalOptions: additionalField,
        }),
      }
    );

    if (response.ok) {
      await refetchData();
      setMenuItems(null);
      setSlideDownContent(null);
    }
  };

  const loadRequiredOptions = useMemo(() => {
    return (
      <div className="p-4 border border-x-0 border-t-0 border-white">
        <div className="flex justify-center items-center gap-4">
          <p className="text-2xl">Required Options</p>
          <button
            className="border border-gray-500 py-1 px-3"
            onClick={() => fieldRefs.addRequiredGroup("")}
          >
            +
          </button>
        </div>

        {fieldRefs.requiredOptions.map((data, idx) => {
          return (
            <div key={data.id}>
              <div className="flex gap-4 flex-row items-center justify-center">
                <p className="text-xl">Title</p>
                <input
                  ref={data.title}
                  type="text"
                  className="text-base my-2 bg-transparent border border-gray-500 p-2 outline-none"
                  defaultValue={data.defaultTitle}
                />
              </div>
              <InputGroups
                data={data.choices}
                removeItem={(itemId) =>
                  fieldRefs.removeRequiredItem(idx, itemId)
                }
              />
              <div className="flex justify-center gap-4 mt-2">
                <button
                  className="bg-green-500 p-2"
                  onClick={() => fieldRefs.addRequiredItem(idx, "", -1)}
                >
                  Add Item
                </button>
                <button
                  className="bg-red-500 p-2"
                  onClick={() => fieldRefs.removeRequiredGroup(data.id)}
                >
                  Remove Group
                </button>
              </div>
              {idx !== fieldRefs.requiredOptions.length - 1 && (
                <hr className="my-3" />
              )}
            </div>
          );
        })}
      </div>
    );
  }, [fieldRefs.requiredOptions]);

  const loadAdditionalChoices = useMemo(() => {
    return (
      <div className="p-4">
        <div className="flex justify-center items-center gap-4">
          <p className="text-2xl">Additional Choices</p>
          <button
            className="border border-gray-500 py-1 px-3"
            onClick={() => fieldRefs.addAdditionalItem("", -1)}
          >
            +
          </button>
        </div>
        <InputGroups
          data={fieldRefs.additionalChoices}
          removeItem={(id) => fieldRefs.removeAdditionalItem(id)}
        />
      </div>
    );
  }, [fieldRefs.additionalChoices]);

  return (
    <div className="bg-inherit">
      <div className="sticky top-0 bg-inherit">
        <p className="text-xl py-5 pl-4">{`Update ${item.name}`}</p>
        <hr />
      </div>
      <div className="flex flex-col items-center p-4 border border-x-0 border-t-0 border-white">
        <div className="text-2xl">Name</div>
        <input
          ref={fieldRefs.nameRef}
          type="text"
          className="text-base my-2 bg-transparent border border-gray-500 p-2 resize-none text-white w-full outline-none"
          defaultValue={item.name}
        />
      </div>
      <div className="flex flex-col items-center p-4 border border-x-0 border-t-0 border-white">
        <div className="text-2xl">Description</div>
        <input
          ref={fieldRefs.descriptionRef}
          type="text"
          className="text-base my-2 bg-transparent border border-gray-500 p-2 resize-none text-white w-full outline-none"
          defaultValue={item.description}
        />
      </div>
      <div className="flex flex-col items-center p-4 border border-x-0 border-t-0 border-white">
        <div className="text-2xl">Price</div>
        <input
          ref={fieldRefs.priceRef}
          type="number"
          className="text-base my-2 bg-transparent border border-gray-500 p-2 resize-none text-white w-full outline-none"
          inputMode="numeric"
          defaultValue={item.price}
        />
      </div>
      {loadRequiredOptions}
      {loadAdditionalChoices}
      <button
        className="sticky w-full text-center py-3 bottom-0 bg-green-500"
        onClick={applyChanges}
      >
        Apply Changes
      </button>
    </div>
  );
};

export default MenuItemEdit;
