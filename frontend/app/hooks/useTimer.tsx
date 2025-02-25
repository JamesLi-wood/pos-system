"use client";
import { useEffect, useState } from "react";

export default function useTimer(dateCreated: number) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const dateNow = new Date().getTime();
    const differenceInSeconds = Math.floor((dateNow - dateCreated) / 1000);
    setTime(differenceInSeconds);

    const timeIncrement = setInterval(() => {
      setTime((prevState) => prevState + 1);
    }, 1000);

    return () => clearInterval(timeIncrement);
  }, [dateCreated]);

  const formatTime = () => {
    const hours = Math.floor(time / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((time % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  };

  return [formatTime];
}
