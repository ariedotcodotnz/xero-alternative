import React, { useEffect, useRef, useState, useMemo } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { AnimatePresence, motion } from "motion/react";
import { handleNumberInputChange, animationDetails } from "./deductions_form";

const NumberInput = ({
  handleInputChange = null,
  amount,
  setAmount,
  deductionType,
  label,
  inputName,
  show = false,
  required = false,
}) => {
  const [internalAmount, setInternalAmount] = useState("");
  const [cleanAmount, setCleanAmount] = useState("");
  const [cursor, setCursor] = useState(0);
  const classes = classNames("md-form required", {
    percentage: deductionType === "PERCENTAGE",
  });
  const inputEl = useRef();

  useEffect(() => {
    if (internalAmount && internalAmount.length > cursor) {
      inputEl.current.setSelectionRange(cursor, cursor);
    }
  }, [cursor]);

  useEffect(() => {
    if (amount) {
      const cleanAmount = Number(cleanDollarAmount(amount));
      const amountWithDecimal = cleanAmount.toFixed(decimalPlaces);

      setInternalAmount(
        deductionType === "FIXED"
          ? `${currencyAmountWithCommas(amountWithDecimal)}`
          : amountWithDecimal,
      );
      setCleanAmount(amountWithDecimal);
    } else {
      setInternalAmount(undefined);
      setCleanAmount(undefined);
    }
  }, [deductionType]);

  const decimalPlaces = useMemo(() => {
    if (deductionType === "PERCENTAGE") {
      return 4;
    }
    return 2;
  }, [deductionType]);

  const handleChange = (e) => {
    const { value, selectionStart } = e.target;
    const cleanValue = cleanDollarAmount(value);
    let formattedAmount = "";

    if (deductionType === "FIXED" && value.length > 0) {
      formattedAmount = formatDollarAmount(
        value,
        cleanValue,
        decimalPlaces,
        selectionStart,
      );

      // put cursor back to its right position
      const newLength = formattedAmount.length;
      const newPos = newLength - value.length + selectionStart;
      setCursor(newPos);
    }

    setInternalAmount(deductionType === "FIXED" ? formattedAmount : cleanValue);
    setCleanAmount(cleanValue);
    handleNumberInputChange(cleanValue, setAmount);
    handleInputChange && handleInputChange(inputName, cleanValue);
  };

  const handleBlur = () => {
    if (amount) {
      const formattedAmount = amount.toFixed(decimalPlaces);

      setInternalAmount(
        deductionType === "FIXED"
          ? `${currencyAmountWithCommas(formattedAmount)}`
          : formattedAmount,
      );
      setCleanAmount(formattedAmount);
    }
  };

  const name = `client[client_deducted_expense_attributes][${inputName}]`;
  const id = `client_client_deducted_expense_attributes_${inputName}`;

  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          className="col-md-5 col-12"
          {...animationDetails}
          key="deduction-amount"
        >
          <div className={classes}>
            <input
              ref={inputEl}
              name={name}
              id={id}
              className="form-control"
              type="text"
              inputMode="decimal"
              value={internalAmount}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={
                deductionType === "FIXED" ? `${currencySymbol()}0.00` : null
              }
              required={required}
            />
            <input type="hidden" name={name} value={cleanAmount} />
            <label htmlFor={id} className="currency-label">
              {label}
            </label>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

NumberInput.propTypes = {
  deductionType: PropTypes.string.isRequired,
  handleInputChange: PropTypes.func,
  label: PropTypes.string.isRequired,
  inputName: PropTypes.string.isRequired,
  show: PropTypes.bool,
  amount: PropTypes.number,
  required: PropTypes.bool,
};

export default NumberInput;
