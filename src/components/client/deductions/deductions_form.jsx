import React, { useEffect } from "react";
import { motion } from "motion/react";
import PropTypes from "prop-types";
import InfoBox from "../../info_box";
import { useDeductionsContext } from "./deductions";
import NumberInput from "./NumberInput";
import DeductionType from "./DeductionType";
import ExpenseCategory from "./ExpenseCategory";
import IncludesSalesTax from "./IncludesSalesTax";
import I18n from "../../../utilities/translations";

// A helper function that is used in setting the `amount` and `salesTaxAmount`
// values. It stores the incoming value to a string before saving it in context
// and resets the value appropriately if its not a number
export const handleNumberInputChange = (value, handler) => {
  if (value === "") {
    handler("");
  } else if (isNaN(value)) {
    handler(0);
  } else {
    handler(parseFloat(value));
  }
};

// Animation properties that Framer expects. Since all the animations in the
// form are the same, by saving them in a variable here they can just be spread
// on to the `motion.div` to reduce code duplication
export const animationDetails = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: "auto" },
  exit: { opacity: 0, height: 0 },
  transition: { duration: 0.3 },
};

const DeductionsForm = ({ handleInputChange = null }) => {
  const {
    salesTaxAmount,
    amount,
    deductionType,
    setAmount,
    includesSalesTax,
    setSalesTaxAmount,
  } = useDeductionsContext();

  // When the component mounts, use `Materialize` (which is part of MDB)
  // to format input labels appropriately since we don't get this for free
  // when mounting and unmounting elements from the DOM with React
  useEffect(() => {
    if (Materialize && Materialize.updateTextFields) {
      Materialize.updateTextFields();
    }
  }, [salesTaxAmount, amount]);

  return (
    <motion.div
      {...animationDetails}
      key="deductions-form"
      className="toggle-indent"
    >
      {deductionType === "VARIABLE" && (
        <InfoBox
          body={I18n.t("clients.form.prior_deductions.variable_alert_text")}
          learnMoreLink={I18n.t("clients.form.prior_deductions.tooltip.link")}
          style="primary"
          otherClasses="mb-3"
        />
      )}
      <div className="row">
        <DeductionType handleInputChange={handleInputChange} />
        <NumberInput
          handleInputChange={handleInputChange}
          amount={amount}
          setAmount={setAmount}
          deductionType={deductionType}
          label={
            deductionType === "FIXED" ? "Total Amount" : "Percentage deducted"
          }
          inputName="value"
          show={deductionType !== "VARIABLE"}
          required
        />
      </div>
      <div className="row">
        <IncludesSalesTax handleInputChange={handleInputChange} />
        <NumberInput
          deductionType={deductionType}
          handleInputChange={handleInputChange}
          amount={salesTaxAmount}
          setAmount={setSalesTaxAmount}
          label={`${I18n.t("global.sales_tax")} Amount`}
          inputName="sales_tax_amount"
          show={deductionType === "FIXED" && includesSalesTax}
          required={deductionType === "FIXED" && includesSalesTax}
        />
      </div>
      <div className="row">
        <ExpenseCategory handleInputChange={handleInputChange} />
      </div>
    </motion.div>
  );
};

DeductionsForm.propTypes = {
  handleInputChange: PropTypes.func,
};

export default DeductionsForm;
