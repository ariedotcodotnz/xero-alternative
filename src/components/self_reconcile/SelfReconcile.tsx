import React, { useEffect, useState } from "react";

import {
  createClient,
  CreateClientDetailsType,
  getClients,
  iClient,
} from "@api/self_reconcile/clients.api";
import {
  getInvoicesByClient,
  InvoicesByClient,
} from "@api/self_reconcile/invoices.api";
import { handleHashedError } from "@api/utils/handleError";
import getBankTransactions, {
  Transaction,
} from "../../API/self_reconcile/bank_transactions.api";
import convertSnakeToCamelCase from "../../utilities/case-conversions/camelCase";
import convertCamelToSnakeCase from "../../utilities/case-conversions/snakeCase";
import I18n from "../../utilities/translations";
import AccountTopUp from "./account_top_up/AccountTopUp";
import AccountTopUpConfirm from "./account_top_up/AccountTopUpConfirm";
import MoreInformation from "./MoreInformation";
import ReviewPaymentDetails from "./ReviewPaymentDetails";
import ReviewOverpaymentDetails from "./ReviewOverpaymentDetails";
import ReviewPaymentDetailsPaymentNote from "./ReviewPaymentDetailsPaymentNote";
import CreateClientForm from "./select_client/CreateClientForm";
import SelectClient from "./select_client/SelectClient";
import SelectClientInvoice from "./select_client/SelectClientInvoice";
import SelfReconcileModal from "./SelfReconcileModal";
import SelfReconcileOptions from "./SelfReconcileOptions";
import SelfReconcileSuccess from "./SelfReconcileSuccess";
import { CreateClientFormType } from "./types/selfReconcileTypes";
import { mapToBackendTypes } from "./helpers/helpers";
import SelfReconcileBanner from "./SelfReconcileBanner";

interface SelfReconcileProps {
  numOfTransactionsToReview: number;
  salesTaxRegistered: boolean;
  hasActiveCard: boolean;
}

