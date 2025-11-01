import { formatToLocalCurrency } from "../../utilities/currency/currency_format";
import { getUserJurisdictionCode } from "../../utilities/user_attributes";
import { get } from "../config/fetch.api";

export interface Invoice {
  id: string;
  invoiceNumber: string;
  status: string;
  total: string;
  outstanding: string;
}

export interface InvoicesByClient {
  [clientId: string]: Invoice[];
}

export const getInvoicesByClient = async () =>
  get(Routes.api_self_reconcile_invoices_path());

export const invoiceDisplayText = (invoice: Invoice) => {
  const jurisdictionCode = getUserJurisdictionCode();
  const formattedTotal = formatToLocalCurrency(
    parseFloat(invoice.total),
    jurisdictionCode,
    { decimals: true },
  );

  const formattedOutstanding = formatToLocalCurrency(
    parseFloat(invoice.outstanding),
    jurisdictionCode,
    { decimals: true },
  );

  if (invoice.status === "PART_PAID" && formattedOutstanding) {
    return `${invoice.invoiceNumber} - ${formattedOutstanding} remaining of ${formattedTotal}`;
  }

  return `${invoice.invoiceNumber} - ${formattedTotal}`;
};
