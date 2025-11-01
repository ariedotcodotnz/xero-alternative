import React from "react";

const InvoiceLink = ({ btnText }) => (
  <p className="invoice-quote-email-text">
    <button type="button" className="tw-pl-0 invoice-quote-email-link" disabled>
      {btnText}
    </button>
  </p>
);

export default InvoiceLink;
