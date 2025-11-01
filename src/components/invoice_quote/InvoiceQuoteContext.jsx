import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

// A React context component that can store data at a high
// position in the component tree. This data can then be pulled in by
// individual components as required using the useInvoiceQuoteContext() hook
const TheInvoiceQuoteContext = createContext();

// The hook that can be imported and used in different components
export const useInvoiceQuoteContext = () => useContext(TheInvoiceQuoteContext);

// An implimentation of the context provider which does all the heavy lifting
// that we want. The internal state and calculations are stored in this component.
// The three main parts of the logic here are:
//
// - State   -> store the key data points in state here to cut down on prop-drilling
//              and to separate the logic from the UI
// - Effects -> using Hooks, we can run calculations every time a stateful value changes
//              (such as re-calculating the total when a line item changes)
// - Render  -> This component returns a provider of TheInvoiceQuoteContext with all the
//              stateful data passed in to be used by any child component
export const InvoiceQuoteContext = (propsWithChildren) => {
  const { children, ...props } = propsWithChildren;

  // Core Invoice elements
  const [lineItems, setLineItems] = useState([]);
    // Keep track of which existing LineItems have been removed, so they can be destroyed on the server
  const [removedLineItems, setRemovedLineItems] = useState([]);
  const [reimbursments, setReimbursments] = useState([]);
  const [customerRebates, setCustomerRebates] = useState([]);
  const [untaxedDepositAccepted, setUntaxedDepositAccepted] = useState(false);

  // Dates
  const [invoiceDate, setInvoiceDate] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [dueDate, setDueDate] = useState();
  const [scheduleDate, setScheduleDate] = useState();

  // Time
  const [scheduleTime, setScheduleTime] = useState();

  // Misc Invoice state items
  const [comments, setComments] = useState();
  const [status, setStatus] = useState();
  const [deposit, setDeposit] = useState(0);
  const [hidePhoneNumber, setHidePhoneNumber] = useState(false);
  const [poNumber, setPoNumber] = useState();

  // Extra rates that may be included on top of the lineItem and reimbursement amounts
  const [includesSalesTax, setIncludesSalesTax] = useState(false);
  const [allowSalesTaxExemptItems, setAllowSalesTaxExemptitems] =
    useState(false);
  const [salesTaxRate, setSalesTaxRate] = useState(0);
  const [salesTaxName, setSalesTaxName] = useState("");
  const [includesPriorDeduction, setIncludesPriorDeduction] = useState(false);
  const [priorDeductionRate, setPriorDeductionRate] = useState(0);

  // Configuration data from Rails
  const [invoiceObject, setInvoiceObject] = useState();
  const [otherProps, setOtherProps] = useState();

  // Recurrence configuration
  const [recurrenceConfig, setRecurrenceConfig] = useState();

  // Computed sales tax inclusive/exclusive totals
  const [lineItemTotalIncludingSalesTax, setLineItemTotalIncludingSalesTax] = useState(0);
  const [lineItemTotalExcludingSalesTax, setLineItemTotalExcludingSalesTax] = useState(0);
  const [reimbursementsTotalIncludingSalesTax, setReimbursementsTotalIncludingSalesTax] = useState(0);
  const [reimbursementsTotalExcludingSalesTax, setReimbursementsTotalExcludingSalesTax] = useState(0);
  const [customerRebatesTotalIncludingSalesTax, setCustomerRebatesTotalIncludingSalesTax] = useState(0);
  const [customerRebatesTotalExcludingSalesTax, setCustomerRebatesTotalExcludingSalesTax] = useState(0);
  const [invoiceTotalIncludingSalesTax, setInvoiceTotalIncludingSalesTax] = useState(0);
  const [invoiceTotalExcludingSalesTax, setInvoiceTotalExcludingSalesTax] = useState(0);

  // Other totals
  const [salesTaxTotal, setSalesTaxTotal] = useState(0);
  const [priorDeductionTotal, setPriorDeductionTotal] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);
  const [creditCardFee, setCreditCardFee] = useState(0);

  // Recalculate all the total on each render
  useEffect(() => {
    updateLineItemTotals();
    calculateInvoiceTotals();
    calculateGrandTotal();
    calculateSalesTaxTotal();
    calculatePriorDeductionTotal();
  });

  // Whenever the number of reimbursements changes (mainly just on mount)
  // format and calculate the sales tax inclusive/exclusive totals
  useEffect(() => {
    formatAndSortReimbursements(reimbursments);
  }, [reimbursments.length]);

  // Whenever the number of reimbursements changes (mainly just on mount)
  // format and calculate the sales tax inclusive/exclusive totals
  useEffect(() => {
    formatAndSortCustomerRebates(customerRebates);
  }, [customerRebates.length]);

  // Iterates over each line item and determines the sales tax inclusive/exclusive totals
  const updateLineItemTotals = () => {
    if (lineItems.length) {
      const exclusiveTotal = lineItems
        .map(({ total }) => total)
        .reduce((acc, curr) => acc + curr) || 0;
      const salesTaxTotal = lineItems
        .map(({ sales_tax }) => parseFloat(sales_tax) || 0)
        .reduce((acc, curr) => acc + curr) || 0;
      const inclusiveTotal = exclusiveTotal + salesTaxTotal;

      setLineItemTotalExcludingSalesTax(exclusiveTotal);
      setLineItemTotalIncludingSalesTax(inclusiveTotal);
    } else {
      // If there are no line items, set both to 0
      setLineItemTotalExcludingSalesTax(0);
      setLineItemTotalIncludingSalesTax(0);
    }
  };

  // A helper function that allows a single line item to be updated with a new one
  const updateListItem = (updatedItem) => {
    // Find the item to update by it's order
    const withUpdatedItem = lineItems.map((item) => {
      if (item.order === updatedItem.order) {
        return updatedItem;
      }
      return item;
    });
    // Save the change in state
    setLineItems(withUpdatedItem);
  };

  const formatSortAndSumExpenses = (expenses) => {
    if (expenses.length) {
      // First parse the date and number values
      // Then sort the Reimbursements by Date (earliest ones first)
      const sortedExpenses = expenses.map((expense) => ({
        ...expense,
        gst_exclusive_cost: parseFloat(expense.gst_exclusive_cost),
        gst_inclusive_cost: parseFloat(expense.gst_inclusive_cost),
        expense_date: new Date(expense.expense_date),
      })).sort((a, b) =>(a.expense_date >= b.expense_date ? 1 : -1));

      // Sum the sales tax inclusive/exclusive amounts
      const inclusiveTotal = sumExpenses(sortedExpenses, "gst_inclusive_cost");
      const exclusiveTotal = sumExpenses(sortedExpenses, "gst_exclusive_cost");

      return {
        sortedExpenses,
        exclusiveTotal,
        inclusiveTotal,
      };
    }

    return null;
  };

  /**
   *
   * @param {*} property
   * @param {*} expenses
   */
  const sumExpenses = (expenses, property) => expenses.map((expense) => expense[property]).reduce((acc, curr) => acc + curr)

  // Formats the incoming date string as as JS Date, parses the
  // sales tax inclusive/exclusive costs as numbers,
  // then saves it in state
  const formatAndSortReimbursements = useCallback((reimbursments) => {
    const result = formatSortAndSumExpenses(reimbursments)
    if (result !== null) {
      const { sortedExpenses, exclusiveTotal, inclusiveTotal } = result
      setReimbursments(sortedExpenses);
      setReimbursementsTotalExcludingSalesTax(exclusiveTotal);
      setReimbursementsTotalIncludingSalesTax(inclusiveTotal);
    }
  }, [reimbursments]);

  // Formats the incoming date string as as JS Date, parses the
  // sales tax inclusive/exclusive costs as numbers,
  // then saves it in state
  const formatAndSortCustomerRebates = useCallback((customerRebates) => {
    const result = formatSortAndSumExpenses(customerRebates)
    if (result !== null) {
      const { sortedExpenses, exclusiveTotal, inclusiveTotal } = result
      setCustomerRebates(sortedExpenses);
      setCustomerRebatesTotalExcludingSalesTax(exclusiveTotal);
      setCustomerRebatesTotalIncludingSalesTax(inclusiveTotal);
    }
  }, [customerRebates]);

  // Calculates the invoice totals including/excluding sales tax
  // This is just the total of the line items + reimbursements total + customer rebates total
  const calculateInvoiceTotals = () => {
    setInvoiceTotalIncludingSalesTax(lineItemTotalIncludingSalesTax + reimbursementsTotalIncludingSalesTax + customerRebatesTotalIncludingSalesTax);
    setInvoiceTotalExcludingSalesTax(lineItemTotalExcludingSalesTax + reimbursementsTotalExcludingSalesTax + customerRebatesTotalExcludingSalesTax);
  };

  // Calculates the total sales tax on the entire Invoice (includes reimbursements)
  const calculateSalesTaxTotal = () => {
    const salesTaxFromLineItems = lineItemTotalIncludingSalesTax - lineItemTotalExcludingSalesTax;
    const salesTaxFromReimbursements = reimbursementsTotalIncludingSalesTax - reimbursementsTotalExcludingSalesTax;

    setSalesTaxTotal(salesTaxFromLineItems + salesTaxFromReimbursements);
  };

  // Calculates the full payable amount for the Invoice
  const calculateGrandTotal = () => {
    setGrandTotal(lineItemTotalIncludingSalesTax + reimbursementsTotalIncludingSalesTax + customerRebatesTotalIncludingSalesTax + priorDeductionTotal);
  };

  // Calculates the amount that should be deducted prior to paying the Invoice
  // (i.e.: Withholding Tax)
  const calculatePriorDeductionTotal = () => {
    setPriorDeductionTotal(((invoiceTotalExcludingSalesTax - reimbursementsTotalExcludingSalesTax - customerRebatesTotalExcludingSalesTax) * priorDeductionRate) * -1);
  };

  const formNameFor = (field, { nestedAtributeFor, index } = {}) => {
    let name = props.model;
    if (nestedAtributeFor) {
      name = `${name}[${nestedAtributeFor}]`;
      if (index || index === 0) {
        name = `${name}[${index}][${field}]`;
      }
    } else {
      name = `${name}[${field}]`;
    }
    return name;
  };

  // timeZone is only available on invoices, not quotes
  const timeZoneWithBrowsertime = props.timeZone && {
    ...props.timeZone,
    browserInTimezone:
      Intl.DateTimeFormat().resolvedOptions().timeZone ===
        props.timeZone.tzdataName || false,
  };
  const invoiceOrQuoteObject = props.invoice || props.quote;

  const inputPriceCurrencySign = props.invoice_currency_options?.symbol || props.currencyOptions?.symbol || null;

  return (
    <TheInvoiceQuoteContext.Provider
      value={{
        lineItems,
        setLineItems,
        removedLineItems,
        setRemovedLineItems,
        updateListItem,
        reimbursments,
        client: props.client,
        clientId: props.client_id,
        customerRebates,
        setReimbursments,
        setCustomerRebates,
        includesSalesTax,
        setIncludesSalesTax,
        allowSalesTaxExemptItems,
        setAllowSalesTaxExemptitems,
        salesTaxRate,
        setSalesTaxRate,
        salesTaxName,
        setSalesTaxName,
        invoiceObject,
        setInvoiceObject,
        includesPriorDeduction,
        setIncludesPriorDeduction,
        priorDeductionRate,
        setPriorDeductionRate,
        salesTaxTotal,
        setSalesTaxTotal,
        grandTotal,
        setGrandTotal,
        priorDeductionTotal,
        setPriorDeductionTotal,
        otherProps,
        setOtherProps,
        lineItemTotalIncludingSalesTax,
        lineItemTotalExcludingSalesTax,
        reimbursementsTotalIncludingSalesTax,
        reimbursementsTotalExcludingSalesTax,
        customerRebatesTotalIncludingSalesTax,
        customerRebatesTotalExcludingSalesTax,
        invoiceTotalIncludingSalesTax,
        invoiceTotalExcludingSalesTax,
        invoiceDate,
        setInvoiceDate,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        dueDate,
        setDueDate,
        scheduleDate,
        setScheduleDate,
        scheduleTime,
        setScheduleTime,
        comments,
        setComments,
        status,
        setStatus,
        deposit,
        setDeposit,
        hidePhoneNumber,
        setHidePhoneNumber,
        poNumber,
        setPoNumber,
        recurrenceConfig,
        setRecurrenceConfig,
        formNameFor,
        amountPaid,
        setAmountPaid,
        creditCardFee,
        setCreditCardFee,
        timeZone: timeZoneWithBrowsertime,
        now: new Date(props.now),
        defaultDueDateDays: props.defaultDueDateDays,
        currencyOptions: props.invoice_currency_options,
        inputPriceCurrencySign,
        services: props.services,
        model: props.model,
        modelId: invoiceOrQuoteObject.id,
        invoiceClientSelected: props.invoice_client_selected,
        hideLegalName: props.hide_legal_name,
        untaxedDepositAccepted,
        setUntaxedDepositAccepted,
        internationalClient: props.international_client
      }}
    >
      {children}
    </TheInvoiceQuoteContext.Provider>
  );
};
