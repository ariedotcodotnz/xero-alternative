import React, { useState } from "react";

import { InvoiceQuoteContext } from "../invoice_quote/InvoiceQuoteContext";
import LineItems from "../invoice_quote/line_items/LineItems";
import ClientReimbursments from "./ClientReimbursments";
import Subtotals from "../invoice_quote/sections/Subtotals";
import HiddenFields from "../invoice_quote/sections/HiddenFields";
import InvoiceEmailModal from "../_organisms/invoice_quote_email/InvoiceEmailModal";
import ContextLoader from "../invoice_quote/ContextLoader";

import SettingsAndFooter from "./SettingsAndFooter";

import { timeZoneType } from "../../types";
import { invoiceFormTextType } from "../../types/invoices";

const InvoiceForm = (props) => {
  const {
    client_id,
    client,
    deposits_notification_dismissed,
    invoice,
    invoice_client_selected,
    invoice_currency_options,
    is_impersonating,
    lineItemsAttributesName,
    model,
    client_name,
    status,
    text,
    timeZone,
    trading_name,
    user_name,
    invoiceMessage,
    invoice_can_be_sent,
    showManageAllocationsAccordion,
  } = props;

  const timeZoneWithBrowsertime = {
    ...timeZone,
    browserInTimezone:
      Intl.DateTimeFormat().resolvedOptions().timeZone ===
        timeZone.tzdataName || false,
  };

  // This will be use for open the new InvoiceEmailModal
  const [openInvoiceEmail, setOpenInvoiceEmail] = useState(false);

  const handleInvoiceEmailClick = () => {
    setOpenInvoiceEmail(!openInvoiceEmail);
  }

  return (
    <InvoiceQuoteContext {...props}>
      <ContextLoader {...props} />
      <div className="tw-mt-4">
        <h2 className="tw-text-base tw-font-medium tw-leading-6 tw-text-gray-900 tw-mb-8 md:tw-hidden">
          Invoice for: <span className="tw-font-normal">{client}</span>
        </h2>
        <div className="tw-mb-12">
          <div className="tw-mb-4">
            <h2 className="tw-text-base tw-font-medium tw-leading-6 tw-text-gray-800 !tw-mb-0">
              {text.invoice_items}
            </h2>
            <LineItems
              lineItemsAttributesName={lineItemsAttributesName}
              model={model}
            />
          </div>
          <div className="tw-mb-8">
            <ClientReimbursments
              clientId={client_id}
              showAddNewButton={status !== "SENT"}
            />
          </div>
          <div className="tw-mb-12">
            <Subtotals
              currencyOptions={invoice_currency_options}
              hidePriorDeduction
              model={model}
              status={status}
            />
          </div>
        </div>
        <SettingsAndFooter
          advancedSettingsOpen={!!parseFloat(invoice.deposit)}
          client={client}
          currencySymbol={invoice_currency_options.symbol}
          depositsNotificationDismissed={deposits_notification_dismissed}
          showDepositDefault={!!parseFloat(invoice.deposit)}
          invoiceClientSelected={invoice_client_selected}
          invoiceStatus={status}
          isImpersonating={is_impersonating}
          handleInvoiceEmailClick={handleInvoiceEmailClick}
          invoiceCanBeSent={invoice_can_be_sent}
          showManageAllocationsAccordion={showManageAllocationsAccordion}
        />
        <InvoiceEmailModal
          client={client}
          clientName={client_name}
          invoiceClientSelected={invoice_client_selected}
          timeZone={timeZoneWithBrowsertime}
          tradingName={trading_name}
          userName={user_name}
          open={openInvoiceEmail}
          setOpen={setOpenInvoiceEmail}
          invoiceMessage={invoiceMessage}
        />
        <HiddenFields />
      </div>
    </InvoiceQuoteContext>
  );
};

InvoiceForm.propTypes = {
  timeZone: timeZoneType,
  text: invoiceFormTextType,
};

export default InvoiceForm;
