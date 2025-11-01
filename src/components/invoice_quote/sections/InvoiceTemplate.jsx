import React, { useEffect, useRef } from "react";
import classNames from "classnames";
import { useInvoiceQuoteContext } from "../InvoiceQuoteContext";
import Subtotals from "./Subtotals";
import InvoiceHeader from "./InvoiceHeader";
import InvoiceFooter from "./InvoiceFooter";
import InvoiceAndClientDetails from "./InvoiceAndClientDetails";
import LineItemsAndReimbursements from "./LineItemsAndReimbursements";
import I18n, { storeRequiredLocales } from "../../../utilities/translations";

const InvoiceTemplate = ({ showPayNowButton, showPaymentDetails, asPage }) => {
  const invoiceTemplateRef = useRef();

  const {
    salesTaxName,
    otherProps,
    lineItems,
    reimbursments,
    customerRebates,
    currencyOptions,
    invoiceObject,
    includesPriorDeduction,
    invoiceDate,
    dueDate,
    startDate,
    endDate,
    poNumber,
    priorDeductionTotal,
  } = useInvoiceQuoteContext();
  const { invoice_number, status } = invoiceObject;
  const {
    address,
    business_number,
    client,
    client_details,
    custom_logo,
    sales_tax_number,
    hide_address,
    hide_phone_number,
    jurisdiction,
    locale,
    model,
    phone_number,
    showTaxOnTitle,
    trading_name,
    user_name,
  } = otherProps;

  if (locale) {
    storeRequiredLocales(locale);
    I18n.locale = locale;
  }

  // The container's height doesn't collapse in sync with the invoice when it's scaled down with css.
  // Doing this manually to ensure the logo-containing footer is positioned properly below the container.
  useEffect(() => {
    // Need a slight timeout here, because there is a delay between component mounting and
    // the css scale operation taking place.
    const timeoutId = setTimeout(function() {
      const invoiceContainer = document.querySelector("#invoice-quote-container");
      if (invoiceContainer) {
        const invoiceTemplate = document.querySelector(".invoice-template");
        const invoiceHeight = invoiceTemplate.getBoundingClientRect().height;
        invoiceContainer.style.maxHeight = `${invoiceHeight}px`;
      }
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div ref={invoiceTemplateRef} className={classNames("invoice-template scaled", { "!tw-mt-0": status === "SCHEDULED", page: asPage })} >
      <InvoiceHeader
        address={address}
        businessNumber={business_number}
        hideAddress={hide_address}
        hidePhoneNumber={hide_phone_number}
        jurisdiction={jurisdiction}
        locale={locale}
        logo={custom_logo}
        model={model && model.toUpperCase()}
        phoneNumber={phone_number}
        showTaxOnTitle={showTaxOnTitle}
        tradingName={trading_name}
        userName={user_name}
      />
      <InvoiceAndClientDetails
        client={client}
        clientDetails={client_details}
        invoiceNumber={invoice_number}
        salesTaxNumber={sales_tax_number}
        salesTaxName={salesTaxName}
        model={model && `${model.substring(0, 1).toUpperCase()}${model.substring(1)}`}
        {...{
          invoiceDate, dueDate, startDate, endDate, poNumber, jurisdiction,
        }}
      />
      <LineItemsAndReimbursements
        {...{ lineItems, reimbursments, customerRebates, currencyOptions, salesTaxName }}
      />
      <Subtotals
        currencyOptions={currencyOptions}
        hidePriorDeduction={!includesPriorDeduction || priorDeductionTotal === 0}
        model={model}
        status={status}
      />
      <InvoiceFooter
        showPayNowButton={showPayNowButton}
        showPaymentDetails={showPaymentDetails}
        tradingNameOrName={trading_name || user_name}
      />
    </div>
  );
};

export default InvoiceTemplate;
