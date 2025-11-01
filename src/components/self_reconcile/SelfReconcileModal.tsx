import React, { Dispatch, SetStateAction } from "react";
import Modal from "@hui/_molecules/modal/Modal";
import { Transaction } from "@api/self_reconcile/bank_transactions.api";
import TransactionDetails from "./TransactionDetails";

interface SelfReconcileModalProps {
  children: React.ReactNode;
  closable: boolean;
  onCancel: () => void;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
  transaction: Transaction;
  transactionCount: number;
  transactionIndex: number;
  clientName?: string;
  invoiceNumber?: string;
}

const SelfReconcileModal = ({
  children,
  closable,
  onCancel,
  open,
  setOpen,
  title,
  transaction,
  transactionCount,
  transactionIndex,
  clientName,
  invoiceNumber,
}: SelfReconcileModalProps) => (
  <Modal
    open={open}
    setOpen={setOpen}
    title={title}
    closable={closable}
    onCancel={onCancel}
    onOutsideCloseAction={onCancel}
  >
    <TransactionDetails
      transaction={transaction}
      transactionCount={transactionCount}
      transactionIndex={transactionIndex}
      clientName={clientName}
      invoiceNumber={invoiceNumber}
    />
    {children}
  </Modal>
);

export default SelfReconcileModal;
