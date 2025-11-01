import { get } from "./config/fetch.api";

export interface InvoiceAllocationPreferenceData {
  id: number;
  enabled: boolean;
  locked: boolean;
  paused: boolean;
  payeeName: string;
  percentage: number;
}

export const getAllActiveAllocationPreferences = async (
  clientId: number,
  invoiceId?: number
): Promise<InvoiceAllocationPreferenceData[] | null> => {
  if (typeof clientId === "number") {
    let url = `${Routes.get_active_allocation_preferences_api_allocation_preferences_invoices_path()}?client_id=${clientId}`;

    if (invoiceId !== undefined && invoiceId !== null) {
      url += `&invoice_id=${invoiceId}`;
    }

    const allocationPreferenceList = await get(url);

    if (allocationPreferenceList && allocationPreferenceList.length) {
      return allocationPreferenceList as InvoiceAllocationPreferenceData[];
    }

    return null;
  }

  toastr.error("Can't fetch allocations without a client.");
  return null;
};
