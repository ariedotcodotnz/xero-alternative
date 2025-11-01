import React, { Dispatch, SetStateAction } from "react";
import classNames from "classnames";
import Combobox from "@hui/_molecules/combobox/Combobox";
import { Invoice, invoiceDisplayText } from "@api/self_reconcile/invoices.api";
import { Transaction } from "@api/self_reconcile/bank_transactions.api";
import Switch from "@hui/_atoms/switch/Switch";
import SelfReconcileButtons from "../SelfReconcileButtons";
import I18n from "../../../utilities/translations";
import ClientFlowButtons from "../ClientFlowButtons";
import InvoiceComboboxOption from "./InvoiceComboboxOption";
import { trackOnClickEvent } from "../helpers/helpers";

export interface SelectClientInvoiceProps {
  invoices: Invoice[];
  invoiceIndex: number;
  setInvoiceIndex: Dispatch<SetStateAction<number>>;
  handleModalProgression: (step: string) => void;
  handleMultipleInvoicesOnClick: () => void;
  handleProcessWithoutInvoiceOnClick: () => void;
  partPayAcknowledged: boolean;
  setPartPayAcknowledged: Dispatch<SetStateAction<boolean>>;
  nextToOverpayment: string;
  next: string;
  previous: string;
  resetState: () => void;
  transaction: Transaction;
}

const SelectClientInvoice = ({
  invoices,
  invoiceIndex,
  setInvoiceIndex,
  handleModalProgression,
  handleMultipleInvoicesOnClick,
  handleProcessWithoutInvoiceOnClick,
  partPayAcknowledged,
  setPartPayAcknowledged,
  nextToOverpayment,
  next,
  previous,
  resetState,
  transaction,
}: SelectClientInvoiceProps) => {
  const invoiceEntries = invoices.map((invoice: Invoice) => {
    const invoiceText = invoiceDisplayText(invoice);
    return {
      key: invoiceText,
      value: invoiceText,
      customOption: (
        <InvoiceComboboxOption
          invoiceNumberWithTotal={invoiceText}
          badgeText={invoice.status === "PENDING" ? "Paid direct" : undefined}
        />
      ),
    };
  });

  const handleInvoiceSelectChange = (value) => {
    const index = invoiceEntries.findIndex((i) => i.value === value);
    setPartPayAcknowledged(false);
    setInvoiceIndex(index);
    if (index >= 0) {
      trackOnClickEvent(
        "user_reconciliation_selected_existing_invoice",
        transaction,
      );
    }
  };

  const invoice = invoices[invoiceIndex];
  const isInvoiceSelected = !!invoice;

  const initialPartPayment =
    isInvoiceSelected &&
    invoice.status !== "PART_PAID" &&
    Number(invoice.total) > Number(transaction.amount);
  const disabledSubmit =
    invoiceIndex === -1 || (initialPartPayment && !partPayAcknowledged);

  // Overpayment calculation logic
  const isOverpayment =
    isInvoiceSelected &&
    Number(transaction.amount) > Number(invoice.outstanding);

  return (
    <>
      <Combobox
        entries={invoiceEntries}
        label="Invoice"
        legacyStyles={false}
        nullable
        openMenuOnFocus
        placeholder="Select or search Invoice"
        selectedValue={invoice ? invoiceDisplayText(invoice) : ""}
        setSelectedValue={handleInvoiceSelectChange}
      />
      {initialPartPayment && (
        <div className="tw-mb-4 tw-mt-5">
          <Switch
            className="tw-ml-5 tw-self-start tw-pt-0.5 tw-text-sm tw-text-gray-700"
            checked={partPayAcknowledged}
            label="This is a partial payment"
            onChange={() => setPartPayAcknowledged(!partPayAcknowledged)}
          />
        </div>
      )}
      <div
        className={classNames({
          "tw-my-4": initialPartPayment,
          "tw-mb-4 tw-mt-6": !initialPartPayment,
        })}
      >
        <ClientFlowButtons
          optionButtonOneText={I18n.t(
            "home.index.self_reconcile.select_invoice_modal.process_button",
          )}
          optionButtonTwoText={I18n.t(
            "home.index.self_reconcile.select_invoice_modal.multiple_invoices_button",
          )}
          optionButtonOneOnClick={() => {
            handleProcessWithoutInvoiceOnClick();
            trackOnClickEvent(
              "user_reconciliation_clicked_no_invoice",
              transaction,
            );
          }}
          optionButtonTwoOnClick={() => {
            handleMultipleInvoicesOnClick();
            trackOnClickEvent(
              "user_reconciliation_clicked_multiple_invoices",
              transaction,
            );
          }}
          optionButtonOneDisabled={invoiceIndex !== -1}
        />
      </div>
      <SelfReconcileButtons
        handleConfirm={() =>
          isOverpayment
            ? handleModalProgression(nextToOverpayment)
            : handleModalProgression(next)
        }
        handleBack={() => {
          resetState();
          handleModalProgression(previous);
        }}
        disabledSubmit={disabledSubmit}
        confirmButton="Next"
      />
    </>
  );
};

export default SelectClientInvoice;
