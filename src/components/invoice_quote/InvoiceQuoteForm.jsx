import React, { useEffect } from "react";
import { round2Dp } from "../utils/base_helper";
import {
  InvoiceQuoteContext,
  useInvoiceQuoteContext,
} from "./InvoiceQuoteContext";
import LineItems from "./line_items/LineItems";
import Subtotals from "./sections/Subtotals";
import NotSendingWarning from "./sections/NotSendingWarning";

const InvoiceQuoteForm = (props) => {
  const {
    readonly,
    lineItemsAttributesName,
    model,
    currencyOptions,
    invoice_client_selected,
    client,
    status,
  } = props;
  return (
    <div>
      <InvoiceQuoteContext {...props}>
        <ContextLoader {...props} />
        <HiddenFields />
        <div className="tw-mb-8">
          <h2 className="tw-text-base tw-font-medium tw-leading-6 tw-text-gray-800 !tw-mb-0">
            Line items
          </h2>
          <LineItems
            readonly={readonly}
            lineItemsAttributesName={lineItemsAttributesName}
            model={model}
          />
        </div>
        <div className="tw-mb-12">
          <Subtotals
            currencyOptions={currencyOptions}
            hidePriorDeduction
            model={model}
            status={status}
          />
        </div>
        <NotSendingWarning
          client={client}
          invoiceClientSelected={invoice_client_selected}
        />
      </InvoiceQuoteContext>
    </div>
  );
};

const ContextLoader = (props) => {
  const {
    setIncludesSalesTax,
    setSalesTaxRate,
    setSalesTaxName,
    setInvoiceObject,
    setIncludesPriorDeduction,
    setPriorDeductionRate,
    setReimbursments,
    setOtherProps,
    setLineItems,
    setAllowSalesTaxExemptitems,
    setStatus,
  } = useInvoiceQuoteContext();

  const { quote, model } = props;
  const { id } = quote;

  const formatLineItems = (
    items,
    someItemsAreSalesTaxExempt,
    includesSalesTax
  ) =>
    items.map((item) => {
      const { quantity, price, sales_tax } = item;
      let priceAsNumber;
      let quantityAsNumber;
      let salesTax;

      if (price !== undefined && quantity !== undefined) {
        priceAsNumber = round2Dp(parseFloat(price) || 0);
        quantityAsNumber = round2Dp(parseFloat(quantity) || 0);
        salesTax = parseFloat(sales_tax) || 0;
      }

      return {
        ...item,
        quantity: quantity === null ? "" : quantityAsNumber,
        service_price: price === null ? "" : priceAsNumber,
        total: priceAsNumber * quantityAsNumber || 0,
        sortID: crypto.randomUUID(),
        sales_tax: round2Dp(salesTax),
        includes_sales_tax: someItemsAreSalesTaxExempt
          ? Boolean(salesTax)
          : includesSalesTax,
        modelId: id,
        model,
      };
    });

  useEffect(() => {
    const {
      has_gst,
      salesTaxRate,
      quote,
      priorDeductionRate,
      quoteItems,
      showSalesTaxToggles,
      gst_type,
      status,
      salesTaxName,
    } = props;

    const priorDeductionRateAsNumber = parseFloat(priorDeductionRate);
    const lineItemsWithNumbers = formatLineItems(
      quoteItems,
      showSalesTaxToggles,
      has_gst
    );

    setIncludesSalesTax(gst_type !== "ZERO" && has_gst);
    setSalesTaxRate(salesTaxRate);
    setSalesTaxName(salesTaxName);
    setInvoiceObject(quote);
    setIncludesPriorDeduction(!!priorDeductionRateAsNumber);
    setPriorDeductionRate(priorDeductionRateAsNumber);
    setLineItems(lineItemsWithNumbers);
    setReimbursments([]);
    setAllowSalesTaxExemptitems(showSalesTaxToggles);
    setOtherProps({ ...props });
    setStatus(status);
  }, []);

  return null;
};

const HiddenFields = () => {
  const { currencyOptions, grandTotal, formNameFor, model } =
    useInvoiceQuoteContext();

  useEffect(() => {
    const submitButton = document.querySelector(
      ".hnry-button.hnry-button--primary[type='submit']"
    );

    if (model === "quote" && submitButton !== null) {
      submitButton.disabled = grandTotal <= 0;
    }
  }, [model, grandTotal]);

  return currencyOptions ? (
    <input type="hidden" name={formNameFor("total")} value={grandTotal} />
  ) : null;
};

export default InvoiceQuoteForm;
