import React from "react";
import Badge, { BadgeVariant } from "../_atoms/badge/Badge";
import Tooltip, { Placement } from "../_atoms/tooltip/Tooltip";

export interface iInvoiceStatus {
  variant: BadgeVariant;
  statusText: string;
  tooltipText?: string;
  placement?: Placement;
}

const InvoiceStatus = ({
  variant,
  statusText,
  tooltipText = undefined,
  placement = "top",
}: iInvoiceStatus) => {
  if (tooltipText) {
    return (
      <Tooltip popoverMessage={tooltipText} placement={placement} size="lg">
        <Badge variant={variant} text={statusText} />
      </Tooltip>
    );
  }

  return (
    <Badge variant={variant} text={statusText} />
  );
};

export default InvoiceStatus;
