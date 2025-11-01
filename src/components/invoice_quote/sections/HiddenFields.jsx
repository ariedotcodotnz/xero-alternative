import React from "react";
import { useInvoiceQuoteContext } from "../InvoiceQuoteContext";

const HiddenFields = () => {
  const {
    formNameFor, otherProps, currencyOptions, invoiceObject, grandTotal, lineItemTotalExcludingSalesTax, deposit,
  } = useInvoiceQuoteContext();

  return (
    otherProps ? (
      <div className="hidden-fields">
        {invoiceObject.id && <input type="hidden" name="id" value={invoiceObject.id} />}
        <input type="hidden" name={formNameFor("client_id")} value={otherProps.client_id} />
        <input type="hidden" name={formNameFor("total")} value={lineItemTotalExcludingSalesTax} />
        <input type="hidden" name={formNameFor("status")} value={otherProps.status} />
        <input type="hidden" name={formNameFor("currency_code")} value={currencyOptions.code} />
        <input type="hidden" name={formNameFor("current_max_order")} value={invoiceObject.current_max_order} />
        <input type="hidden" name={formNameFor("access_token")} value={invoiceObject.access_token} />
        <input type="hidden" name={formNameFor("has_gst")} value={otherProps.has_gst} />
        <input type="hidden" name={formNameFor("invoice_number")} value={invoiceObject.invoice_number} />
        <input type="hidden" name={formNameFor("deposit")} value={deposit} />
        <input type="hidden" name={formNameFor("hide_phone_number")} value={otherProps.hide_phone_number} />
      </div>
    ) : null
  );
};

export default HiddenFields;
