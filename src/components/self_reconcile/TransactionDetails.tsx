import React from "react";
import classNames from "classnames";
import { Transaction } from "@api/self_reconcile/bank_transactions.api";
import { getUserJurisdictionCode } from "../../utilities/user_attributes";
import { formatToLocalCurrency } from "../../utilities/currency/currency_format";

interface TransactionDetailsProps {
  transaction: Transaction;
  transactionCount: number;
  transactionIndex: number;
  clientName?: string;
  invoiceNumber?: string;
}

type DetailItemProps = {
  label: string;
  value: string;
  border?: boolean;
};

const DetailItem = ({ label, value, border }: DetailItemProps) => (
  <li
    className={classNames(
      "tw-flex tw-justify-between tw-py-1 tw-text-sm tw-font-light tw-text-gray-600",
      { "tw-border-b tw-border-gray-200 tw-pb-2": border },
    )}
  >
    <span>{label}:</span>
    <span>{value}</span>
  </li>
);

const createDetailSections = (jurisdictionCode: string) =>
  ({
    account: [
      { key: "accountName", label: "Account name" },
      {
        key: "bsb",
        label: `${jurisdictionCode === "uk" ? "Sort code" : "BSB"}`,
      },
      { key: "accountNumber", label: "Account number" },
    ],
    payment: [
      { key: "paymentAmount", label: "Payment amount" },
      { key: "paymentReceivedDate", label: "Payment received" },
      { key: "reference", label: "Reference" },
      { key: "code", label: "Code" },
      { key: "particulars", label: "Particulars" },
    ],
  }) as const;

const formatBranchCode = (accountNumber: string, jurisdictionCode: string) => {
  if (jurisdictionCode === "au") {
    return accountNumber.slice(0, 7);
  }
  if (jurisdictionCode === "uk") {
    return accountNumber.slice(0, 8);
  }
  return undefined;
};

const formatAccountNumber = (
  accountNumber: string,
  jurisdictionCode: string,
) => {
  if (jurisdictionCode === "au") {
    return accountNumber.slice(8);
  }
  if (jurisdictionCode === "uk") {
    return accountNumber.slice(9);
  }
  return accountNumber;
};

const formatTransactionForDisplay = (txn: Transaction) => {
  const jurisdictionCode = getUserJurisdictionCode();

  return {
    accountName: txn.payorName,
    accountNumber: formatAccountNumber(
      txn.payorAccountNumber,
      jurisdictionCode,
    ),
    bsb: formatBranchCode(txn.payorAccountNumber, jurisdictionCode),
    paymentAmount: formatToLocalCurrency(Number(txn.amount), jurisdictionCode, {
      decimals: true,
    }),
    paymentReceivedDate: txn.transactionDate,
    reference: txn.reference,
    code: txn.code,
    particulars: txn.particulars,
  };
};

const TransactionDetails = ({
  transaction,
  transactionCount,
  transactionIndex,
  clientName,
  invoiceNumber,
}: TransactionDetailsProps) => {
  const formattedTransaction = formatTransactionForDisplay(transaction);
  const DETAIL_SECTIONS = createDetailSections(getUserJurisdictionCode());

  const createDetailItems = (
    fields: (typeof DETAIL_SECTIONS)["account" | "payment"],
  ) =>
    fields
      .map(
        ({ key, label }) =>
          formattedTransaction[key] && {
            label,
            value: formattedTransaction[key],
            border: key === "accountNumber",
          },
      )
      .filter(Boolean);

  const accountDetails = createDetailItems(DETAIL_SECTIONS.account);
  const paymentDetails = createDetailItems(DETAIL_SECTIONS.payment);

  const renderClientDetails = clientName && transaction.hasBeenReviewed;
  const renderInvoiceDetails = invoiceNumber && transaction.hasBeenReviewed;

  return (
    <div className="tw-mb-3 tw-rounded-lg tw-bg-white tw-p-4 tw-pb-1 tw-shadow">
      <h1 className="tw-mb-2 tw-text-lg tw-font-semibold">{`Payment ${transactionIndex + 1} of ${transactionCount}`}</h1>
      <ul className="tw-mb-1">
        {accountDetails.map((item, index) => (
          <DetailItem key={index} {...item} />
        ))}
      </ul>
      <ul className="tw-mb-1">
        {paymentDetails.map((item, index) => (
          <DetailItem key={index} {...item} />
        ))}
      </ul>
      <ul className="tw-mb-1">
        {renderClientDetails && (
          <li
            className={classNames(
              "tw-flex tw-justify-between tw-border-t tw-border-gray-200 tw-py-1 tw-pt-2 tw-text-sm tw-font-light tw-text-gray-600",
            )}
          >
            <span>Client:</span>
            <span>{clientName}</span>
          </li>
        )}
        {renderInvoiceDetails && (
          <li
            className={classNames(
              "tw-flex tw-justify-between tw-py-1 tw-text-sm tw-font-light tw-text-gray-600",
            )}
          >
            <span>Invoice:</span>
            <span>{invoiceNumber}</span>
          </li>
        )}
      </ul>
    </div>
  );
};

export default TransactionDetails;
