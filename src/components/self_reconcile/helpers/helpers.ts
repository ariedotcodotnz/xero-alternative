import { Transaction } from "../../../API/self_reconcile/bank_transactions.api";
import { CreateClientFormType } from "../types/selfReconcileTypes";

export const mapToBackendTypes = (form: CreateClientFormType) => ({
  organisationName: form.clientName,
  billingEmail: form.clientEmail,
  gstType: form.clientDeductsSalesTax,
  hasPriorDeductionPercentage: form.hasPriorDeduction,
  priorDeductionPercentage: form.taxRatePercentage,
  currencyCode: form.currencyCode,
});

const transactionType = (modalType: string) => {
  if (modalType === "account_top_up") {
    return "Account top up";
  }
  if (modalType === "select_client") {
    return "Payment on behalf of a client";
  }
  if (modalType === "more_information") {
    return "Something else";
  }
  return null;
};

export const trackOnClickEvent = (
  eventName: string,
  transaction: Transaction,
  modalType?: string,
) => {
  if (window.analytics) {
    window.analytics.track(eventName, {
      user_id: window.Hnry?.User.id,
      amount: transaction.amount,
      inbound_payment_id: transaction.id,
      ...(modalType !== undefined && { type: transactionType(modalType) }),
      jurisdiction: window.Hnry?.User.jurisdiction,
    });
  }
};
