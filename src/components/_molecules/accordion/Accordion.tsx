import React, { ReactNode, useState } from "react";
import classNames from "classnames";
import * as RadixCollapsible from "@radix-ui/react-collapsible";
import Icon from "../../_atoms/icons/icon/Icon";
import "./styles.scss";

interface iAccordion {
  /** The content of the accordion */
  children: ReactNode;
  /** String of custom classes to add to the wrapper */
  className?: string;
  /** Open content by default, only applicable if no open is provided */
  defaultOpen?: boolean;
  /** Whether the element should be mounted even if it is in closed state. */
  forceMount?: boolean;
  /** Callback when the open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Whether the content is open */
  open?: boolean;
  /** Accordion header title */
  title: React.ReactNode;
}

const Accordion = ({
  children,
  className = undefined,
  defaultOpen = false,
  forceMount = true,
  onOpenChange,
  open,
  title,
}: iAccordion) => {
  const [localOpen, setLocalOpen] = useState(defaultOpen);
  return (
    <div
      className={classNames("hnry-accordion", { [`${className}`]: className })}
    >
      <RadixCollapsible.Root
        defaultOpen={defaultOpen}
        open={open || localOpen}
        onOpenChange={onOpenChange || setLocalOpen}
      >
        <RadixCollapsible.Trigger className="hnry-accordion__button">
          {title}
          <Icon classes="hnry-accordion__icon" type="ChevronDownIcon" />
        </RadixCollapsible.Trigger>
        <RadixCollapsible.Content className="hnry-accordion__panel">
          <div className="tw-p-5">{children}</div>
        </RadixCollapsible.Content>
        {forceMount && !(open || localOpen) && (
          <div className="tw-hidden">{children}</div>
        )}
      </RadixCollapsible.Root>
    </div>
  );
};

export default Accordion;
