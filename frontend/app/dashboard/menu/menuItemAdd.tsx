import { useState, useMemo, useContext } from "react";
import useMenuItemConfig from "@/app/hooks/useMenuItemConfig";
import InputGroups from "@/app/components/inputGroups";
import { menuContext } from "./menu";
import { BiUpload } from "react-icons/bi";

const MenuItemAdd = () => {
  const context = useContext(menuContext);
  if (!context) {
    throw new Error("tableContext must be used within a Provider");
  }
  const { sectionedMenu, setSlideDownContent, refetchData, setMenuItems } =
    context;
  const fieldRefs = useMenuItemConfig();
  const [imageUrl, setImageUrl] = useState<string>();

  const addMenuItem = async () => {
    const formData = fieldRefs.getFormData();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/menu/add/menu-item/${sectionedMenu}`,
      {
        method: "POST",
        body: formData,
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setImageUrl(imageURL);
    }
  };

  return (
    <div className="bg-inherit">
      <div className="sticky top-0 bg-inherit z-10">
        <p className="text-xl py-5 pl-4">Create menu item</p>
        <hr />
      </div>
      <div className="h-[20rem] relative">
        <input
          ref={fieldRefs.fileRef}
          className="hidden"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        {imageUrl && (
          <img
            src={imageUrl}
            className="object-cover h-full w-full"
            alt="Edit Picture"
          />
        )}

        <button
          className="group flex absolute top-0 right-0 left-0 items-center justify-center bottom-0"
          onClick={() => fieldRefs.fileRef.current?.click()}
        >
          <BiUpload className="h-14 w-14 p-2 rounded-3xl bg-black opacity-50 group-hover:opacity-100" />
        </button>
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
