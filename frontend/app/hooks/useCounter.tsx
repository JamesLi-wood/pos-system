import { useCallback, useState } from "react";

export default function useCounter() {
  const [counter, setCounter] = useState(1);

  const increment = useCallback(() => {
    setCounter((prevState) => prevState + 1);
  }, []);

  const decrement = useCallback(() => {
    setCounter((prevState) => (prevState > 1 ? prevState - 1 : prevState));
  }, []);

  return { counter, increment, decrement };
}
