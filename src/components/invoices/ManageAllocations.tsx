import React, { useEffect, useState } from "react";
import {
  getAllActiveAllocationPreferences,
  InvoiceAllocationPreferenceData,
} from "@api/allocation_preferences_invoices_api";
import HnryUIAccordion from "@hui/_molecules/accordion/Accordion";
import Badge from "@hui/_atoms/badge/Badge";
import AllocationAlert from "./AllocationAlert";
import I18n from "../../utilities/translations";
import { useInvoiceQuoteContext } from "../invoice_quote/InvoiceQuoteContext";
import AllocationsToggleList from "./AllocationsToggleList";

const ctx = { scope: "invoices.form.manage_allocations" };

const ManageAllocations = () => {
  const [allocations, setAllocations] = useState<
    InvoiceAllocationPreferenceData[]
  >([]);
  const { clientId, invoiceObject } = useInvoiceQuoteContext();
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (invoiceObject) {
      const fetchActiveAllocationData = async () => {
        try {
          const response = await getAllActiveAllocationPreferences(
            clientId,
            invoiceObject?.id
          );
          if (response) {
            setAllocations(response);
          }
        } catch (error) {
          toastr.error(I18n.t("invoice_api_request_failed", ctx));
          // we'll allow a console warning here, as this will log to Datadog.
          // eslint-disable-next-line no-console
          console.warn(I18n.t("invoice_api_request_failed", ctx), { error });
        }
      };
      fetchActiveAllocationData();
    }
  }, [clientId, invoiceObject]);

  const handleAccordionChanging = (onOpenChange) => {
    setOpen(onOpenChange);
    if (onOpenChange) {
      window.analytics?.track("invoice_create_edit_extra_settings_opened", {
        menu_selected: "manage_allocations",
      });
    }
  };

  return (
    <>
      <HnryUIAccordion
        title={
          <div className="tw-justify-start tw-gap-4 tw-flex">
            {I18n.t("title", ctx)} <Badge text="New" />
          </div>
        }
        className="tw-mb-6"
        open={open}
        onOpenChange={handleAccordionChanging}
      >
        <div className="tw-flex tw-flex-col tw-gap-2">
          <AllocationAlert />
          <AllocationsToggleList
            allocationData={allocations}
            setAllocations={setAllocations}
          />
        </div>
      </HnryUIAccordion>
    </>
  );
};

export default ManageAllocations;
