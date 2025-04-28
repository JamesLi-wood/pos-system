import { useState } from "react";

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const [button, setButton] = useState(false);

  return (
    <div
      className={`${
        button ? "-translate-x-full" : "translate-x-0"
      } transition-transform lg:translate-x-0 max-lg:absolute h-full flex flex-col bg-blue-950 z-10`}
    >
      {children}
      <button
        className="lg:hidden absolute top-1/2 -right-6 -translate-y-1/2 rounded-3xl bg-blue-500 p-6"
        onClick={() => setButton((prevState) => !prevState)}
      ></button>
    </div>
  );
};

export default Sidebar;
