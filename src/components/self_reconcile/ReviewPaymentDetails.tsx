import React, { useState } from "react";

import { iClient } from "@api/self_reconcile/clients.api";
import { Invoice, invoiceDisplayText } from "@api/self_reconcile/invoices.api";
import {
  reconcileToClient,
  reconcileToInvoice,
} from "@api/self_reconcile/transaction_reconciliations";
import Input from "@hui/_atoms/input/Input";
import Alert from "@hui/_molecules/alert/Alert";

import I18n from "../../utilities/translations";
import SelfReconcileButtons from "./SelfReconcileButtons";

const ctx = { scope: "home.index.self_reconcile.review_payment_details" };

export interface ReviewPaymentDetailsProps {
  handleModalProgression: (step: string) => void;
  previous: string;
  next: string;
  bankTransactionId: string;
  client: iClient;
  markCurrentTransactionReviewed: () => void;
  invoice?: Invoice;
}

const ReviewPaymentDetails = ({
  bankTransactionId,
  handleModalProgression,
  previous,
  next,
  client,
  invoice,
  markCurrentTransactionReviewed,
}: ReviewPaymentDetailsProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      const baseParams = { bankTransactionId, clientId: client.id };

      setIsLoading(true);
      const reconcile = () =>
        invoice
          ? reconcileToInvoice({ ...baseParams, invoiceId: invoice?.id })
          : reconcileToClient(baseParams);

      const response = await reconcile();

      if (response.success) {
        setIsLoading(false);
        markCurrentTransactionReviewed();
        handleModalProgression(next);
      } else {
        setIsLoading(false);
        toastr.error("Payment review failed");
      }
    } catch (error) {
      if (typeof Rollbar !== "undefined") {
        Rollbar.warning(
          "User unable to reconcile bank transaction to client or invoice",
          {
            error,
          },
        );
      }
    }
  };

  return (
    <>
      <div>
        <div className="tw-my-6 tw-text-sm">
          <p className="tw-mb-2.5">{I18n.t("description", ctx)}</p>

          <div className="tw-mb-2">
            <Input
              inputClasses="tw-text-gray-500 tw-font-light"
              name="client-name"
              label="Client"
              value={client.organisationName}
              readOnly
            />
          </div>

          {invoice && (
            <>
              <div className="tw-mb-5">
                <Input
                  inputClasses="tw-text-gray-500 tw-font-light"
                  name="selected-invoice"
                  label="Invoice"
                  value={invoiceDisplayText(invoice)}
                  readOnly
                />
              </div>

              <Alert variant="info">
                <p className="tw-text-sm">{I18n.t("alert", ctx)}</p>
              </Alert>
            </>
          )}
        </div>
      </div>
      <SelfReconcileButtons
        handleConfirm={handleConfirm}
        handleBack={() => handleModalProgression(previous)}
        disabledSubmit={false}
        confirmButton="Submit"
        loading={isLoading}
      />
    </>
  );
};

export default ReviewPaymentDetails;
