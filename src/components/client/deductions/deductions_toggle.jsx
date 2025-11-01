import React, { Fragment } from "react";
import Toggle from "../../inputs/toggle/Toggle";
import { useDeductionsContext } from "./deductions";
import I18n from "../../../utilities/translations";

const DeductionsToggle = ({ handleClientChange }) => {
  const { isFormVisible, setIsFormVisible } = useDeductionsContext();

  const handleToggleChange = (value) => {
    setIsFormVisible(value);
    handleClientChange && handleClientChange(value);
  };

  return (
    <div className="form-group">
      <input type="hidden" name="client[deducts_expenses_prior_to_payment]" value="false" />
      <Toggle
        label={
          <Fragment>
            {
              I18n.t("clients.form.prior_deductions.client_deducts_expenses")
            }
            </Fragment>
        }
        inputProps={{
          name: "client[deducts_expenses_prior_to_payment]",
          value: isFormVisible,
          onChange: ({ target }) => handleToggleChange(target.checked),
        }}
      />
    </div>
  );
};

export default DeductionsToggle;
