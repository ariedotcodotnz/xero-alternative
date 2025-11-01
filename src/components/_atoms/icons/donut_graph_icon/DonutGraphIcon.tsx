import React from "react";
import Tooltip, { Placement } from "../../tooltip/Tooltip";

const DonutGraphIcon = ({
  popoverMessage,
  amountFilledDecimal,
  placement = "top",
}: iDonutGraphIcon) => {
  const radius = 10;
  const sda1 = 2 * Math.PI * radius * amountFilledDecimal;
  const sda2 = 2 * Math.PI * radius;

  return (
    <Tooltip placement={placement} popoverMessage={popoverMessage} size="lg">
      <svg
        className="tw-block -tw-rotate-90 tw-origin-center"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          strokeWidth="4"
          className="tw-stroke-brand-green-100"
        />
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          strokeWidth="4"
          className="tw-stroke-brand-green"
          strokeDasharray={`${sda1} ${sda2}`}
        />
      </svg>
    </Tooltip>
  );
};

interface iDonutGraphIcon {
  /**
   * The position of the popover
   */
  placement?: Placement;
  /**
   * The content of the popover
   */
  popoverMessage: string;
  /**
   * The value need to between 0 and 1, 1 means fully filled
   */
  amountFilledDecimal: number;
}

export default DonutGraphIcon;
