import React from "react";
import {
  InvoiceQuoteContext,
  useInvoiceQuoteContext,
} from "./InvoiceQuoteContext";
import ContextLoader from "./ContextLoader";
import InvoiceTemplate from "./sections/InvoiceTemplate";

const TemplateWithContext = () => {
  const { invoiceObject, otherProps, internationalClient } = useInvoiceQuoteContext();
  if (invoiceObject) {
    const { model } = otherProps;
    const isQuote = model === "quote";

    return (
      <InvoiceTemplate
        showPayNowButton={!isQuote}
        showPaymentDetails={!isQuote && !internationalClient}
        asPage
      />
    );
  }
  return null;
};

const InvoiceQuoteShow = (props) => (
  <InvoiceQuoteContext {...props}>
    <ContextLoader {...props} />
    <TemplateWithContext />
  </InvoiceQuoteContext>
);

export default InvoiceQuoteShow;
