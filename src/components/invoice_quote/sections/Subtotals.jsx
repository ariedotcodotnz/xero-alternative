import React, {
  useState, useEffect, useMemo, Fragment,
} from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { formatCurrency } from "../../utils/base_helper";
import { useInvoiceQuoteContext } from "../InvoiceQuoteContext";
import { invoiceCurrencyOptionsType } from "../../../types/invoices";

const AMOUNT_DUE_LABEL = "Amount due";
const INVOICE_TOTAL_LABEL = "Invoice total";

// A Component of the Invoice layout that displays the main subtotals for the Invoice
// This includes things such as the subtotal (pre-sales tax), the sales tax amount,
// any prior deduction amount, and then finally the grand total
const Subtotals = ({
  currencyOptions,
  hidePriorDeduction,
  model,
  status,
}) => {
  // Grab the relevant information about the Invoice
  // from the InvoiceQuoteContext as this is the source of truth
  const {
    amountPaid,
    creditCardFee,
    grandTotal,
    includesPriorDeduction,
    invoiceTotalExcludingSalesTax,
    invoiceTotalIncludingSalesTax,
    otherProps,
    priorDeductionRate,
    priorDeductionTotal,
    salesTaxName,
    salesTaxTotal,
  } = useInvoiceQuoteContext();

  const [amountDue, setAmountDue] = useState(0);
  const [clientDeductionAmount, setClientDeductionAmount] = useState(0);

  useEffect(() => {
    if (otherProps) {
      const { client_deduction_type, total_invoice_deduction } = otherProps;

      if (client_deduction_type === "FIXED" || client_deduction_type === "PERCENTAGE") {
        setClientDeductionAmount(total_invoice_deduction * -1);
      }
    } else {
      setClientDeductionAmount(0);
    }
  }, [otherProps]);

  useEffect(() => {
    let newAmount;

    if (clientDeductionAmount !== 0) {
      newAmount = grandTotal + clientDeductionAmount - amountPaid;
    } else {
      newAmount = grandTotal - amountPaid;
    }

    setAmountDue(newAmount < 0 ? 0 : newAmount);
  }, [grandTotal, clientDeductionAmount, amountPaid, setAmountDue]);

  const getLabelForTotal = useMemo(() => {
    if (model === "invoice") {
      if ((hidePriorDeduction || !includesPriorDeduction) && clientDeductionAmount === 0) {
        return AMOUNT_DUE_LABEL;
      }
      return INVOICE_TOTAL_LABEL;
    }

    return "Total estimate";
  }, [
    model,
    hidePriorDeduction,
    includesPriorDeduction,
    clientDeductionAmount,
  ]);

  const getValueForTotal = useMemo(() => {
    if (model === "invoice") {
      // For use in 'total' components as amountPaid is fee-inclusive
      const amountPaidWithoutCreditCardFee = (amountPaid === 0 ? amountPaid : amountPaid - creditCardFee);

      return invoiceTotalIncludingSalesTax - amountPaidWithoutCreditCardFee;
    }

    return invoiceTotalIncludingSalesTax;
  }, [
    model,
    hidePriorDeduction,
    includesPriorDeduction,
    amountPaid,
    creditCardFee,
    invoiceTotalIncludingSalesTax,
  ]);

  // The fundamental elements that make up the Subtotals component
  // These elements will always be shown in this Component
  let baseValues = [
    { title: `Subtotal (excl ${salesTaxName ?? ""})`, value: invoiceTotalExcludingSalesTax },
    { title: `Total ${salesTaxName ?? ""}`, value: salesTaxTotal },
  ];

  // Extra extra values to show how much of an Invoice has been paid
  // and the credit card fee amount
  if (creditCardFee > 0) {
    const cardFee = { title: "Card Convenience Fee", value: creditCardFee };

    baseValues = [...baseValues,cardFee];
  }

  if (amountPaid > 0) {
    const paidAmount = { title: "Paid", value: -amountPaid, bold: true, includeCode: false };

    baseValues = [...baseValues, paidAmount];
  }

  baseValues = [
    ...baseValues,
    {
      title: getLabelForTotal,
      value: getValueForTotal,
      bold: amountPaid <= 0,
      invalid: status === "DRAFT" ? getValueForTotal < 0 : false,
      includeCode: true,
    },
  ];

  // Extra values which are conditionally shown in the
  // Subtotals component. Things such as the grand total
  // and any prior deduction amount are only shown in some cases
  let extraValues = [];

  // witholding tax amount
  if (priorDeductionTotal != 0) {
    // Convert the deduction rate (e.g: 0.1) to a percentage (e.g: 10%)
    const priorDeductionPercentage = (priorDeductionRate * 100 || 0).toFixed(1);

    extraValues = [
      {
        title: `Withholding tax (${priorDeductionPercentage}% of Income)`,
        value: priorDeductionTotal,
      },
    ];
  }

  // client deducted amount
  if (clientDeductionAmount !== 0) {
    extraValues = [
      ...extraValues,
      {
        title: "Expenses deducted by client",
        value: clientDeductionAmount,
      },
    ];
  }

  // amount due
  extraValues = [
    ...extraValues,
    {
      title: AMOUNT_DUE_LABEL,
      value: amountDue,
      bold: true,
    },
  ];

  // Merge the two sets of values and labels together
  // based on the `hidePriorDeduction` prop, which is set
  // in the parent component. In the InvoiceForm the prior
  // deduction amount is never shown, so it is enforced here
  let allValues = [];

  if (hidePriorDeduction && clientDeductionAmount === 0) {
    allValues = [...baseValues];
  } else {
    allValues = [...baseValues, ...extraValues];
  }

  // - loop over all the values in `allValues`
  // - create a line in the format `label`: `value`, for example: "Subtotal: $100"
  //   - the `value` is formatted as a currency
  //   - using the `bold` property wrap the `label` and `value` in strong tags if true
  //   - if the priorDeduction supposed to be shown, then set the color of the final
  //     line to be $color-primary
  return (
    <section className="col-12 col-sm-7 col-lg-6 ml-auto p-0 mt-2">
      {allValues.map(
        ({
          title, value, bold, invalid, includeCode = false,
        }) => {
          const className = classNames({
            "tw-text-brand-green-800": !invalid && title === AMOUNT_DUE_LABEL,
            "tw-text-red-600": invalid,
            "tw-font-semibold": bold,
          });

          return (
            <Fragment key={`subtotals-${title}`}>
              <div className={classNames("tw-flex tw-justify-between", { "tw-mb-2": !invalid, "tw-mb-1": invalid })}>
                <div className={className}>{title}:</div>
                <div className={className}>
                  {formatCurrency(value, { ...currencyOptions, include_code: includeCode })}
                </div>
              </div>
              {invalid && (
                <div className="tw-text-red-600 tw-text-xs tw-mb-4">
                  {`${getLabelForTotal} cannot be negative, please review your discount amount`}
                </div>
              )}
            </Fragment>
          );
        },
      )}
    </section>
  );
};

Subtotals.propTypes = {
  currencyOptions: invoiceCurrencyOptionsType,
  hidePriorDeduction: PropTypes.bool.isRequired,
  model: PropTypes.string.isRequired,
  status: PropTypes.string,
};

export default Subtotals;
