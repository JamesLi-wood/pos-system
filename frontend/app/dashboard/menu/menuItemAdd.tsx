import useMenuItemConfig from "@/app/hooks/useMenuItemConfig";
import React, { useMemo, Dispatch, SetStateAction } from "react";
import InputGroups from "@/app/components/inputGroups";

const MenuItemAdd = ({
  sectionedMenu,
  setSlideDownContent,
}: {
  sectionedMenu: string;
  setSlideDownContent: Dispatch<SetStateAction<React.ReactNode | null>>;
}) => {
  const fieldRefs = useMenuItemConfig();

  const addMenuItem = async () => {
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
      `${process.env.NEXT_PUBLIC_API_URL}/menu/add/menu-item/${sectionedMenu}`,
      {
        method: "POST",
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

    if (response.ok) setSlideDownContent(null);
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

        <div className="flex flex-col gap-3">
          {fieldRefs.requiredOptions.map((data, idx) => {
            return (
              <div key={data.id}>
                <div className="flex gap-4 flex-row items-center justify-center">
                  <p className="text-xl">Title</p>
                  <input
                    ref={data.title}
                    type="text"
                    className="text-base my-2 bg-transparent border border-gray-500 p-2 outline-none"
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
                    onClick={() => {
                      fieldRefs.addRequiredItem(idx, "", -1);
                    }}
                  >
                    Add Item
                  </button>
                  <button
                    className="bg-red-500 p-2"
                    onClick={() => {
                      fieldRefs.removeRequiredGroup(data.id);
                    }}
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
        <p className="text-xl py-5 pl-4">Create menu item</p>
        <hr />
      </div>
      <div className="flex flex-col items-center p-4 border border-x-0 border-t-0 border-white">
        <div className="text-2xl">Name</div>
        <input
          ref={fieldRefs.nameRef}
          type="text"
          className="text-base my-2 bg-transparent border border-gray-500 p-2 resize-none text-white w-full outline-none"
        />
      </div>
      <div className="flex flex-col items-center p-4 border border-x-0 border-t-0 border-white">
        <div className="text-2xl">Description</div>
        <input
          ref={fieldRefs.descriptionRef}
          type="text"
          className="text-base my-2 bg-transparent border border-gray-500 p-2 resize-none text-white w-full outline-none"
        />
      </div>
      <div className="flex flex-col items-center p-4 border border-x-0 border-t-0 border-white">
        <div className="text-2xl">Price</div>
        <input
          ref={fieldRefs.priceRef}
          type="number"
          className="text-base my-2 bg-transparent border border-gray-500 p-2 resize-none text-white w-full outline-none"
          inputMode="numeric"
        />
      </div>
      {loadRequiredOptions}
      {loadAdditionalChoices}
      <button
        className="sticky w-full text-center py-3 bottom-0 bg-green-500"
        onClick={addMenuItem}
      >
        {`Add to ${sectionedMenu}`}
      </button>
    </div>
  );
};

export default MenuItemAdd;
