import React from "react";
import { toLocaleString } from "../../../utils/base_helper";
import Row from "./Row";

const ExpenseRow = ({
  expense, warningTooltip = false, copyLabel = "", code = "",
}) => {
  if (expense) {
    const {
      title, sum, sumAddedInEoyForm, sum_added_in_eoy_form,
    } = expense;
    const sumString = `$${toLocaleString(sum, 0)}`;
    const addedInEoyMessage = (sumAddedInEoyForm > 0 || sum_added_in_eoy_form > 0)
      ? ` $${toLocaleString(sumAddedInEoyForm || sum_added_in_eoy_form, 0)} of the ${sumString} in this expense category was added in the EOY form and has not been reviewed` : "";

    let message = "";

    if (warningTooltip === true) {
      message = "Contact customer for more";
    } else if (warningTooltip !== false) {
      message = warningTooltip;
    }

    message += addedInEoyMessage;

    return (
      <Row
        fieldName={title}
        value={sumString}
        copyLabel={copyLabel || title}
        copyFieldName
        warningTooltip={message}
        code={code}
      />
    );
  }

  return null;
};

export default ExpenseRow;
