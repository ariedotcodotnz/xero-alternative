import { patchJson } from "@api/config/fetch.api";

interface iBankTransaction {
  bankTransactionId: string;
}

export const updateBankTransaction = async ({
  bankTransactionId,
}: iBankTransaction) =>
  patchJson(
    Routes.api_admin_self_reconcile_bank_transaction_path(bankTransactionId),
    JSON.stringify({
      bank_transaction_id: bankTransactionId,
    }),
  );

export default updateBankTransaction;
