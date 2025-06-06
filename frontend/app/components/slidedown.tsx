"use client";
import { VscChromeClose } from "react-icons/vsc";

const SlideDown = ({
  children,
  handleRemove: removeSlidedownContent,
}: {
  children: React.ReactNode;
  handleRemove: () => void;
}) => {
  return (
    <div className="z-[999] absolute top-0 right-0 left-0 bottom-0">
      <div
        id="slidedown-component"
        className="text-white scroll-hidden pointer-events-auto absolute top-1/2 left-1/2 h-4/5 w-2/5 -translate-x-1/2 -translate-y-1/2 overflow-y-scroll rounded-2xl bg-neutral-950 max-md:w-full max-md:h-[99.9%]"
      >
        <div className="sticky top-0 flex justify-end z-20">
          <button
            className="flex h-10 w-10 -translate-x-3 translate-y-3 items-center justify-center rounded-3xl bg-red-500"
            onClick={removeSlidedownContent}
          >
            <VscChromeClose className="h-5 w-5" />
          </button>
        </div>

        <div className="bg-inherit -mt-10 h-full">{children}</div>
      </div>
    </div>
  );
};

export default SlideDown;
