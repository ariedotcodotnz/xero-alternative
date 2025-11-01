import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import InvoiceTemplate from "../../invoice_quote/sections/InvoiceTemplate";
import { useInvoiceQuoteContext } from "../../invoice_quote/InvoiceQuoteContext";
import { getFormData } from "../../utils/InvoicesHelper";
import Alert from "../../_molecules/alert/Alert";
import I18n from "../../../utilities/translations";

interface iInvoicePreviewModal {
  disabledSave?: boolean;
  openConfirmationModal: () => void;
}

// A component to present the User with a preview of the Invoice with the current values.
// From here, the User can choose the send the Invoice, preview their Payslip, or just close
// the modal and continue editing the Invoice
const InvoicePreviewModal = ({
  disabledSave = false,
  openConfirmationModal,
}: iInvoicePreviewModal) => {
  const {
    invoiceObject,
    grandTotal,
    otherProps,
    currencyOptions,
    scheduleDate,
    scheduleTime,
    internationalClient,
  } = useInvoiceQuoteContext();

  // Local state variables
  // Controls the size of the Modal. Invoice preview is shown in a large Modal,
  // whereas the Payslip is a smaller size
  const [modalSize, setModalSize] = useState("lg");
  // Control whether the preview button is disabled (this is when the Payslip is being generated),
  // and control if the preview button is available at all (foreign-currency Invoices do not have Payslip previews)
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isPayslipPreviewEnabled, setIsPayslipPreviewEnabled] = useState(false);
  // References to DOM nodes so we can switch between showing Invoice and Payslip previews
  const ModalBodyRef = useRef(null);
  const InvoicePreviewRef = useRef(null);
  const PayslipPreviewRef = useRef(null);

  // Only enable PayslipPreview if the User's jurisdiction is the same as the Invoice currency
  // We don't support Payslip Previews on foreign currency Invoices
  useEffect(() => {
    if (otherProps) {
      setIsPayslipPreviewEnabled(
        grandTotal > 0 &&
          otherProps.jurisdiction_currency_code === currencyOptions.code,
      );
    }
  }, [grandTotal, currencyOptions, otherProps]);

  // Fires an AJAX request to the server to generate the payslip preview
  // The response is the raw HTML of the payslip, which then just inserted into
  // the DOM. Note that the Payslip gets inserted into the DOM as a result of
  // the `preview.js.erb` response that gets rendered by Rails - this component (in response the the request)
  // just re-enables the button and changes the modal size
  const showPayslip = () => {
    setIsButtonDisabled(true);
    $.ajax({
      type: "POST",
      url: "/invoices/preview",
      // Just send across all the form values
      data: {
        ...getFormData($(document.forms[0])),
      },
      success: () => {
        // Change the modal size and disabled-ness on success
        setModalSize("md");
        setIsButtonDisabled(false);
      },
      // If for any reason the preview fails, just re-enabled the button
      error: () => setIsButtonDisabled(false),
    });
  };

  // Manually hides the Payslip preview and shows the Invoice preview with CSS
  // as well as applies the correct sizing to the Modal
  const showInvoice = () => {
    PayslipPreviewRef.current.classList.add("hidden");
    InvoicePreviewRef.current.classList.remove("hidden");
    setModalSize("lg");
  };

  const submitButton = () => {
    const sendLater = scheduleDate && scheduleTime;

    return (
      <button
        className="hnry-button hnry-button--primary tw-basis-full sm:tw-basis-auto"
        type="button"
        onClick={openConfirmationModal}
        disabled={disabledSave}
      >
        {sendLater ? "Schedule" : "Send"}
      </button>
    );
  };

  return (
    // This conditional is only here so that the component only renders after the Context has been initialised
    invoiceObject ? (
      <div
        className="modal"
        id="modal-preview-invoice"
        role="dialog"
        aria-labelledby="modal-preview-invoice-header"
        aria-hidden="true"
        data-backdrop="static"
        data-keyboard="false"
      >
        <motion.div
          className={"modal-dialog modal-notify modal-info"}
          initial={{ maxWidth: 500 }}
          animate={{
            maxWidth: modalSize === "md" ? 500 : 800,
            // Animate the height to be the natural height of the Payslip or Invoice
            height:
              ModalBodyRef.current && ModalBodyRef.current.offsetHeight
                ? ModalBodyRef.current.offsetHeight
                : "",
          }}
          ref={ModalBodyRef}
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header" id="modal-preview-invoice-header">
              <p className="heading lead">
                {modalSize === "lg" ? "Invoice" : "Payslip preview"}
                <span className="hidden-sm-down">
                  {" "}
                  for {invoiceObject.invoice_number}
                </span>
              </p>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={() => showInvoice()}
              >
                <span className="white-text" aria-hidden="true">
                  &times;
                </span>
              </button>
            </div>
            <div className="modal-body body-preview">
              <div id="invoice-preview" ref={InvoicePreviewRef}>
                <InvoiceTemplate showPayNowButton={false} showPaymentDetails={!internationalClient} />
              </div>
              <div
                id="payslip-preview"
                className="hidden"
                ref={PayslipPreviewRef}
              >
                <Alert>
                  <p>{I18n.t("invoices.preview_payslip.warning")}</p>
                </Alert>
                <div id="payslip-target" />
              </div>
            </div>
            <div className="modal-footer">
              <div className="tw-flex tw-gap-4 tw-flex-wrap-reverse sm:tw-flex-row tw-w-full">
                <button
                  type="button"
                  className="hnry-button hnry-button--tertiary tw-basis-1/3-gap-4 sm:tw-basis-auto tw-mr-auto sm:tw-max-w-full"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={() => showInvoice()}
                >
                  Cancel
                </button>
                {isPayslipPreviewEnabled &&
                  (modalSize === "lg" ? (
                    <button
                      className="hnry-button hnry-button--secondary tw-basis-2/3-gap-4 sm:tw-basis-auto"
                      type="button"
                      onClick={() => showPayslip()}
                      disabled={isButtonDisabled}
                    >
                      {isButtonDisabled ? "Generating ..." : "Preview Payslip"}
                    </button>
                  ) : (
                    <button
                      className="hnry-button hnry-button--secondary tw-basis-2/3-gap-4 sm:tw-basis-auto"
                      type="button"
                      onClick={() => showInvoice()}
                      disabled={isButtonDisabled}
                    >
                      Preview Invoice
                    </button>
                  ))}
                {submitButton()}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    ) : null
  );
};

export default InvoicePreviewModal;
