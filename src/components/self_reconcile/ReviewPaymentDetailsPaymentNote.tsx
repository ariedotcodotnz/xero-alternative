import React, { useState } from "react";
import TextArea from "@hui/_atoms/textarea/Textarea";
import { createUserPaymentNote } from "@api/self_reconcile/bank_transactions.api";
import Input from "@hui/_atoms/input/Input";
import { iClient } from "@api/self_reconcile/clients.api";
import I18n from "../../utilities/translations";
import SelfReconcileButtons from "./SelfReconcileButtons";

interface ReviewPaymentDetailsPaymentNoteProps {
  client?: iClient;
  bankTransactionId: string;
  paymentDescription: string;
  handleModalProgression: (step: string) => void;
  next: string;
  previous: string;
  markCurrentTransactionReviewed: () => void;
  resetState: () => void;
  paymentOnBehalfOfClient?: boolean;
}

const ReviewPaymentDetailsPaymentNote = ({
  client,
  bankTransactionId,
  paymentDescription,
  handleModalProgression,
  next,
  previous,
  markCurrentTransactionReviewed,
  resetState,
  paymentOnBehalfOfClient = false,
}: ReviewPaymentDetailsPaymentNoteProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      const response = await createUserPaymentNote({
        bankTransactionId,
        clientId: client?.id,
        paymentDescription,
        paymentOnBehalfOfClient,
      });

      if (response.success) {
        setIsLoading(false);
        markCurrentTransactionReviewed();
        resetState();
        handleModalProgression(next);
      } else {
        setIsLoading(false);
        toastr.error("Message failed");
      }
    } catch (error) {
      if (typeof Rollbar !== "undefined") {
        Rollbar.warning("User unable to add payment note to bank transaction", {
          error,
        });
      }
    }
  };

  return (
    <>
      <div className="tw-my-3">
        <p className="tw-pt-3 tw-text-sm tw-font-light tw-text-gray-600">
          {I18n.t(
            "home.index.self_reconcile.more_information_modal.confirmation",
          )}
        </p>
        {client && (
          <div className="tw-mb-4">
            <Input
              readOnly
              value={client.organisationName}
              label="Client"
              inputClasses="tw-text-gray-500 tw-font-light"
            />
          </div>
        )}
        <TextArea
          disabled
          label="Payment description"
          name="paymentDescription"
          id="payment-description-payment-note"
          value={paymentDescription}
          setValue={() => {}}
          disableResize
          autoGrow={false}
          scrollbarWidth="auto"
          aria-label="Payment description"
        />
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

export default ReviewPaymentDetailsPaymentNote;
