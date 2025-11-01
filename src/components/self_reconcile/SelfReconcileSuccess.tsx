import React from "react";
import Alert, { AlertVariant } from "@hui/_molecules/alert/Alert";
import Button from "@hui/_atoms/button/Button";
import I18n from "../../utilities/translations";

export type ModalVariant =
  | "client_payment"
  | "client_overpayment"
  | "account_top_up"
  | "more_information"
  | "multiple_clients"
  | "multiple_invoices";

const VARIANT_DETAILS: Record<ModalVariant, [AlertVariant, string]> = {
  client_payment: ["success", "client_payment_modal.success_alert"],
  client_overpayment: ["warning", "client_overpayment_modal.success_alert"],
  account_top_up: ["success", "account_top_up_modal.success_alert"],
  more_information: ["warning", "more_information_modal.success_alert"],
  multiple_clients: ["warning", "multiple_clients_modal.success_alert"],
  multiple_invoices: ["warning", "multiple_invoices_modal.success_alert"],
};

interface SelfReconcileSuccessProps {
  variant: ModalVariant;
  buttonText: string;
  handleDoneClick: () => void;
  resetState?: () => void;
}

const SelfReconcileSuccess = ({
  variant,
  buttonText,
  handleDoneClick,
  resetState,
}: SelfReconcileSuccessProps) => {
  const [alertVariant, translationKey] = VARIANT_DETAILS[variant];
  const alertMessage = I18n.t(translationKey, {
    scope: "home.index.self_reconcile",
  });

  return (
    <>
      <div>
        <div className="tw-mb-4 tw-mt-6">
          <Alert variant={alertVariant}>
            <p className="tw-mb-0 tw-text-sm tw-font-light tw-leading-6">
              {alertMessage}
            </p>
          </Alert>
        </div>
      </div>
      <div className="tw-w-full">
        <Button
          classes="!tw-px-3 tw-w-full"
          onClick={() => {
            if (resetState) {
              resetState();
            }
            handleDoneClick();
          }}
          disabled={false}
          variant="primary"
        >
          <span>{buttonText}</span>
        </Button>
      </div>
    </>
  );
};

export default SelfReconcileSuccess;
