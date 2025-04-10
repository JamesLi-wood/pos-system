import React, { useRef, useState } from "react";

interface GroupType {
  id: number;
  name: React.RefObject<HTMLInputElement | null>;
  defaultName: string;
  price: React.RefObject<HTMLInputElement | null>;
  defaultPrice: number;
}

interface OptionRefType {
  id: number;
  title: React.RefObject<HTMLInputElement | null> | null;
  defaultTitle: string;
  choices: GroupType[];
}

export default function useMenuItemConfig() {
  const idCounter = useRef(1);
  const fileRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLInputElement | null>(null);
  const priceRef = useRef<HTMLInputElement | null>(null);
  const [requiredOptions, setRequiredOptions] = useState<OptionRefType[]>([]);
  const [additionalChoices, setAdditionalChoices] = useState<GroupType[]>([]);

  const addRequiredGroup = (defaultTitle: string) => {
    const newId = idCounter.current++;
    setRequiredOptions((prevState) => [
      ...prevState,
      {
        id: newId,
        title: React.createRef<HTMLInputElement>(),
        defaultTitle: defaultTitle,
        choices: [],
      },
    ]);
  };

  const removeRequiredGroup = (id: number) => {
    setRequiredOptions((prevState) =>
      prevState.filter((data) => data.id !== id)
    );
  };

  const addRequiredItem = (
    idx: number,
    defaultName: string,
    defaultPrice: number
  ) => {
    const newId = idCounter.current++;
    setRequiredOptions((prevState) => {
      const newState = [...prevState];

      newState[idx] = {
        ...newState[idx],
        choices: [
          ...newState[idx].choices,
          {
            id: newId,
            name: React.createRef<HTMLInputElement>(),
            defaultName: defaultName,
            price: React.createRef<HTMLInputElement>(),
            defaultPrice: defaultPrice,
          },
        ],
      };

      return newState;
    });
  };

  const removeRequiredItem = (groupIdx: number, itemId: number) => {
    setRequiredOptions((prevState) => {
      const newState = [...prevState];

      newState[groupIdx] = {
        ...newState[groupIdx],
        choices: newState[groupIdx].choices.filter(
          (data) => data.id !== itemId
        ),
      };

      return newState;
    });
  };

  const addAdditionalItem = (defaultName: string, defaultPrice: number) => {
    const newId = idCounter.current++;

    setAdditionalChoices((prevState) => [
      ...prevState,
      {
        id: newId,
        name: React.createRef<HTMLInputElement>(),
        defaultName: defaultName,
        price: React.createRef<HTMLInputElement>(),
        defaultPrice: defaultPrice,
      },
    ]);
  };

  const removeAdditionalItem = (id: number) => {
    setAdditionalChoices((prevState) =>
      prevState.filter((data) => data.id !== id)
    );
  };

  const getFormData = () => {
    const formData = new FormData();

    const imageField = fileRef.current?.files?.[0];
    const nameField = nameRef.current?.value;
    const descriptionField = descriptionRef.current?.value;
    const priceField = priceRef.current?.value;
    const requiredField = requiredOptions.map((option) => {
      const title = option.title?.current?.value;
      const choices = option.choices.map((choice) => {
        return {
          name: choice.name.current?.value,
          price: Number(choice.price.current?.value),
        };
      });
      return { title: title, choices: choices };
    });
    const additionalField = additionalChoices.map((choice) => {
      return {
        name: choice.name.current?.value,
        price: Number(choice.price.current?.value),
      };
    });

    if (imageField) formData.append("image", imageField);
    if (nameField) formData.append("name", nameField);
    if (descriptionField) formData.append("description", descriptionField);
    if (priceField) formData.append("price", priceField);
    if (requiredField)
      formData.append("requiredOptions", JSON.stringify(requiredField));
    if (additionalField)
      formData.append("additionalOptions", JSON.stringify(additionalField));

    return formData;
  };

  return {
    fileRef,
    nameRef,
    descriptionRef,
    priceRef,
    requiredOptions,
    additionalChoices,
    addRequiredGroup,
    removeRequiredGroup,
    addRequiredItem,
    removeRequiredItem,
    addAdditionalItem,
    removeAdditionalItem,
    getFormData,
  };
}
