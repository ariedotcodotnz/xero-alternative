import React, { useState, useEffect } from "react";
import Button from "@hui/_atoms/button/Button";
import { useInvoiceQuoteContext } from "../../invoice_quote/InvoiceQuoteContext";
import { sendInvoice, InvoiceSendSuccessResponse } from "../../../API/invoice_send.api";
import I18n from "../../../utilities/translations";

interface iInvoiceFooter {
  editing: boolean;
  sendLater: boolean;
  handleCancelClick: () => void;
  setOpen: (boolean) => void;
}

const ctx = { scope: "invoices.invoice_footer" };

const InvoiceFooter = ({
  editing,
  sendLater,
  handleCancelClick,
  setOpen,
}: iInvoiceFooter) => {
  const [isLoading, setIsLoading] = useState(false);

  const { untaxedDepositAccepted, invoiceObject } = useInvoiceQuoteContext();

  useEffect(() => {
    let timeoutId;
    if (isLoading) {
      timeoutId = setTimeout(() => {
        setIsLoading(false);
      }, 5000);
    }

    return () => clearTimeout(timeoutId);
  }, [isLoading]);

  const cancelUnsavedChangeAlert = (event: React.MouseEvent<HTMLButtonElement>) => {
    const cancelEvent = new CustomEvent("hnry:cancel_unsaved_changes", { bubbles: true });
    event.target.dispatchEvent(cancelEvent);
  }

  const handleSendOrScheduleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (isLoading) { return; }

    setIsLoading(true);

    try {
      const response = await sendInvoice({ invoiceId: invoiceObject.id, untaxedDepositAccepted }) as InvoiceSendSuccessResponse;
      const { status } = response.data;

      if (status === "ok") {
        setOpen(false);
        cancelUnsavedChangeAlert(event);
        Turbolinks.clearCache();
        Turbolinks.visit(Routes.invoices_path(), { action: "replace" });
      } else {
        toastr.error(response.data.error);
      }
    } catch (error) {
      if (typeof Rollbar !== "undefined") {
        Rollbar.warning("Unable to send invoice when Send/Schedule button is clicked", { error });
      }
      toastr.warning("Error saving invoice", error);
    }
  }

  const invoiceAction = sendLater ? "schedule" : "send";

  return (
    <div className="hnry-dialog-panel-actions !tw-mt-4">
      <Button
        loading={isLoading}
        type="button"
        name={invoiceAction}
        value={invoiceAction}
        onClick={handleSendOrScheduleClick}
        dataTrackClick={{ eventName: `invoice_${invoiceAction}_button_clicked` }}
        disabled={editing}
      >
        {I18n.t(invoiceAction, ctx)}
      </Button>
      <Button
        type="button"
        variant="secondary"
        aria-label="Close"
        onClick={handleCancelClick}
      >
        Cancel
      </Button>
    </div>
  );
};

export default InvoiceFooter;
