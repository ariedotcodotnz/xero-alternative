import React, { ReactNode, useState } from "react";
import * as RadixPopover from "@radix-ui/react-popover";
import Icon from "@hui/_atoms/icons/icon/Icon";

interface iPopover {
  ariaLabel?: string;
  buttonText?: string;
  children?: ReactNode;
  id: string;
}

const Popover = ({
  ariaLabel,
  buttonText = "Select...",
  children,
  id,
}: iPopover) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <RadixPopover.Root
      open={isOpen}
      onOpenChange={() => setIsOpen(!isOpen)}
    >
      <RadixPopover.Trigger
        className={[
          "tw-relative tw-min-h-10 tw-w-full tw-rounded-md tw-bg-white tw-py-1.5 tw-pl-3 tw-pr-10 tw-text-left tw-text-gray-500 tw-font-light",
          "tw-shadow-sm tw-ring-1 tw-ring-inset tw-ring-gray-300 disabled:tw-bg-gray-50 disabled:tw-ring-gray-200 disabled:tw-cursor-not-allowed",
          "focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-brand-200 sm:tw-text-sm sm:tw-leading-6",
          "data-[state='open']:tw-shadow-lg [&_svg]:data-[state=open]:tw-transform [&_svg]:data-[state=open]:tw-rotate-180",
        ].join(" ")}
        aria-label={ariaLabel}
      >
        <div className="tw-truncate">{buttonText}</div>
        <span className="tw-pointer-events-none tw-absolute tw-inset-y-0 tw-right-0 tw-flex tw-items-center tw-mr-1 tw-pr-2">
          <Icon
            type="ChevronDownIcon"
            classes="!tw-text-gray-500 tw-stroke-2"
            size="sm"
          />
        </span>
      </RadixPopover.Trigger>
      <RadixPopover.Portal container={document.getElementById(id)}>
        <RadixPopover.Content
          className={[
            "tw-px-3 tw-py-1.5 tw-text-gray-700 tw-z-50 tw-rounded-md tw-bg-white tw-border tw-border-solid tw-border-gray-100",
            "tw-text-base tw-shadow-lg tw-ring-1 tw-ring-gray-300 tw-ring-opacity-5 sm:tw-text-sm",
            "tw-max-w-[--radix-popover-content-available-width] md:tw-max-w-[50vw] lg:tw-max-w-96",
            "[&_label]:!tw-cursor-pointer tw-max-h-[--radix-popover-content-available-height] tw-overflow-y-auto",
          ].join(" ")}
          side="bottom"
          sideOffset={12}
          align="end"
        >
          {children}
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  );
};

export default Popover;
