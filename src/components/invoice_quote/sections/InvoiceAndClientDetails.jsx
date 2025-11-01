import React, { useMemo } from "react";
import { format } from "date-fns";

const InvoiceAndClientDetails = ({
  client, clientDetails, invoiceNumber, invoiceDate, dueDate, salesTaxNumber, salesTaxName, startDate, endDate, poNumber, model, jurisdiction,
}) => {
  const items = useMemo(() => (
    [
      { label: model === "Invoice" ? "Invoice number" : "Quote ref", value: invoiceNumber },
      { label: `${salesTaxName ?? ""} number`, value: salesTaxNumber },
      { label: `${model} date`, value: invoiceDate instanceof Date && format(invoiceDate, "dd/MM/yyyy") },
      { label: model === "Invoice" ? "Payment due" : "Expiry date", value: dueDate instanceof Date && format(dueDate, "dd/MM/yyyy") },
      { label: "PO number", value: poNumber },
    ].filter(({ label }) => (jurisdiction === "au" ? label !== "GST number" : true))
  ), [invoiceNumber, salesTaxNumber, invoiceDate, dueDate, poNumber, jurisdiction]);

  const periodDates = useMemo(() => (
    [
      { label: "Period Start", value: startDate instanceof Date ? format(startDate, "dd/MM/yyyy") : "" },
      { label: "Period End", value: endDate instanceof Date ? format(endDate, "dd/MM/yyyy") : "" },
    ]
  ), [startDate, endDate]);

  return (
    <section className="row justify-content-between mb-3">
      <div className="col-12 col-sm-6 mb-2">
        <strong>{client}</strong>
        {clientDetails && clientDetails.map((detail, index) => (
          <div key={`client-details-${index}`}>
            {detail}
          </div>
        ))}
      </div>
      <div className="col-12 col-sm-5 col-md-5 col-lg-4">
        {items.map(({ label, value }, index) => value && (
            <div className="d-flex justify-content-between" key={`${label}-${value}`}>
              <div>{index === 0 ? <strong>{label}:</strong> : `${label}:`}</div>
              <div>{index === 0 ? <strong>{value}</strong> : `${value}`}</div>
            </div>
        ))}
        {(startDate || endDate) && (
          <div className="mt-1">
            {periodDates.map(({ label, value }) => value && (
                <div className="d-flex justify-content-between" key={`${label}-${value}`}>
                  <div>{label}:</div>
                  <div>{value}</div>
                </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default InvoiceAndClientDetails;
