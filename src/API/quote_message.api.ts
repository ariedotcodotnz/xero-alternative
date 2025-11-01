import {
  postJson,
  putJson,
  ApiResponseBody,
  ApiErrorResponse,
} from "./config/fetch.api";

export interface QuoteMessage {
  quoteMessage: {
    email_intro: string;
  };
}

export interface CreateOrUpdateQuoteMessageSuccessResponse
  extends ApiResponseBody {
  data: {
    quote_message: {
      email_intro: string;
    };
  };
}

export const createQuoteMessage = async (
  quoteId: number,
  quoteMessage: QuoteMessage,
): Promise<CreateOrUpdateQuoteMessageSuccessResponse | ApiErrorResponse> => {
  const payload = JSON.stringify(quoteMessage);

  return postJson(Routes.api_quote_quote_message_path(quoteId), payload);
};

export const updateQuoteMessage = async (
  quoteId: number,
  quoteMessage: QuoteMessage,
): Promise<CreateOrUpdateQuoteMessageSuccessResponse | ApiErrorResponse> => {
  const payload = JSON.stringify(quoteMessage);

  return putJson(Routes.api_quote_quote_message_path(quoteId), payload);
};
