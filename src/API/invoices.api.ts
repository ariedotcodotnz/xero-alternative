import { InvoiceAllocationPreferenceData } from "./allocation_preferences_invoices_api";
import { InvoiceForm } from "../types/invoiceForm.type";
import {
  postJson,
  putJson,
  ApiResponseBody,
  ApiErrorResponse,
} from "./config/fetch.api";

type LineItemsResponseType = {
  id: number,
  quantity: number,
  service_id: number,
  updated_name: string,
  service_price: number,
  order: number,
  sales_tax: number,
}

export interface InvoiceSuccessResponse extends ApiResponseBody {
  data: {
    status: string,
    message?: string,
    error?: string,
    invoice?: {
      id: number,
      client_id: number,
      period_start_date?: string,
      period_end_date?: string,
      comments?: string,
      currency_code?: string,
      due_date?: string,
      total?: string,
      status?: "SENT" | "SCHEDULED" | "DRAFT",
      current_max_order?: string,
      access_token?: string,
      has_gst?: string,
      invoice_number?: string,
      invoice_date?: string,
      deposit?: string,
      po_number?: string,
      hide_phone_number?: string,
      created_at: string,
      updated_at: string,
      send_at?: string,
      invoice_config_attributes?: {
        recurrence_day: number,
        recurrence_max_occurrences: number,
        recurrence_period: string,
      },
      line_items?: LineItemsResponseType[],
      all_allocation_preferences?: boolean,
      allocation_preference_ids?: InvoiceAllocationPreferenceData[]
    },
  },
};

export const createInvoice = async (invoice: InvoiceForm): Promise<InvoiceSuccessResponse | ApiErrorResponse> =>
  postJson(Routes.api_invoices_path(invoice.id), JSON.stringify(invoice), false);

export const updateInvoice = async (invoice: InvoiceForm): Promise<InvoiceSuccessResponse | ApiErrorResponse> =>
  putJson(Routes.api_invoice_path(invoice.id), JSON.stringify(invoice), false);

export default {};
