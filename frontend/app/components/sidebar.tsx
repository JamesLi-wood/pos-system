import { useState } from "react";

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const [slide, setSlide] = useState(false);

  return (
    <div
      className={`${
        slide ? "translate-x-0" : "-translate-x-full"
      } transition-transform lg:translate-x-0 max-lg:absolute h-full flex flex-col bg-blue-950 z-10`}
    >
      <div className="overflow-y-scroll scroll-hidden z-10">{children}</div>

      <button
        className="-translate-y-1/2 lg:hidden absolute top-1/2 -right-6 rounded-3xl bg-blue-950 p-6"
        onClick={() => setSlide((prevState) => !prevState)}
      ></button>
    </div>
  );
};

export default Sidebar;
