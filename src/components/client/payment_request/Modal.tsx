import React, { useState } from "react";
import Modal from "../../_molecules/modal/Modal";
import InputPrice from "../../_atoms/input/InputPrice";
import Alert from "../../_molecules/alert/Alert";
import Link from "../../_atoms/link/Link";
import { requestPayment } from "../../../API/clients.api";
import { iPaymentRequest } from "./Button";
import I18n from "../../../utilities/translations";

interface iPaymentRequestModal extends iPaymentRequest {
  open: boolean;
  setOpen: (boolean) => void;
  isMobile: boolean;
}

const PaymentRequestModal = ({
  canRequestPayment,
  clientId,
  clientName,
  url,
  open,
  setOpen,
  maxInvoiceTotal,
  isMobile,
}: iPaymentRequestModal) => {
  const [amount, setAmount] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [invalidAmount, setInvalidAmount] = useState("");

  const { currencySymbol } = window.Hnry.User.jurisdiction;
  const salesTaxName = I18n.t("global.sales_tax");

  const reset = () => {
    setAmount("");
    setOpen(false);
  };

  const handleSubmit = async () => {
    try {
      const response = await requestPayment({ clientId, amount });

      if (response.success) {
        toastr.success(response.message);
      } else {
        toastr.error(response.message);
      }
    } catch (error) {
      if (typeof Rollbar !== "undefined") {
        Rollbar.warning("User unable to send payment request", { error });
      }
    } finally {
      reset();
    }
  };

  const handleChange = (value) => {
    const newValue = Number(value);

    if (canRequestPayment && newValue > 0) {
      setDisabled(false);
    } else if (!canRequestPayment || newValue <= 0) {
      setDisabled(true);
    }

    if (canRequestPayment && newValue > maxInvoiceTotal) {
      setInvalidAmount(
        `Amount to charge cannot be greater than ${maxInvoiceTotal}.`,
      );
      setDisabled(true);
    } else {
      setInvalidAmount("");
    }

    setAmount(value);
  };

  const handleAutoFocusOnOpen = (event) => {
    if (isMobile) {
      // Remove autofocus on mobile view
      event.preventDefault();
      // eslint-disable-next-line xss/no-mixed-html
      const footerBtn = document.querySelector(".hnry-dialog-panel-actions .hnry-button--secondary") as HTMLButtonElement;
      footerBtn.focus();
    }
  }

  return (
    <Modal
      onConfirm={handleSubmit}
      open={open}
      setOpen={setOpen}
      title={`${I18n.t("payment_requests.modal.title")} ${clientName}`}
      onCancel={reset}
      confirmCTA="Send"
      disabled={disabled}
      onOpenAutoFocus={handleAutoFocusOnOpen}
    >
      {!canRequestPayment && (
        <Alert variant="danger">
          <p className="tw-mb-0 tw-text-sm tw-leading-6">
            {I18n.t("payment_requests.modal.prompt")}{" "}
            <Link
              type="danger"
              text={I18n.t("payment_requests.modal.edit_link")}
              href={url}
            />
          </p>
        </Alert>
      )}
      <InputPrice
        id="payment_request_amount"
        label={`${I18n.t("payment_requests.modal.label")} ${salesTaxName}`}
        name="payment_request[amount]"
        currencySign={currencySymbol}
        value={amount}
        onChange={handleChange}
        onBlur={handleChange}
        disabled={!canRequestPayment}
        invalid={invalidAmount}
      />
      {canRequestPayment && (
        <Alert variant="info">
          <p className="tw-mb-0 tw-text-sm tw-leading-6">
            {I18n.t("payment_requests.modal.info")}
          </p>
        </Alert>
      )}
    </Modal>
  );
};

export default PaymentRequestModal;
