import React, { useState, useRef, useEffect } from "react";
import {
  FloatingArrow,
  arrow,
  offset,
  shift,
  useDismiss,
  useFloating,
  useInteractions,
  useTransitionStyles,
} from "@floating-ui/react";
import Icon, { IconType }  from "../../_atoms/icon/Icon";
import { navItemType } from "./types";

interface iNavigationMenuItem {
  icon: IconType;
  name: string;
  customColor: "admin-nz" | "admin-au" | "admin-uk";
  onClick: () => void;
  close: () => void;
  selected?: navItemType;
}

const NavigationMenuItem = ({
  icon,
  name,
  customColor,
  onClick,
  close,
  selected,
}: iNavigationMenuItem) => {
  const [open, setOpen] = useState(false);
  const arrowRef = useRef(null);

  // https://floating-ui.com/docs/useFloating
  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: "right",
    middleware: [
      offset({ mainAxis: 24, alignmentAxis: 0 }),
      shift(),
      arrow({ element: arrowRef }),
    ],
  });

  // https://floating-ui.com/docs/useTransition
  const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
    duration: { open: 300, close: 150 },
    close: { opacity: 0, transitionTimingFunction: "linear" },
    open: { opacity: 1, transitionTimingFunction: "linear" },
  });

  // https://floating-ui.com/docs/useDismiss
  const dismiss = useDismiss(context);
  const { getReferenceProps } = useInteractions([dismiss]);

  useEffect(() => {
    let timeout;

    if (selected && selected.name === name && !isMounted) {
      // delay so the page redirect before the submenu unmounted
      timeout = setTimeout(() => close(), 200);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [selected, isMounted, name, close]);

  useEffect(() => {
    if (open && selected && selected.name !== name) {
      setOpen(false);
    }
  }, [open, selected, setOpen, name]);

  const handleClick = () => {
    onClick();
    setOpen(!open);

    if (open) {
      // close submenu if nav item clicked second time
      close();
    }
  }

  return (
    <>
      <button
        ref={refs.setReference}
        type="button"
        className="haui-sidebar-menu-item"
        onClick={handleClick}
        {...getReferenceProps()}
      >
        <Icon type={icon} classes="haui-sidebar-menu-item-icon" /> {name}
      </button>
      {isMounted && (
        <div
          ref={refs.setFloating}
          style={{ ...floatingStyles, ...transitionStyles }}
        >
          <FloatingArrow
            width={28}
            height={14}
            ref={arrowRef}
            context={context}
            // fill-admin-nz-default fill-admin-au-default fill-admin-uk-default
            // tw-fill-admin-nz-default tw-fill-admin-au-default tw-fill-admin-uk-default
            className={`fill-${customColor}-default tw-fill-${customColor}-default`}
          />
        </div>
      )}
    </>
  );
}

export default NavigationMenuItem;
