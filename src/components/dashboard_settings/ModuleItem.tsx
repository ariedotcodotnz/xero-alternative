import React, { useState, useEffect, forwardRef, HTMLAttributes } from "react";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { DraggableAttributes } from "@dnd-kit/core";
import classNames from "classnames";
import Icon from "../_atoms/icons/icon/Icon";
import ImageItem from "./ImageItem";

export type ModuleItemProps = HTMLAttributes<HTMLDivElement> & {
  dashedBorder?: boolean;
  id: string;
  isDragging?: boolean;
  moduleData: {
    [index: string]: {
      alt: string;
      title: string;
      description: string;
    };
  };
  withOpacity?: boolean;
  attributes?: DraggableAttributes;
  listeners?: SyntheticListenerMap;
};

type CombinedAttributesAndListeners = DraggableAttributes &
  SyntheticListenerMap;

const ModuleItem = forwardRef<HTMLDivElement, ModuleItemProps>(
  (
    {
      dashedBorder = false,
      id,
      isDragging,
      moduleData,
      style,
      withOpacity,
      attributes,
      listeners,
      ...rest
    },
    ref,
  ) => {
    const shared =
      "tw-min-h-10 sm:tw-min-h-80 xl:tw-min-h-72 tw-rounded-lg tw-flex";
    const border = "tw-rounded-lg tw-border-4";
    const wrapper =
      "tw-items-center tw-justify-center tw-bg-gray-100 tw-shadow-md tw-origin-[50%_50%]";
    const classes = classNames(wrapper, {
      [`${border}`]: border,
      "tw-border-dashed tw-border-gray-200": dashedBorder,
      "tw-border-solid tw-border-gray-100": !dashedBorder,
      [`${shared}`]: shared,
      "tw-opacity-50": withOpacity,
      "tw-opacity-100": !withOpacity,
      "tw-cursor-grabbing": isDragging,
      "tw-cursor-grab": !isDragging,
      "tw-scale-105": isDragging,
      "tw-scale-100": !isDragging,
    });

    const [mobileLayout, setMobileLayout] = useState(window.innerWidth < 640);
    const desktopListenersAndAttributes: CombinedAttributesAndListeners | null =
      !mobileLayout
        ? { ...(listeners as SyntheticListenerMap), ...attributes }
        : null;

    const handleWindowResize = () => {
      setMobileLayout(window.innerWidth < 640);
    };

    useEffect(() => {
      window.addEventListener("resize", handleWindowResize);
      return () => {
        window.removeEventListener("resize", handleWindowResize);
      };
    }, []);

    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <div
        ref={ref}
        className={classes}
        style={style}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...desktopListenersAndAttributes}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...rest}
      >
        <div
          className={`${shared} tw-m-[0.25rem] tw-w-full tw-flex-row tw-items-center tw-border tw-bg-white tw-px-2 tw-py-2 tw-text-center sm:tw-flex-col sm:tw-px-8 sm:tw-py-6`}
        >
          <ImageItem
            moduleName={id}
            className="tw-mr-2 tw-h-11 tw-rounded-md tw-bg-gray-100 xs:tw-mr-3 sm:tw-hidden"
            alt={moduleData[`${id}`].alt}
            mobile
          />
          <h2 className="hnry-heading hnry-heading--h1 tw-mb-0 !tw-text-sm sm:!tw-text-lg">
            {moduleData[`${id}`].title}
          </h2>
          <span
            className="tw-ml-auto sm:tw-hidden"
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...attributes}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...listeners}
          >
            <Icon type="DoubleEllipsisIcon" size="lg" />
          </span>
          <p className="tw-hidden tw-text-sm tw-text-gray-500 sm:tw-block sm:tw-py-5 xl:tw-py-3">
            {moduleData[`${id}`].description}
          </p>
          <ImageItem
            moduleName={id}
            className="tw-hidden tw-h-[8rem] sm:tw-block"
            alt={moduleData[`${id}`].alt}
          />
        </div>
      </div>
    );
  },
);

ModuleItem.displayName = "Item";

export default ModuleItem;
