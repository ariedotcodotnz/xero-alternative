import { get, patchJson } from "../config/fetch.api";

interface TransactionData {
  id: string;
  payorName: string;
  payorAccountNumber: string;
  amount: string;
  transactionDate: string;
  reference?: string;
  code?: string;
  particulars?: string;
}

export interface Transaction extends TransactionData {
  hasBeenReviewed: boolean;
}

const getBankTransactions = async (query: string) =>
  get(Routes.api_self_reconcile_bank_transactions_path({ query }));

interface CreateUserPaymentNoteOptions {
  bankTransactionId: string;
  clientId?: string;
  paymentDescription?: string;
  invoiceId?: string;
  paymentOnBehalfOfClient?: boolean;
}

interface CreateUserPaymentNoteResponse {
  success: boolean;
}

export const createUserPaymentNote = async ({
  bankTransactionId,
  clientId,
  paymentDescription,
  invoiceId,
  paymentOnBehalfOfClient = false,
}: CreateUserPaymentNoteOptions) =>
  patchJson(
    Routes.api_self_reconcile_bank_transaction_path(bankTransactionId),
    JSON.stringify({
      bank_transaction_id: bankTransactionId,
      client_id: clientId,
      payment_description: paymentDescription,
      invoice_id: invoiceId,
      payment_on_behalf_of_client: paymentOnBehalfOfClient,
    }),
  ).then((response) => response as CreateUserPaymentNoteResponse);

export default getBankTransactions;
