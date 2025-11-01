import { useEffect } from "react";
import PropTypes from "prop-types";
import { round2Dp } from "../utils/base_helper";
import { useInvoiceQuoteContext } from "./InvoiceQuoteContext";

const ContextLoader = (props) => {
  const {
    setIncludesSalesTax,
    setAllowSalesTaxExemptitems,
    setSalesTaxRate,
    setSalesTaxName,
    setInvoiceObject,
    setIncludesPriorDeduction,
    setPriorDeductionRate,
    setReimbursments,
    setCustomerRebates,
    setOtherProps,
    setLineItems,
    setDueDate,
    setScheduleDate,
    setScheduleTime,
    setInvoiceDate,
    setComments,
    setStartDate,
    setEndDate,
    setPoNumber,
    setDeposit,
    setRecurrenceConfig,
    setStatus,
    setCreditCardFee,
    setAmountPaid,
  } = useInvoiceQuoteContext();

  const { invoice, model } = props;
  const { id } = invoice;

  const formatLineItems = (
    items,
    someItemsAreSalesTaxExempt,
    includesSalesTax,
  ) =>
    items.map((item) => {
      const { service_price, quantity, price, sales_tax } = item;
      let priceAsNumber;
      let quantityAsNumber;
      let salesTax;

      const safeInvoiceItem =
        service_price !== undefined && quantity !== undefined;
      const safeQuoteItem = price !== undefined && quantity !== undefined;

      if (safeInvoiceItem || safeQuoteItem) {
        priceAsNumber = round2Dp(
          parseFloat(service_price) || parseFloat(price) || 0,
        );
        quantityAsNumber = round2Dp(parseFloat(quantity) || 0);
        salesTax = parseFloat(sales_tax) || 0;
      }

      return {
        ...item,
        quantity: quantity === null ? "" : quantityAsNumber,
        service_price: service_price === null ? "" : priceAsNumber,
        total: priceAsNumber * quantityAsNumber || 0,
        sortID: crypto.randomUUID(),
        sales_tax: round2Dp(salesTax),
        // Only set the includes_sales_tax to false if the user has stated that some of their items are sales tax exempt
        // Otherwise, a persisted Invoiceitem with a price of 0 will have 0 sales tax, which will evaluate to false for `includes_sales_tax`
        // which will then prevent sales tax from being added for that InvoiceItem when changed.
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
      sales_tax_rate,
      invoice,
      prior_deduction_rate,
      expenses,
      customer_rebates,
      invoice_items,
      show_sales_tax_toggles,
      po_number,
      invoice_config,
      status,
      gst_type,
      amount_paid,
      credit_card_fee,
      invoice_date,
      due_date,
      schedule_date,
      schedule_time,
      period_start_date,
      period_end_date,
      sales_tax_name,
    } = props;

    const { comments = "", deposit } = invoice;

    const priorDeductionRateAsNumber = parseFloat(prior_deduction_rate);
    const lineItemsWithNumbers = formatLineItems(
      invoice_items,
      show_sales_tax_toggles,
      has_gst,
    );

    const recurrenceConfig = {
      id: invoice_config?.id,
      invoiceId: invoice_config?.invoice_id,
      recurrencePeriod: invoice_config?.recurrence_period,
      recurrenceDay: invoice_config?.recurrence_day,
      recurrenceMaxOccurrences: invoice_config?.recurrence_max_occurrences,
      recursIndefinitely: invoice_config?.recurs_indefinitely,
    };

    setIncludesSalesTax(gst_type !== "ZERO" && has_gst);
    setAllowSalesTaxExemptitems(show_sales_tax_toggles);
    setSalesTaxRate(sales_tax_rate);
    setSalesTaxName(sales_tax_name);
    setInvoiceObject(invoice);
    setIncludesPriorDeduction(!!priorDeductionRateAsNumber);
    setPriorDeductionRate(priorDeductionRateAsNumber);
    setLineItems(lineItemsWithNumbers);
    setReimbursments(expenses);
    setCustomerRebates(customer_rebates);
    setOtherProps({ ...props });
    setComments(comments || "");
    setInvoiceDate(invoice_date ? new Date(invoice_date) : null);
    setDueDate(due_date ? new Date(due_date) : null);
    setScheduleDate(schedule_date ? new Date(schedule_date) : null);
    setScheduleTime(schedule_time || "");
    setStartDate(period_start_date ? new Date(period_start_date) : null);
    setEndDate(period_end_date ? new Date(period_end_date) : null);
    setPoNumber(po_number || "");
    setDeposit(Number(deposit) || 0);
    setRecurrenceConfig(recurrenceConfig);
    setStatus(status);
    setCreditCardFee(Number(credit_card_fee) || 0);
    setAmountPaid(Number(amount_paid) || 0);
  }, []);

  return null;
};

ContextLoader.propTypes = {
  comments: PropTypes.string,
};

export default ContextLoader;
