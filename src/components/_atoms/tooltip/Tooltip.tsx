import React, { useState, useRef, ReactNode } from "react";
import DOMPurify from "dompurify";
import {
  arrow,
  offset,
  shift,
  useClick,
  useHover,
  useFocus,
  useDismiss,
  useFloating,
  useInteractions,
  FloatingArrow,
  FloatingFocusManager,
  useTransitionStyles,
  safePolygon,
} from "@floating-ui/react";
import classNames from "classnames";
import { QuestionMarkCircleIcon } from "@heroicons/react/20/solid";
import { sizeClasses, IconSizes } from "../icons/icon/Icon";
import "./styles.scss";

export type Placement = "top" | "bottom" | "left" | "right";
export interface iTooltip {
  /*
   * The position of the popover
   */
  placement?: Placement;
  /*
   * The content of the popover
   */
  popoverMessage: string;
  /*
   * https://github.com/atomiks/tippyjs-react#component-children
   */
  children?: ReactNode;
  /*
   * Invoked when the tooltip begins to transition in
   */
  onShow?: () => void;
  /*
   * The size of the tooltip icon
   */
  size?: IconSizes;
  /*
   * The learn more link that append after the popover message
   */
  learnMore?: string;
  /*
   * The classes used when wanting to use a non-default style for the tooltip button
   */
  buttonClasses?: string;
}

const sanitizedData = (data) => ({
  // eslint-disable-next-line xss/no-mixed-html
  __html: DOMPurify.sanitize(data, { USE_PROFILES: { html: true } }),
});

const content = (text: string, learnMore?: string) => (
  <>
    <span dangerouslySetInnerHTML={sanitizedData(text)} />
    {learnMore && (
      <a
        className="hui-tooltip__popper-link"
        href={learnMore}
        target="_blank"
        rel="noreferrer"
      >
        Learn more
      </a>
    )}
  </>
);

const Tooltip = ({
  popoverMessage,
  placement = "top",
  children = null,
  onShow = undefined,
  size = "base",
  learnMore = "",
  buttonClasses = "",
}: iTooltip) => {
  const [open, setOpen] = useState(false);
  const arrowRef = useRef(null);

  // https://floating-ui.com/docs/useFloating
  const { refs, floatingStyles, context } = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    middleware: [
      offset({ mainAxis: 8, alignmentAxis: 0 }),
      shift(),
      arrow({ element: arrowRef }),
    ],
  });

  // https://floating-ui.com/docs/useTransition
  const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
    duration: { open: 300, close: 300 },
    close: { opacity: 0, transitionTimingFunction: "linear" },
    open: { opacity: 1, transitionTimingFunction: "linear" },
  });

  const click = useClick(context, {
    ignoreMouse: true,
  });
  const hover = useHover(context, { move: false, handleClose: safePolygon() });
  const focus = useFocus(context);

  // https://floating-ui.com/docs/useDismiss
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    hover,
    focus,
    dismiss,
  ]);

  const onClickHandler = () => {
    setOpen(!open);
    if (onShow) {
      onShow();
    }
  };

  return (
    <>
      <button
        ref={refs.setReference}
        type="button"
        className={`hui-tooltip ${buttonClasses}`}
        onClick={onClickHandler}
        {...getReferenceProps()}
      >
        {children || (
          <>
            <QuestionMarkCircleIcon
              className={classNames(
                "hover:tw-cursor-pointer hover:tw-text-gray-900",
                { [`${sizeClasses[size]}`]: size }
              )}
              aria-hidden="true"
            />
            <span className="tw-sr-only">Launch tooltip</span>
          </>
        )}
      </button>
      <FloatingFocusManager
        context={context}
        modal={false}
        {...getFloatingProps()}
      >
        {isMounted && (
          <div
            ref={refs.setFloating}
            style={{ ...floatingStyles, ...transitionStyles }}
            className="hui-tooltip-wrapper"
          >
            {content(popoverMessage, learnMore)}
            <FloatingArrow
              width={16}
              height={8}
              ref={arrowRef}
              context={context}
              className="tw-fill-brand"
            />
          </div>
        )}
      </FloatingFocusManager>
    </>
  );
};

export default Tooltip;
