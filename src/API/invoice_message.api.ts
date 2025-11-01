import {
  postJson,
  putJson,
  ApiResponseBody,
  ApiErrorResponse,
} from "./config/fetch.api";

export interface InvoiceMessage {
  invoiceMessage: {
    email_intro: string;
  };
}

export interface CreateOrUpdateInvoiceMessageSuccessResponse
  extends ApiResponseBody {
  data: {
    invoice_message: {
      email_intro: string;
    };
  };
}

export interface DestroyInvoiceMessageSuccessResponse extends ApiResponseBody {
  data: string;
}

export const createInvoiceMessage = async (
  invoiceId: number,
  invoiceMessage: InvoiceMessage,
): Promise<CreateOrUpdateInvoiceMessageSuccessResponse | ApiErrorResponse> => {
  const payload = JSON.stringify(invoiceMessage);
  return postJson(Routes.api_invoice_invoice_message_path(invoiceId), payload);
};

export const updateInvoiceMessage = async (
  invoiceId: number,
  invoiceMessage: InvoiceMessage,
): Promise<CreateOrUpdateInvoiceMessageSuccessResponse | ApiErrorResponse> => {
  const payload = JSON.stringify(invoiceMessage);
  return putJson(Routes.api_invoice_invoice_message_path(invoiceId), payload);
};
