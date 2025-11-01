import { postJson } from "../config/fetch.api";

interface CreateTransactionReconciliationOptions {
  userReviewType: string;
  bankTransactionId: string;
}

// eslint-disable-next-line import/prefer-default-export
export const createTransactionReconciliation = async ({
  userReviewType,
  bankTransactionId,
}: CreateTransactionReconciliationOptions) =>
  postJson(
    Routes.api_self_reconcile_transaction_reconciliations_path(),
    JSON.stringify({
      user_review_type: userReviewType,
      bank_transaction_id: bankTransactionId,
    }),
    false,
  );

interface ReconcileToClientOptions {
  bankTransactionId: string;
  clientId: string;
}

interface ReconcileToInvoiceOptions extends ReconcileToClientOptions {
  invoiceId: string;
}

const postReconciliation = (body: object) =>
  postJson(
    Routes.api_self_reconcile_transaction_reconciliations_path(),
    JSON.stringify(body),
    false,
  );

export const reconcileToInvoice = async ({
  bankTransactionId,
  clientId,
  invoiceId,
}: ReconcileToInvoiceOptions) =>
  postReconciliation({
    bank_transaction_id: bankTransactionId,
    client_id: clientId,
    invoice_id: invoiceId,
    user_review_type: "reconcile_to_invoice",
  });

export const reconcileToClient = async ({
  bankTransactionId,
  clientId,
}: ReconcileToClientOptions) =>
  postReconciliation({
    bank_transaction_id: bankTransactionId,
    client_id: clientId,
    user_review_type: "reconcile_to_client",
  });
