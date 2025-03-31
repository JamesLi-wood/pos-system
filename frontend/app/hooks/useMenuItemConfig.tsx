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

  return {
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
  };
}
