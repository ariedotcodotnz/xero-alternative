import React from "react";
import PropTypes from "prop-types";
import { AnimatePresence, motion } from "motion/react";
import Typedown from "../../inputs/typedown/typedown";
import { useDeductionsContext } from "./deductions";
import { animationDetails } from "./deductions_form";

// Represents the form item where a user chooses which category the created Expense would be
// It renders a Typedown with options set out in the Expenses model
const ExpenseCategory = ({ handleInputChange = null }) => {
  // Get the relevant variables and functions form the context
  const { expenseCategoryOptions, expenseType, setExpenseType, deductionType } =
    useDeductionsContext();

  const handleExpenseSelectChange = (value) => {
    setExpenseType(value);
    if (handleInputChange) {
      handleInputChange("expenseCategoryId", value);
    }
  };

  return (
    <AnimatePresence initial={false}>
      {deductionType !== "VARIABLE" && (
        <motion.div
          {...animationDetails}
          className="col-md-7 col-12"
          key="deduction-expense-category-id"
        >
          <Typedown
            dropdownOptions={expenseCategoryOptions}
            label="Expense category"
            inputProps={{
              name: "client[client_deducted_expense_attributes][expense_category_id]",
              type: "text",
              required: true,
              value: expenseCategoryOptions.find(
                ([text, code]) => code === expenseType,
              ),
              onChange: (value) => handleExpenseSelectChange(value),
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

ExpenseCategory.propTypes = {
  handleInputChange: PropTypes.func,
};

export default ExpenseCategory;
