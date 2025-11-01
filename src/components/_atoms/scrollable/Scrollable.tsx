import React, { useEffect, useRef } from "react";
import debounce from "../../../utilities/debounce";

interface iScrollableProps {
  children: React.ReactNode | string;
  onContentSeen: () => void;
}

const SCROLLABLE_THRESHOLD = 25;

const Scrollable = ({ children, onContentSeen }: iScrollableProps) => {
  const scrollableElementRef = useRef<HTMLDivElement>(null);

  const handleScroll = debounce(() => {
    const scrollable = scrollableElementRef.current;

    if (scrollable) {
      if (
        Math.abs(
          scrollable.scrollHeight
            - scrollable.scrollTop
            - scrollable.clientHeight,
        ) < SCROLLABLE_THRESHOLD
      ) {
        onContentSeen();
      }
    }
  }, 100);

  useEffect(() => {
    const element = scrollableElementRef.current;

    handleScroll();

    element.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      element.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      ref={scrollableElementRef}
      className="tw-overflow-y-auto tw-max-h-40 sm:tw-max-h-96 tw-shadow-inner tw-bg-gray-50 tw-p-4 tw-rounded hui-scrollable"
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
    >
      {children}
    </div>
  );
};

Scrollable.displayName = "Scrollable";

export default Scrollable;
