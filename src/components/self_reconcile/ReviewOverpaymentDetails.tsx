import React, { useRef, useState } from "react";

import { iClient } from "@api/self_reconcile/clients.api";
import { Invoice, invoiceDisplayText } from "@api/self_reconcile/invoices.api";
import { createUserPaymentNote } from "@api/self_reconcile/bank_transactions.api";
import Input from "@hui/_atoms/input/Input";
import Checkbox from "@hui/_atoms/checkbox/Checkbox";

import I18n from "../../utilities/translations";
import SelfReconcileButtons from "./SelfReconcileButtons";

const ctx = { scope: "home.index.self_reconcile.review_overpayment_details" };

export interface ReviewOverpaymentDetailsProps {
  handleModalProgression: (step: string) => void;
  previous: string;
  next: string;
  bankTransactionId: string;
  client: iClient;
  invoice: Invoice;
  markCurrentTransactionReviewed: () => void;
}

const ReviewOverpaymentDetails = ({
  bankTransactionId,
  handleModalProgression,
  previous,
  next,
  client,
  invoice,
  markCurrentTransactionReviewed,
}: ReviewOverpaymentDetailsProps) => {
  const buttonRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      const response = await createUserPaymentNote({
        bankTransactionId,
        clientId: client.id,
        invoiceId: invoice.id,
      });

      if (response.success) {
        setIsLoading(false);
        markCurrentTransactionReviewed();
        handleModalProgression(next);
      } else {
        setIsLoading(false);
        toastr.error("Message failed");
      }
    } catch (error) {
      if (typeof Rollbar !== "undefined") {
        Rollbar.warning(
          "User unable to add a payment note to bank transaction with overpayment",
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
          <p className="tw-mb-2.5 tw-font-bold tw-text-gray-700">
            {I18n.t("description", ctx)}
          </p>

          <p className="tw-text-gray-700">{I18n.t("details", ctx)}</p>

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
            <div className="tw-mb-5">
              <Input
                inputClasses="tw-text-gray-500 tw-font-light"
                name="selected-invoice"
                label="Invoice"
                value={invoiceDisplayText(invoice)}
                readOnly
              />
            </div>
          )}

          <label
            htmlFor="overpayment-consent-checkbox"
            className="tw-mt-4 tw-flex tw-items-center"
          >
            <Checkbox
              myRef={buttonRef}
              id="overpayment-consent-checkbox"
              name="overPaymentConsent"
              checked={consentChecked}
              onCheckedChange={(checked) => setConsentChecked(checked)}
            />
            <span className="tw-ml-4 tw-text-base tw-text-gray-700">
              {I18n.t("checkbox_label", ctx)}
            </span>
          </label>
        </div>
      </div>
      <SelfReconcileButtons
        handleConfirm={handleConfirm}
        handleBack={() => handleModalProgression(previous)}
        disabledSubmit={!consentChecked}
        confirmButton="Submit"
        loading={isLoading}
      />
    </>
  );
};

export default ReviewOverpaymentDetails;
