import React from "react";
import TextArea from "@hui/_atoms/textarea/Textarea";
import classNames from "classnames";
import I18n from "../../utilities/translations";
import SelfReconcileButtons from "./SelfReconcileButtons";

const MAX_LENGTH = 700;

export type MoreInfoVariant =
  | "more_information"
  | "multiple_clients"
  | "multiple_invoices";

const VARIANT_DETAILS: Record<
  MoreInfoVariant,
  { instructionKey: string; disclaimerKey?: string }
> = {
  more_information: {
    instructionKey: "more_information_modal.instruction",
  },
  multiple_clients: {
    instructionKey: "multiple_clients_modal.instruction",
    disclaimerKey: "multiple_clients_modal.disclaimer",
  },
  multiple_invoices: {
    instructionKey: "multiple_invoices_modal.instruction",
  },
};

interface MoreInformationProps {
  variant: MoreInfoVariant;
  paymentDescription: string;
  handleModalProgression: (value: string) => void;
  next: string;
  previous: string;
  setPaymentDescription: (value: string) => void;
  resetState: () => void;
}

const ctx = { scope: "home.index.self_reconcile" };

const MoreInformation = ({
  variant,
  paymentDescription,
  handleModalProgression,
  next,
  previous,
  setPaymentDescription,
  resetState,
}: MoreInformationProps) => {
  const [hasBeenFocused, setHasBeenFocused] = React.useState(false);
  const { instructionKey, disclaimerKey } = VARIANT_DETAILS[variant];

  const instructionText = I18n.t(instructionKey, ctx);
  const disclaimerText = disclaimerKey ? I18n.t(disclaimerKey, ctx) : null;

  return (
    <div>
      {instructionText && (
        <p className="tw-pt-3 tw-text-sm tw-font-light tw-text-gray-600">
          {instructionText}
        </p>
      )}
      {disclaimerText && (
        <p className="tw-pt-3 tw-text-sm tw-font-bold tw-text-gray-600">
          {disclaimerText}
        </p>
      )}
      <TextArea
        required={hasBeenFocused}
        label="Payment description"
        name="paymentDescription"
        id="payment-description"
        value={paymentDescription}
        setValue={setPaymentDescription}
        disableResize
        autoGrow={false}
        scrollbarWidth="auto"
        maxLength={MAX_LENGTH}
        onFocus={() => setHasBeenFocused(true)}
      />
      {paymentDescription.length <= MAX_LENGTH && (
        <div
          className={classNames(
            "tw-mb-4 tw-mt-2 tw-flex tw-justify-end tw-text-xs",
            {
              "hnry-error": paymentDescription.length >= MAX_LENGTH,
              "hnry-note": paymentDescription.length < MAX_LENGTH,
            },
          )}
        >
          {I18n.t("more_information_modal.remaining_characters", {
            count: MAX_LENGTH - paymentDescription.length,
            ...ctx,
          })}
        </div>
      )}
      <SelfReconcileButtons
        handleConfirm={() => handleModalProgression(next)}
        handleBack={() => {
          resetState();
          handleModalProgression(previous);
        }}
        disabledSubmit={!paymentDescription.trim()}
        confirmButton="Next"
      />
    </div>
  );
};

export default MoreInformation;
