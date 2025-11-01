import React, { useEffect, useState } from "react";

const SalaryCheckbox = ({
  incomeTaxFilingId,
  disabled,
  atoSalaryCheck,
}) => {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(atoSalaryCheck || false);
  }, [atoSalaryCheck]);

  const handleCheckboxChange = (e) => {
    const { checked } = e.target;

    setChecked(checked);

    $.rails.ajax({
      type: "PATCH",
      url: Routes.admin_income_tax_filing_path(incomeTaxFilingId),
      data: {
        au_income_tax_filing: {
          ato_salary_checked: checked,
        },
      },
      error: ({ responseText }) => {
        const { error } = JSON.parse(responseText);
        toastr.error(error);
      },
    });
  };

  return (
    <div className="hnry-checkbox">
      <input
        type="checkbox"
        checked={checked}
        name="ato_salary_check_complete"
        id="atoSalaryCheck"
        onChange={handleCheckboxChange}
        disabled={disabled}
      />
      <label htmlFor="atoSalaryCheck" />
    </div>
  );
};

export default SalaryCheckbox;
