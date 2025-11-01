import React from "react";
import { formatCurrency } from "../utils/base_helper";
import { getFormData } from "../utils/InvoicesHelper";
import { useInvoiceQuoteContext } from "../invoice_quote/InvoiceQuoteContext";
import Button from "../_atoms/button/Button";

const ClientReimbursments = ({ clientId, showAddNewButton }) => {
  const { reimbursments, currencyOptions, invoiceObject } = useInvoiceQuoteContext();

  const handleAddExpense = () => {
    const confirmationMessage = "You will be redirected to the expenses page and your invoice will be saved as DRAFT";
    const expenseURL = `${Routes.new_expense_path()}?type=client_chargeable&client_id=${clientId}`;

    // eslint-disable-next-line no-alert
    if (confirm(confirmationMessage)) {
      const formData = getFormData($(document.forms[0]));
      const { id } = invoiceObject;
      $.ajax({
        type: id ? "PATCH" : "POST",
        url: id ? Routes.invoice_path(id) : Routes.invoices_path(),
        data: formData,
        success: () => Turbolinks.visit(expenseURL),
      });
    }
  };

  return (
    reimbursments && reimbursments.length ? 
      <>
        <h2 className="tw-text-base tw-font-medium tw-leading-6 tw-text-gray-800 !tw-mb-2">
          Client Reimbursements
        </h2>
        {reimbursments.map((item, index) => (
          <section className="row form-expenses mx-0" key={`reimbursment-${index}`}>
            <div className="col-9 pt-1 pb-1 text-left">{item.receipt_description}</div>
            <div className="col-3 pt-1 pb-1 text-right">{formatCurrency(item.gst_inclusive_cost, currencyOptions)}</div>
          </section>
        ))}
      </> : (
        <section className="links tw-mt-5 tw-mb-2">
          {showAddNewButton && 
            <Button
              variant="link"
              classes="tw-max-w-fit"
              iconType="PlusIcon"
              iconEnd
              onClick={() => handleAddExpense()}
            >
              Add Client Reimbursement
            </Button>
          }
        </section>
      )
  );
};

export default ClientReimbursments;
