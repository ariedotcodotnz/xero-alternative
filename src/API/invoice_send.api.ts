import {
  putJson,
  ApiResponseBody,
  ApiErrorResponse,
} from "./config/fetch.api";

interface iSendInvoice {
  invoiceId: number;
  untaxedDepositAccepted: boolean;
}

export interface InvoiceSendSuccessResponse extends ApiResponseBody {
  data: {
    status: string,
    message?: string,
    error?: string,
  },
};

export const sendInvoice = async ({ invoiceId, untaxedDepositAccepted}: iSendInvoice): Promise<InvoiceSendSuccessResponse | ApiErrorResponse> =>
  putJson(Routes.api_invoice_invoices_send_path({ invoice_id: invoiceId }), JSON.stringify({ untaxed_deposit_accepted: untaxedDepositAccepted }), false);

export default {};
