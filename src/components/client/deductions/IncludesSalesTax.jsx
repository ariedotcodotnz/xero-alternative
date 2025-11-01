import React from "react";
import PropTypes from "prop-types";
import { AnimatePresence, motion } from "motion/react";
import { useDeductionsContext } from "./deductions";
import { animationDetails } from "./deductions_form";
import I18n from "../../../utilities/translations";

// Represents the form item where a user specifies whether the Deduction includes sales tax or not
// It renders a couple of radio buttons to reflect their choice
const IncludesSalesTax = ({ handleInputChange = null }) => {
  // Get the relevant variables and functions form the context
  const { includesSalesTax, setIncludesSalesTax, deductionType } =
    useDeductionsContext();

  const handleIncludesSalesTaxChange = (value) => {
    setIncludesSalesTax(value);
    if (handleInputChange) {
      handleInputChange("includesSalesTax", value);
    }
  };

  return (
    <AnimatePresence initial={false}>
      {deductionType !== "VARIABLE" && (
        <motion.div
          {...animationDetails}
          className="col-md-7 col-12"
          key="deduction-includes-sales-tax"
        >
          <div className="md-form required">
            <fieldset>
              <legend>
                {/* Change the label used for the input based on the `deductionType` */}
                {deductionType === "FIXED"
                  ? `Is ${I18n.t("global.sales_tax")} included in this amount?`
                  : `Does this deduction have ${I18n.t(
                      "global.sales_tax",
                    )} on top?`}
              </legend>
              <input
                type="radio"
                value="true"
                name="client[client_deducted_expense_attributes][includes_sales_tax]"
                id="client_client_deducted_expense_attributes_includes_sales_tax_true"
                checked={includesSalesTax}
                onChange={() => handleIncludesSalesTaxChange(true)}
              />
              <label htmlFor="client_client_deducted_expense_attributes_includes_sales_tax_true">
                Yes
              </label>
              <input
                type="radio"
                value="false"
                name="client[client_deducted_expense_attributes][includes_sales_tax]"
                id="client_client_deducted_expense_attributes_includes_sales_tax_false"
                checked={includesSalesTax === false}
                // Makes sure that it's not prepopulated when the value is null,
                // see "Implied values" at https://hnrynz.github.io/hnry-design-system/components/inputs/switch#usage for more details
                onChange={() => handleIncludesSalesTaxChange(false)}
              />
              <label htmlFor="client_client_deducted_expense_attributes_includes_sales_tax_false">
                No
              </label>
            </fieldset>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

IncludesSalesTax.propTypes = {
  handleInputChange: PropTypes.func,
};

export default IncludesSalesTax;
