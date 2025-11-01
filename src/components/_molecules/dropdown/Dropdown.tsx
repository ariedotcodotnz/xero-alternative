import React, { ReactNode } from "react";
import * as RadixDropdownMenu from "@radix-ui/react-dropdown-menu";
import Button from "@hui/_atoms/button/Button";

export type DropdownProps = {
  ariaLabel?: string;
  buttonText?: string;
  children?: ReactNode;
};

const Dropdown = ({
  ariaLabel,
  buttonText = "Select...",
  children,
}: DropdownProps) => {
  return (
    <RadixDropdownMenu.Root>
      <RadixDropdownMenu.Trigger asChild>
        <Button
          aria-label={ariaLabel}
          iconType="ChevronDownIcon"
          iconEnd
          variant="admin"
          classes="[data-state='open']:[&>svg]:tw-rotate-180"
        >
          {buttonText}
        </Button>
      </RadixDropdownMenu.Trigger>
      <RadixDropdownMenu.Portal>
        <RadixDropdownMenu.Content
          className={[
            "tw-z-50 tw-rounded-md tw-border tw-border-solid tw-border-gray-100 tw-bg-white tw-px-3 tw-py-1.5 tw-text-gray-700",
            "tw-text-base tw-shadow-lg tw-ring-1 tw-ring-gray-300 tw-ring-opacity-5 sm:tw-text-sm",
            "tw-max-w-[--radix-dropdown-menu-content-available-width] md:tw-max-w-[50vw] lg:tw-max-w-96",
            "tw-max-h-[--radix-dropdown-menu-content-available-height] tw-overflow-y-scroll [&_label]:!tw-cursor-pointer",
          ].join(" ")}
          side="bottom"
          sideOffset={5}
          align="center"
        >
          {children}
          <RadixDropdownMenu.Arrow className="tw-fill-white" />
        </RadixDropdownMenu.Content>
      </RadixDropdownMenu.Portal>
    </RadixDropdownMenu.Root>
  );
};

export default Dropdown;
