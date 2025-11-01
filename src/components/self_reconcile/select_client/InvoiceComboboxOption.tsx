import React from "react";
import Badge from "@hui/_atoms/badge/Badge";

interface InvoiceComboboxOptionProps {
  invoiceNumberWithTotal: string;
  badgeText?: string;
}

const InvoiceComboboxOption = ({
  invoiceNumberWithTotal,
  badgeText,
}: InvoiceComboboxOptionProps) => (
  <>
    <span className="tw-pr-2 tw-text-gray-900">{invoiceNumberWithTotal}</span>
    {badgeText && <Badge text={badgeText} variant="amber" />}
  </>
);

export default InvoiceComboboxOption;
