import React from "react";
import Alert from "@hui/_molecules/alert/Alert";
import { useInvoiceQuoteContext } from "../invoice_quote/InvoiceQuoteContext";
import {
  getFormData,
  cancelUnsavedChangeAlert,
  saveOrUpdateInvoice,
  visitUrl,
} from "./helpers";

const AllocationAlert = () => {
  const { invoiceObject } = useInvoiceQuoteContext();
  const handleLinkClick = async (
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    event.preventDefault();
    const linkUrl = event.currentTarget.href;
    window.analytics.track(`invoice_allocations_banner_link_clicked`);

    try {
      const formObject = getFormData("form[id*='invoice']");

      const response = await saveOrUpdateInvoice(formObject, invoiceObject.id);
      const { status, error } =
        "data" in response
          ? response.data
          : { status: "error", error: "Unknown error" };

      if (status !== "ok") {
        throw new Error(error);
      }

      cancelUnsavedChangeAlert();
      visitUrl(linkUrl);
    } catch (error) {
      toastr.warning("Error saving invoice", error);
      // We'll allow a console warning here, as this will log to Datadog.
      // eslint-disable-next-line no-console
      console.warn("User unable to save invoice as draft", { error });
    }
  };

  return (
    <Alert title="Allocations for this Invoice">
      <p>
        If you want to edit your Allocations, you&apos;ll need to make these changes from the{" "}
        <a
          href={Routes.allocation_preferences_path()}
          onClick={handleLinkClick}
        >
          Allocations page
        </a>
        . If an Allocation is updated after the Invoice is sent, the change
        will be applied when the payment is received.
      </p>
    </Alert>
  );
};

export default AllocationAlert;
