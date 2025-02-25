"use client";
import {
  ReactNode,
  useState,
  useEffect,
  createContext,
  useContext,
} from "react";
import { io, Socket } from "socket.io-client";

const socketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_API_URL!);
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <socketContext.Provider value={socket}>{children}</socketContext.Provider>
  );
};

export const useSocket = () => {
  const socket = useContext(socketContext);
  if (!socket) throw new Error("useSocket must be within a SocketProvider");
  return socket;
};
