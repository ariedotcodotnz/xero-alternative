import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Typedown from "../inputs/typedown/typedown";

const AuDeferredLoss = ({
  checkboxId,
  amountInputName,
  amountInputId,
  amountValue,
  amountLabel,
  workTypeInputName,
  workTypeInputId,
  workTypeLabel,
  workTypesDropdownOptions,
  workTypeValue
}) => {
  const element = document.getElementById(checkboxId);
  const [required, setRequired] = useState(element.checked);

  const toggleRequired = () => {
    setRequired(element.checked)
  }

  useEffect(() => {
    element.addEventListener("change", toggleRequired);

    return () => {
      element.removeEventListener("change", toggleRequired);
    };
  }, []);

  return (
    <div className="row">
      <div className="col-12">
        <div className="row amount">
          <div className="col-12 md-col-4">
            <div className={`md-form number-with-dollar ${required ? "required" : ""}`}>
              <input step="0.01" className="form-control" required={required} type="number" name={amountInputName} id={amountInputId} defaultValue={amountValue} />
              <label htmlFor={amountInputId}>{amountLabel}</label>
            </div>
          </div>

          <div className="col-12 md-col-8 work-type">
            <div className="md-form">
              <Typedown
                dropdownOptions={workTypesDropdownOptions}
                label={workTypeLabel}
                inputProps={{
                  name: workTypeInputName,
                  id: workTypeInputId,
                  type: "text",                  
                  value: [workTypeValue, workTypeValue],
                  required
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

AuDeferredLoss.propTypes = {
  checkboxId: PropTypes.string.isRequired,
  amountInputName: PropTypes.string.isRequired,
  amountInputId: PropTypes.string.isRequired,
  amountValue: PropTypes.number,
  amountLabel: PropTypes.string.isRequired,
  workTypeInputName: PropTypes.string.isRequired,
  workTypeInputId: PropTypes.string.isRequired,
  workTypeLabel: PropTypes.string.isRequired,
  workTypesDropdownOptions: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  workTypeValue: PropTypes.string
};

export default AuDeferredLoss;
