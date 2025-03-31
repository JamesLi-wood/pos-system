import { useRef, useEffect, useMemo } from "react";
import { MenuItemType } from "@/app/types";
import useMenuItemConfig from "@/app/hooks/useMenuItemConfig";
import InputGroups from "@/app/components/inputGroups";

const MenuItemEdit = ({ item }: { item: MenuItemType }) => {
  const mainEdit = useMenuItemConfig();
  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return; // Prevent running twice
    didRun.current = true;
    item.requiredOptions.forEach((data, idx) => {
      mainEdit.addRequiredGroup(data.title);
      data.choices.forEach((choice) =>
        mainEdit.addRequiredItem(idx, choice.name, choice.price)
      );
    });
    item.additionalOptions.forEach((option) =>
      mainEdit.addAdditionalItem(option.name, option.price)
    );
  }, []);

  const applyChanges = () => {
    console.log(mainEdit);
  };

  const loadRequiredOptions = useMemo(() => {
    return (
      <div className="p-4 border border-x-0 border-t-0 border-white">
        <div className="flex justify-center items-center gap-4">
          <p className="text-2xl">Required Options</p>
          <button
            className="border border-gray-500 py-1 px-3"
            onClick={() => mainEdit.addRequiredGroup("")}
          >
            +
          </button>
        </div>

        {mainEdit.requiredOptions.map((data, idx) => {
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
                  mainEdit.removeRequiredItem(idx, itemId)
                }
              />
              <div className="flex justify-center gap-4 mt-2">
                <button
                  className="bg-green-500 p-2"
                  onClick={() => mainEdit.addRequiredItem(idx, "", -1)}
                >
                  Add Item
                </button>
                <button
                  className="bg-red-500 p-2"
                  onClick={() => mainEdit.removeRequiredGroup(data.id)}
                >
                  Remove Group
                </button>
              </div>
              {idx !== mainEdit.requiredOptions.length - 1 && (
                <hr className="my-3" />
              )}
            </div>
          );
        })}
      </div>
    );
  }, [mainEdit.requiredOptions]);

  const loadAdditionalChoices = useMemo(() => {
    return (
      <div className="p-4">
        <div className="flex justify-center items-center gap-4">
          <p className="text-2xl">Additional Choices</p>
          <button
            className="border border-gray-500 py-1 px-3"
            onClick={() => mainEdit.addAdditionalItem("", -1)}
          >
            +
          </button>
        </div>
        <InputGroups
          data={mainEdit.additionalChoices}
          removeItem={(id) => mainEdit.removeAdditionalItem(id)}
        />
      </div>
    );
  }, [mainEdit.additionalChoices]);

  return (
    <div className="bg-inherit">
      <div className="sticky top-0 bg-inherit">
        <p className="text-xl py-5 pl-4">{`Update ${item.name}`}</p>
        <hr />
      </div>
      <div className="flex flex-col items-center p-4 border border-x-0 border-t-0 border-white">
        <div className="text-2xl">Name</div>
        <input
          ref={mainEdit.nameRef}
          type="text"
          className="text-base my-2 bg-transparent border border-gray-500 p-2 resize-none text-white w-full outline-none"
          defaultValue={item.name}
        />
      </div>
      <div className="flex flex-col items-center p-4 border border-x-0 border-t-0 border-white">
        <div className="text-2xl">Description</div>
        <input
          ref={mainEdit.descriptionRef}
          type="text"
          className="text-base my-2 bg-transparent border border-gray-500 p-2 resize-none text-white w-full outline-none"
          defaultValue={item.description}
        />
      </div>
      <div className="flex flex-col items-center p-4 border border-x-0 border-t-0 border-white">
        <div className="text-2xl">Price</div>
        <input
          ref={mainEdit.priceRef}
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
