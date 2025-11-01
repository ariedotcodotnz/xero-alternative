import React, { Fragment, useContext, useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";
import DeductionsToggle from "./deductions_toggle";
import DeductionsForm from "./deductions_form";

const setInitialAmount = (clientDeductedExpense) => {
  if (clientDeductedExpense) {
    if (!Number.isNaN(clientDeductedExpense.value)) {
      if (clientDeductedExpense.value !== null) {
        return parseFloat(clientDeductedExpense.value);
      }
    }
  }
};

const setInitialSalesTaxAmount = (clientDeductedExpense) => {
  if (clientDeductedExpense) {
    if (!Number.isNaN(clientDeductedExpense.salesTaxAmount)) {
      if (clientDeductedExpense.salesTaxAmount !== null) {
        return parseFloat(clientDeductedExpense.salesTaxAmount);
      }
    }
  }
};

const setInitialValueFor = (clientDeductedExpense, key) => {
  if (clientDeductedExpense) {
    return clientDeductedExpense[key];
  }
};

// A Hook that can be used from the Deduction Form Items to easily access the
// Deduction Form data that is stored in context
export const useDeductionsContext = () => useContext(TheDeductionsContext);

// Create the React context that will hold all the form state
const TheDeductionsContext = React.createContext();

// This component represents the entire Deductions form.
// As part of the component the internal state of the form is held in context at the
// top of the component tree, and the context wraps the DeductionsForm component so that
// child components have access to this single-source-of-truth state
const DeductionsWithContext = ({
  deductionOptions,
  locale,
  expenseCategoryOptions,
  deductsExpensesPriorToPayment,
  clientDeductedExpense,
  salesTaxRate,
  ...otherProps
}) => {
  const [deductionType, setDeductionType] = useState();
  const [amount, setAmount] = useState();
  const [includesSalesTax, setIncludesSalesTax] = useState();
  const [salesTaxAmount, setSalesTaxAmount] = useState();
  const [expenseType, setExpenseType] = useState();
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    if (deductionType === "FIXED" && !salesTaxAmount && amount) {
      setSalesTaxAmount(amount * parseFloat(salesTaxRate));
    } else if (deductionType === "PERCENTAGE") {
      setSalesTaxAmount(null);
    }
  }, [deductionType, salesTaxAmount, includesSalesTax, amount]);

  useEffect(() => {
    if (includesSalesTax) {
      setSalesTaxAmount(amount * parseFloat(salesTaxRate));
    } else {
      setSalesTaxAmount(null);
    }
  }, [includesSalesTax]);

  useEffect(() => {
    setDeductionType(
      setInitialValueFor(clientDeductedExpense, "deductionType") ||
        deductionOptions[0][1],
    );
    setAmount(setInitialAmount(clientDeductedExpense));
    setIncludesSalesTax(
      setInitialValueFor(clientDeductedExpense, "includesSalesTax"),
    );
    setSalesTaxAmount(setInitialSalesTaxAmount(clientDeductedExpense));
    setExpenseType(
      setInitialValueFor(clientDeductedExpense, "expenseCategoryId"),
    );
    setIsFormVisible(Boolean(deductsExpensesPriorToPayment));
  }, [clientDeductedExpense]);

  return (
    // The state and props are made available to the rest of the subtree
    // of the Deductions component by passing them in to `value`
    <TheDeductionsContext.Provider
      value={{
        deductionType,
        setDeductionType,
        amount,
        setAmount,
        includesSalesTax,
        setIncludesSalesTax,
        salesTaxAmount,
        setSalesTaxAmount,
        expenseType,
        setExpenseType,
        deductionOptions,
        isFormVisible,
        setIsFormVisible,
        locale,
        expenseCategoryOptions,
        deductsExpensesPriorToPayment,
      }}
    >
      <Deductions {...otherProps} />
    </TheDeductionsContext.Provider>
  );
};

// Light wrapper for the Deductions block.
// It uses the `isFormVisible` value to determine whether to
// animate the form in or not. It also uses the `locale` variable
// as a flag to render the form only after the context has been loaded.
// This prevents context values being `undefined` lower in the component tree
const Deductions = ({ handleClientChange, handleInputChange }) => {
  const { locale, isFormVisible } = useDeductionsContext();

  return (
    locale && (
      <Fragment>
        <DeductionsToggle handleClientChange={handleClientChange} />
        <AnimatePresence>
          {isFormVisible && (
            <DeductionsForm handleInputChange={handleInputChange} />
          )}
        </AnimatePresence>
      </Fragment>
    )
  );
};

export default DeductionsWithContext;
