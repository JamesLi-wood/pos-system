import React, { useRef, useState } from "react";

interface GroupType {
  id: number;
  name: React.RefObject<HTMLInputElement | null>;
  price: React.RefObject<HTMLInputElement | null>;
}

interface OptionRefType {
  id: number;
  title: React.RefObject<HTMLInputElement | null> | null;
  choices: GroupType[];
}

export default function useMenuItemConfig() {
  const idCounter = useRef(1);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLInputElement | null>(null);
  const priceRef = useRef<HTMLInputElement | null>(null);
  const [requiredOptions, setRequiredOptions] = useState<OptionRefType[]>([]);
  const [additionalChoices, setAdditionalChoices] = useState<GroupType[]>([]);

  const addRequiredGroup = () => {
    const newId = idCounter.current++;
    setRequiredOptions((prevState) => [
      ...prevState,
      {
        id: newId,
        title: React.createRef<HTMLInputElement>(),
        choices: [],
      },
    ]);
  };

  const removeRequiredGroup = (id: number) => {
    setRequiredOptions((prevState) =>
      prevState.filter((data) => data.id !== id)
    );
  };

  const addRequiredItem = (idx: number) => {
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
            price: React.createRef<HTMLInputElement>(),
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

  const addAdditionalItem = () => {
    const newId = idCounter.current++;

    setAdditionalChoices((prevState) => [
      ...prevState,
      {
        id: newId,
        name: React.createRef<HTMLInputElement>(),
        price: React.createRef<HTMLInputElement>(),
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
