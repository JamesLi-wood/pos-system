"use client";
import { ReactNode, createContext, useContext } from "react";
import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_API_URL!);
const socketContext = createContext(socket);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  return (
    <socketContext.Provider value={socket}>{children}</socketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(socketContext);
};