const SelfReconcile = ({
  numOfTransactionsToReview,
  salesTaxRegistered,
  hasActiveCard,
}: SelfReconcileProps) => {
  const SELF_RECONCILE_OPTIONS_MODAL = "self_reconcile_options";
  const ACCOUNT_TOP_UP_MODAL = "account_top_up";
  const ACCOUNT_TOP_UP_CONFIRM_MODAL = "account_top_up_confirm";
  const ACCOUNT_TOP_UP_SUCCESS_MODAL = "account_top_up_success";
  const MORE_INFORMATION_MODAL = "more_information";
  const MORE_INFORMATION_CONFIRM_MODAL = "more_information_confirm";
  const MORE_INFORMATION_SUCCESS_MODAL = "more_information_success";
  const SELECT_CLIENT_MODAL = "select_client";
  const CREATE_CLIENT_MODAL = "create_client";
  const MULTIPLE_CLIENTS_MORE_INFORMATION_MODAL =
    "multiple_clients_more_information";
  const MULTIPLE_CLIENTS_CONFIRM_MODAL = "multiple_clients_confirm";
  const MULTIPLE_CLIENTS_SUCCESS_MODAL = "multiple_clients_success";
  const SELECT_INVOICE_MODAL = "select_invoice";
  const MULTIPLE_INVOICES_MORE_INFORMATION_MODAL =
    "multiple_invoices_more_information";
  const MULTIPLE_INVOICES_CONFIRM_MODAL = "multiple_invoices_confirm";
  const MULTIPLE_INVOICES_SUCCESS_MODAL = "multiple_invoices_success";
  const REVIEW_PAYMENT_DETAILS_MODAL = "review_payment_details";
  const CLIENT_PAYMENT_SUCCESS_MODAL = "client_payment_success";
  const REVIEW_OVERPAYMENT_DETAILS_MODAL = "review_overpayment_details";
  const CLIENT_OVERPAYMENT_SUCCESS_MODAL = "client_overpayment_success";

  const [showModal, setShowModal] = useState(false);
  const [currentModal, setCurrentModal] = useState(
    SELF_RECONCILE_OPTIONS_MODAL,
  );
  const [transactionIndex, setTransactionIndex] = useState(0);
  const [transactionCount, setTransactionCount] = useState(
    numOfTransactionsToReview,
  );

  const [transactions, setTransactions] = useState<Array<Transaction>>([]);
  const [clients, setClients] = useState<Array<iClient>>([]);
  const [clientIndex, setClientIndex] = useState(-1);
  const [invoicesByClient, setInvoicesByClient] = useState<InvoicesByClient>(
    {},
  );
  const [invoiceIndex, setInvoiceIndex] = useState(-1);

  const [partPayAcknowledged, setPartPayAcknowledged] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [paymentDescription, setPaymentDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleModalProgression = (nextStep: string) => {
    setCurrentModal(nextStep);
  };

  const fetchTxns = () => {
    getBankTransactions("pending_self_review")
      .then((response) => {
        if (response.success) {
          const formattedTransactions = response.transactions.map(
            (transaction: Transaction) => {
              const camelledTransaction = convertSnakeToCamelCase(transaction);
              return { ...camelledTransaction, hasBeenReviewed: false };
            },
          );

          setTransactions(formattedTransactions);
        }
      })
      .catch(() => {
        setButtonDisabled(true);
        toastr.error("Error fetching transactions");
      });
  };

  const fetchClients = () => {
    getClients()
      .then((response) => {
        if (response.success) {
          setClients(
            response.clients.map((c: iClient) => convertSnakeToCamelCase(c)),
          );
        }
      })
      .catch(() => {
        setButtonDisabled(true);
        toastr.error("Error fetching clients");
      });
  };

  const fetchInvoices = () => {
    getInvoicesByClient()
      .then((response) => {
        if (response.success) {
          setInvoicesByClient(
            convertSnakeToCamelCase(response.invoices_by_client),
          );
        }
      })
      .catch(() => {
        setButtonDisabled(true);
        toastr.error("Error fetching invoices");
      });
  };

  const onCreateClientSubmit = async (formValues: CreateClientFormType) => {
    const mappedFormValues = mapToBackendTypes(formValues);
    try {
      setIsLoading(true);
      const formattedRequest = convertCamelToSnakeCase(
        mappedFormValues,
      ) as CreateClientDetailsType;
      const response = await createClient(formattedRequest);
      if (response.success) {
        const res = await getClients();
        if (res.success) {
          setClients(
            res.clients.map((c: iClient) => convertSnakeToCamelCase(c)),
          );
          const index = res.clients.findIndex(
            (c: iClient) => c.id === response.client.id,
          );
          setClientIndex(index);
        }
        await handleModalProgression(REVIEW_PAYMENT_DETAILS_MODAL);
      } else {
        handleHashedError(response);
      }
    } catch (err) {
      toastr.error("Something went wrong, please try again");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTxns();
    fetchClients();
    fetchInvoices();
  }, []);

  const ctx = { scope: "home.index.self_reconcile" };

  const client = clients[clientIndex];
  const invoices = invoicesByClient[client?.id] || [];
  const transaction = transactions[transactionIndex];

  const selfReconcileTitleFor = {
    self_reconcile_options: I18n.t("self_reconcile_options_modal.title", ctx),
    account_top_up: I18n.t("account_top_up_modal.title", ctx),
    account_top_up_confirm: I18n.t("account_top_up_modal.confirm_title", ctx),
    account_top_up_success: I18n.t("account_top_up_modal.success_title", ctx),
    more_information: I18n.t("more_information_modal.title", ctx),
    more_information_confirm: I18n.t(
      "more_information_modal.confirm_title",
      ctx,
    ),
    more_information_success: I18n.t(
      "more_information_modal.success_title",
      ctx,
    ),
    select_client: I18n.t("select_client_modal.title", ctx),
    create_client: I18n.t("create_client_modal.title", ctx),
    multiple_clients_more_information: I18n.t(
      "multiple_clients_modal.title",
      ctx,
    ),
    multiple_clients_confirm: I18n.t(
      "multiple_clients_modal.confirm_title",
      ctx,
    ),
    multiple_clients_success: I18n.t(
      "multiple_clients_modal.success_title",
      ctx,
    ),
    select_invoice: I18n.t("select_invoice_modal.title", {
      client_name: client?.organisationName,
      ...ctx,
    }),
    multiple_invoices_more_information: I18n.t(
      "multiple_invoices_modal.title",
      {
        client_name: client?.organisationName,
        ...ctx,
      },
    ),
    multiple_invoices_confirm: I18n.t(
      "multiple_invoices_modal.confirm_title",
      ctx,
    ),
    multiple_invoices_success: I18n.t(
      "multiple_invoices_modal.success_title",
      ctx,
    ),
    review_payment_details: I18n.t("review_payment_details.title", ctx),
    client_payment_success: I18n.t("client_payment_modal.title", ctx),
    review_overpayment_details: I18n.t("review_overpayment_details.title", ctx),
    client_overpayment_success: I18n.t(
      "client_overpayment_modal.success_title",
      ctx,
    ),
  };

  const modalTitle = selfReconcileTitleFor[currentModal];

  const markCurrentTransactionReviewed = () => {
    const newTransactions = [...transactions];
    newTransactions[transactionIndex].hasBeenReviewed = true;
    setTransactions(newTransactions);
  };

  const incrementIndex = () => {
    const incrementedIndex = transactionIndex + 1;

    if (incrementedIndex === transactions.length) {
      setShowModal(false);
      setTransactionCount(0);
      toastr.success("All payments have been reviewed");
    } else {
      fetchInvoices();
      setTransactionIndex(incrementedIndex);
    }
  };

  const resetSelectClientState = () => {
    setClientIndex(-1);
  };

  const resetSelectInvoiceState = () => {
    setInvoiceIndex(-1);
    setPartPayAcknowledged(false);
  };

  const resetPaymentDescriptionState = () => {
    setPaymentDescription("");
  };

  const reset = () => {
    setShowModal(false);
    handleModalProgression(SELF_RECONCILE_OPTIONS_MODAL);
    resetSelectClientState();
    resetSelectInvoiceState();
    resetPaymentDescriptionState();
    setTransactionIndex(0);

    const notYetReviewed = transactions.filter((t) => !t.hasBeenReviewed);
    setTransactions(notYetReviewed);
    setTransactionCount(notYetReviewed.length);
  };

  const returnToOptions = () => {
    handleModalProgression(SELF_RECONCILE_OPTIONS_MODAL);
  };

  const handleOptionClick = (modalType: string) => {
    handleModalProgression(modalType);
  };

  const handleMultipleClientsOnClick = () => {
    setCurrentModal(MULTIPLE_CLIENTS_MORE_INFORMATION_MODAL);
    resetSelectClientState();
  };

  const handleCreateClientOnClick = () => {
    setCurrentModal(CREATE_CLIENT_MODAL);
    resetSelectClientState();
  };

  const handleMultipleInvoicesOnClick = () => {
    setCurrentModal(MULTIPLE_INVOICES_MORE_INFORMATION_MODAL);
    resetSelectInvoiceState();
  };

  const handleProcessWithoutInvoiceOnClick = () => {
    setCurrentModal(REVIEW_PAYMENT_DETAILS_MODAL);
    resetSelectInvoiceState();
  };

  const handleNoInvoiceNextStep =
    invoices.length > 0 ? SELECT_INVOICE_MODAL : REVIEW_PAYMENT_DETAILS_MODAL;
  const handleNoInvoicePreviousStep =
    invoices.length > 0 ? SELECT_INVOICE_MODAL : SELECT_CLIENT_MODAL;

  const buttonText =
    transactionIndex + 1 === transactions.length ? "Done" : "Next";
  const bankTransactionId = transaction?.id;

  const selfReconcileModalContentFor = {
    self_reconcile_options: (
      <SelfReconcileOptions
        onAccountTopUpClick={() => handleOptionClick(ACCOUNT_TOP_UP_MODAL)}
        onClientPaymentClick={() => handleOptionClick(SELECT_CLIENT_MODAL)}
        onSomethingElseClick={() => handleOptionClick(MORE_INFORMATION_MODAL)}
        incrementIndex={incrementIndex}
        transactionIndex={transactionIndex}
        transactions={transactions}
        hasActiveCard={hasActiveCard}
      />
    ),
    account_top_up: (
      <AccountTopUp
        referenceValue="Add funds"
        handleModalProgression={handleModalProgression}
        next={ACCOUNT_TOP_UP_CONFIRM_MODAL}
        previous={SELF_RECONCILE_OPTIONS_MODAL}
      />
    ),
    account_top_up_confirm: (
      <AccountTopUpConfirm
        handleModalProgression={handleModalProgression}
        next={ACCOUNT_TOP_UP_SUCCESS_MODAL}
        previous={ACCOUNT_TOP_UP_MODAL}
        userReviewType="account_top_up"
        bankTransactionId={bankTransactionId}
        markCurrentTransactionReviewed={markCurrentTransactionReviewed}
      />
    ),
    account_top_up_success: (
      <SelfReconcileSuccess
        variant="account_top_up"
        buttonText={buttonText}
        handleDoneClick={returnToOptions}
      />
    ),
    more_information: (
      <MoreInformation
        variant="more_information"
        paymentDescription={paymentDescription}
        setPaymentDescription={setPaymentDescription}
        handleModalProgression={handleModalProgression}
        next={MORE_INFORMATION_CONFIRM_MODAL}
        previous={SELF_RECONCILE_OPTIONS_MODAL}
        resetState={resetPaymentDescriptionState}
      />
    ),
    more_information_confirm: (
      <ReviewPaymentDetailsPaymentNote
        paymentDescription={paymentDescription}
        handleModalProgression={handleModalProgression}
        next={MORE_INFORMATION_SUCCESS_MODAL}
        previous={MORE_INFORMATION_MODAL}
        bankTransactionId={bankTransactionId}
        markCurrentTransactionReviewed={markCurrentTransactionReviewed}
        resetState={resetPaymentDescriptionState}
      />
    ),
    more_information_success: (
      <SelfReconcileSuccess
        variant="more_information"
        buttonText={buttonText}
        handleDoneClick={returnToOptions}
      />
    ),
    select_client: (
      <SelectClient
        clients={clients}
        clientIndex={clientIndex}
        setClientIndex={setClientIndex}
        handleModalProgression={handleModalProgression}
        handleMultipleClientsOnClick={handleMultipleClientsOnClick}
        handleCreateClientOnClick={handleCreateClientOnClick}
        transaction={transaction}
        next={handleNoInvoiceNextStep}
        previous={SELF_RECONCILE_OPTIONS_MODAL}
        resetState={resetSelectClientState}
      />
    ),
    create_client: (
      <CreateClientForm
        handleModalProgression={handleModalProgression}
        previous={SELECT_CLIENT_MODAL}
        resetState={resetSelectClientState}
        salesTaxRegistered={salesTaxRegistered}
        onSubmit={onCreateClientSubmit}
        loading={isLoading}
      />
    ),
    multiple_clients_more_information: (
      <MoreInformation
        variant="multiple_clients"
        paymentDescription={paymentDescription}
        setPaymentDescription={setPaymentDescription}
        handleModalProgression={handleModalProgression}
        next={MULTIPLE_CLIENTS_CONFIRM_MODAL}
        previous={SELECT_CLIENT_MODAL}
        resetState={() => {
          resetSelectClientState();
          resetPaymentDescriptionState();
        }}
      />
    ),
    multiple_clients_confirm: (
      <ReviewPaymentDetailsPaymentNote
        paymentDescription={paymentDescription}
        handleModalProgression={handleModalProgression}
        next={MULTIPLE_CLIENTS_SUCCESS_MODAL}
        previous={MULTIPLE_CLIENTS_MORE_INFORMATION_MODAL}
        bankTransactionId={bankTransactionId}
        markCurrentTransactionReviewed={markCurrentTransactionReviewed}
        resetState={resetPaymentDescriptionState}
        paymentOnBehalfOfClient
      />
    ),
    multiple_clients_success: (
      <SelfReconcileSuccess
        variant="multiple_clients"
        buttonText={buttonText}
        handleDoneClick={returnToOptions}
      />
    ),
    select_invoice: (
      <SelectClientInvoice
        invoices={invoices}
        invoiceIndex={invoiceIndex}
        setInvoiceIndex={setInvoiceIndex}
        handleModalProgression={handleModalProgression}
        handleMultipleInvoicesOnClick={handleMultipleInvoicesOnClick}
        handleProcessWithoutInvoiceOnClick={handleProcessWithoutInvoiceOnClick}
        partPayAcknowledged={partPayAcknowledged}
        setPartPayAcknowledged={setPartPayAcknowledged}
        nextToOverpayment={REVIEW_OVERPAYMENT_DETAILS_MODAL}
        next={REVIEW_PAYMENT_DETAILS_MODAL}
        previous={SELECT_CLIENT_MODAL}
        resetState={resetSelectInvoiceState}
        transaction={transaction}
      />
    ),
    multiple_invoices_more_information: (
      <MoreInformation
        variant="multiple_invoices"
        paymentDescription={paymentDescription}
        setPaymentDescription={setPaymentDescription}
        handleModalProgression={handleModalProgression}
        next={MULTIPLE_INVOICES_CONFIRM_MODAL}
        previous={SELECT_INVOICE_MODAL}
        resetState={resetPaymentDescriptionState}
      />
    ),
    multiple_invoices_confirm: (
      <ReviewPaymentDetailsPaymentNote
        client={client}
        paymentDescription={paymentDescription}
        handleModalProgression={handleModalProgression}
        next={MULTIPLE_INVOICES_SUCCESS_MODAL}
        previous={MULTIPLE_INVOICES_MORE_INFORMATION_MODAL}
        bankTransactionId={bankTransactionId}
        markCurrentTransactionReviewed={markCurrentTransactionReviewed}
        resetState={resetPaymentDescriptionState}
        paymentOnBehalfOfClient
      />
    ),
    multiple_invoices_success: (
      <SelfReconcileSuccess
        variant="multiple_invoices"
        buttonText={buttonText}
        handleDoneClick={returnToOptions}
        resetState={() => {
          resetSelectClientState();
          resetPaymentDescriptionState();
        }}
      />
    ),
    review_payment_details: (
      <ReviewPaymentDetails
        handleModalProgression={handleModalProgression}
        bankTransactionId={bankTransactionId}
        next={CLIENT_PAYMENT_SUCCESS_MODAL}
        previous={handleNoInvoicePreviousStep}
        client={client}
        invoice={invoices[invoiceIndex]}
        markCurrentTransactionReviewed={markCurrentTransactionReviewed}
      />
    ),
    client_payment_success: (
      <SelfReconcileSuccess
        variant="client_payment"
        buttonText={buttonText}
        handleDoneClick={returnToOptions}
        resetState={() => {
          resetSelectClientState();
          resetSelectInvoiceState();
        }}
      />
    ),
    review_overpayment_details: (
      <ReviewOverpaymentDetails
        handleModalProgression={handleModalProgression}
        bankTransactionId={bankTransactionId}
        next={CLIENT_OVERPAYMENT_SUCCESS_MODAL}
        previous={SELECT_INVOICE_MODAL}
        client={client}
        invoice={invoices[invoiceIndex]}
        markCurrentTransactionReviewed={markCurrentTransactionReviewed}
      />
    ),
    client_overpayment_success: (
      <SelfReconcileSuccess
        variant="client_overpayment"
        buttonText={buttonText}
        handleDoneClick={returnToOptions}
        resetState={() => {
          resetSelectClientState();
          resetSelectInvoiceState();
        }}
      />
    ),
  };

  const showBanner =
    transactionCount > 0 && transactionIndex <= transactions.length;

  return (
    <>
      {showBanner && (
        <SelfReconcileBanner
          transactionCount={transactionCount}
          transactionIndex={transactionIndex}
          transactions={transactions}
          buttonDisabled={buttonDisabled}
          setShowModal={setShowModal}
        />
      )}
      {showModal && (
        <SelfReconcileModal
          closable
          onCancel={reset}
          open={showModal}
          setOpen={setShowModal}
          title={modalTitle}
          transaction={transaction}
          transactionCount={transactionCount}
          transactionIndex={transactionIndex}
          clientName={client?.organisationName}
          invoiceNumber={
            invoiceIndex !== -1
              ? invoices?.at(invoiceIndex)?.invoiceNumber
              : null
          }
        >
          {selfReconcileModalContentFor[currentModal]}
        </SelfReconcileModal>
      )}
    </>
  );
};

export default SelfReconcile;
