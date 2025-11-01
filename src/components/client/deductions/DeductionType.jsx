import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useDeductionsContext } from "./deductions";

// Represents the form item where a user selects what type of Deduction they're creating
// It renders a select input populated with options determined by Rails based on the ClientDeductedExpense model
const DeductionType = ({ handleInputChange = null }) => {
  // Get the relevant variables and functions from the context
  const { deductionType, setDeductionType, deductionOptions } = useDeductionsContext();

  // Since we use a jQuery MDB select to make out selects look nice, we cannot use normal event handlers as we would
  // normally in react since the jQuery manipulates the DOM for us. To help with this, we use Refs to keep track of
  // the select element itself (whose data gets sent to the server) and the wrapper.
  const DeductionTypeSelect = useRef(null);
  const DeductionTypeSelectWrapper = useRef(null);

  // More or less on mount, use the jQuery plugin to style the select to match all the other ones
  useEffect(() => {
    if (DeductionTypeSelect.current) {
      $(DeductionTypeSelect.current).material_select();
    }
  }, [DeductionTypeSelect.current]);

  // On mount, attach some event listeners to the document so that we can check for changes in the value
  // of the MDB select. Pretty much everytime the user clicks or pushes a keydown while this component is mounted,
  // we use the `checkForSelectChange` function to see if the select value has changed, which then updates the context.
  useEffect(() => {
    document.addEventListener("click", checkForSelectChange);
    document.addEventListener("keydown", checkForSelectChange);
    // The returned function is how event listeners get removed on unmount
    return () => {
      document.removeEventListener("click", checkForSelectChange);
      document.removeEventListener("keydown", checkForSelectChange);
    };
  }, []);

  // Check if the value of the MDB select for `deductionType` has changed
  const checkForSelectChange = ({ target }) => {
    const selectedValue = DeductionTypeSelectWrapper.current.querySelector("select").value;
    // Only update the state if the event target is a child of the `DeductionTypeSelectWrapper` element
    // or if is `body` (which happens if the user is navigating using a keyboard)
    if (DeductionTypeSelectWrapper.current.contains(target) || target === document.body) {
      setDeductionType(selectedValue);
      if (handleInputChange) {
        handleInputChange("deductionType", selectedValue);
      }
    }
  };

  return (
    <div className="col-md-7 col-12">
      <div className="md-form required" ref={DeductionTypeSelectWrapper} id="deductionTypeDropdown">
        <select
          ref={DeductionTypeSelect}
          className="mdb-select inline-select"
          name="client[client_deducted_expense_attributes][deduction_type]"
          id="client_client_deducted_expense_attributes_deduction_type"
          defaultValue={deductionType}
          readOnly
          >
          {deductionOptions.map(([text, value]) => (
            <option key={value} value={value}>{text}</option>
          ))}
        </select>
        <label htmlFor="client_client_deducted_expense_attributes_deduction_type">The amount is</label>
      </div>
    </div>
  );
};

DeductionType.propTypes = {
  handleInputChange: PropTypes.func,
};

export default DeductionType;
