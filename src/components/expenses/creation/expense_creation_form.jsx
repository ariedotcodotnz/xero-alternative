import React, { useState, useEffect, useContext, useCallback } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Dropdown from "../../inputs/dropdown/dropdown";
import Typedown from "../../inputs/typedown/typedown";
import I18n from "../../../utilities/translations";
import { getUserJurisdictionCode } from "../../../utilities/user_attributes";
import { ExpenseContext } from "../ExpenseContext";
import Button from "../../_atoms/button/Button";
import AddJobCategory from "../../job_categories/AddJobCategory";

const EXPENSE_CATEGORY_INDEX_VALUE = 1;
const EXPENSE_CATEGORY_INDEX_DATA = 2;

const withDefaultSelect = (options) => {
  if (options.length <= 1) {
    return options;
  }
  return [
    {
      label: I18n.t("expenses.form.job_category.dropdown_default"),
      value: "",
      attributes: { disabled: true, selected: true },
    },
    ...options
  ];
};

const ExpenseCreationForm = ({
  jobCategoryProps,
  expenseCategoryProps,
  showJobCategoryDropdown = true,
  mileageCategoryIds,
  motorVehicleCategoryIds,
  nonSalaryCategoryIds,
  isMainForm,
  isHidden,
}) => {
  const expenseCategoryContext = useContext(ExpenseContext);
  const [expenseCategoryOptions, setExpenseCategoryOptions] = useState(expenseCategoryProps.dropdownOptions);
  const [selectedJobCategoryId, setSelectedJobCategoryId] = useState(jobCategoryProps.initialSelectedId || "");
  const [salary, setSalary] = useState(false);
  const [allowMileageExpense, setAllowMileageExpense] = useState(null);
  const [showMotorVehicleAlert, setShowMotorVehicleAlert] = useState(false);
  const [showMotorVehicleAlertLink, setShowMotorVehicleAlertLink] = useState(false);
  const [isMotorVehicle, setIsMotorVehicle] = useState(null);
  const [resetTypedown, setResetTypedown] = useState(false);
  const [selectedExpenseExpenseCategoryId, setSelectedExpenseExpenseCategoryId] = useState(expenseCategoryProps.inputProps?.value?.[1] || "");
  const alertMotorVehicleText = I18n.t("expenses.form.motor_vehicle_text");
  const alertMotorVehicleLinkHref = I18n.t("expenses.form.motor_vehicle_link");
  const jurisdiction = getUserJurisdictionCode();
  const isAuJurisdiction = jurisdiction === "au";
  const setCategory = expenseCategoryContext?.setCategory;
  const isPreHnry = expenseCategoryContext?.preHnry;
  const isEoyf = expenseCategoryContext?.eoyf;
  const canShowAddJobCategoryOptions = !isPreHnry && !isEoyf && !isMainForm;
  const [showAddJobCategory, setShowAddJobCategory] = useState(false);
  const [jobCategoryOptions, setJobCategoryOptions] = useState(() => {
    if (canShowAddJobCategoryOptions) {
      return withDefaultSelect(jobCategoryProps.optionEls);
    }
    return jobCategoryProps.optionEls;
  });

  useEffect(() => {
    const nextButton = document.getElementById("expense-creation-next-button");
    const receiptType = document.getElementById("expense_receipt_type");
    const addWorkTypeButton = document.getElementsByClassName("add-work-type-button");

    if (nextButton && receiptType?.value !== "client_chargeable" && addWorkTypeButton ) {
      nextButton.disabled = selectedJobCategoryId === "";
    }
  }, [selectedJobCategoryId]);

  useEffect(() => {
    const receiptCategoryEl = document.getElementById("receipt-category");

    if (receiptCategoryEl) {
      if (!showAddJobCategory) {
        receiptCategoryEl.classList.remove("hidden");
      } else {
        receiptCategoryEl.classList.add("hidden");
      }
    }
  }, [showAddJobCategory]);

  useEffect(() => {
    if (!expenseCategoryProps?.inputProps?.value || !expenseCategoryProps.inputProps.value[2]) return;

    const categorySelection = {
      mileageCategory: expenseCategoryProps.inputProps.value[EXPENSE_CATEGORY_INDEX_DATA]["data-is-mileage"],
    };

    if (setCategory) {
      setCategory(categorySelection);
    }
  }, [expenseCategoryProps.inputProps.value, setCategory]);

  const updateAlert = useCallback(() => {
    setShowMotorVehicleAlert(allowMileageExpense === undefined && isMotorVehicle);
    setShowMotorVehicleAlertLink(alertMotorVehicleLinkHref !== "" && isMotorVehicle);
  }, [alertMotorVehicleLinkHref, allowMileageExpense, isMotorVehicle]);

  useEffect(() => {
    updateAlert();
  }, [isMotorVehicle, selectedJobCategoryId, updateAlert]);


  const updateExpenseCategoryOptions = (value, text, salaryNum, optionElement) => {
    const allowMileageExpenses = optionElement.dataset.allowMileageExpense === "true";
    const allowMotorVehicleExpenses = optionElement.dataset.allowMileageExpense === "false";
    const allowAllExpenses = optionElement.dataset.allowMileageExpense === undefined;
    let filteredOptions = null;
    const excludeCodes = (options, codes) => options.filter((option) => !codes.includes(option[EXPENSE_CATEGORY_INDEX_VALUE]));

    if (allowMileageExpenses) {
      filteredOptions = excludeCodes(expenseCategoryProps.dropdownOptions, motorVehicleCategoryIds);
    }
    if (allowMotorVehicleExpenses) {
      filteredOptions = excludeCodes(expenseCategoryProps.dropdownOptions, mileageCategoryIds);
    }
    if (allowAllExpenses) {
      filteredOptions = expenseCategoryProps.dropdownOptions;
    }
    if (salaryNum) {
      filteredOptions = excludeCodes(expenseCategoryProps.dropdownOptions, nonSalaryCategoryIds);
    }
    setExpenseCategoryOptions([...filteredOptions]);
  };

  const handleJobCategoryChange = (state) => {
    const { selectedValue: jobCategoryId, selectedText: text, selectedOptionEl: optionElement } = state;

    const salaryNum = Number(jobCategoryId) === -1;

    setAllowMileageExpense(optionElement.dataset.allowMileageExpense);
    updateExpenseCategoryOptions(jobCategoryId, text, salaryNum, optionElement);
    setSalary(salaryNum);
    setSelectedJobCategoryId(jobCategoryId);
    if (jurisdiction === "au") {
      // Custom event to send the selected job category.
      // Used in app/assets/javascripts/views/expenses.js to toggle GST on/off.
      const event = new CustomEvent("additional-expense-job-category-change", { detail: { selectedValue: jobCategoryId, salaryNum } });
      window.dispatchEvent(event);
    }
  };

  useEffect(() => {
    if (salary && nonSalaryCategoryIds.includes(selectedExpenseExpenseCategoryId)) {
      setResetTypedown(true);
    } else {
      setResetTypedown(false);
    }
  }, [selectedJobCategoryId, salary, nonSalaryCategoryIds, selectedExpenseExpenseCategoryId]);

  const onExpenseCategoryChange = (expenseCategoryId, categoryData) => {
    setSelectedExpenseExpenseCategoryId(expenseCategoryId);


    const categorySelection = {
      mileageCategory: categoryData === undefined ? false : categoryData[EXPENSE_CATEGORY_INDEX_DATA]["data-is-mileage"],
    };

    if (setCategory) {
      setCategory(categorySelection);
    }

    if (!categoryData) {
      return;
    }

    setIsMotorVehicle(categoryData[EXPENSE_CATEGORY_INDEX_DATA]["data-is-motor-vehicle"]);
  };

  return (
    <>
      {jobCategoryProps && (
        <div
          className={classNames("job-categories-dropdown", {
            "expense-type-full-form": isMainForm,
            "expense-type-modal-form": !isMainForm,
            hidden: isHidden,
          })}
        >
          {!showAddJobCategory && <Dropdown
            id={jobCategoryProps.id}
            name={`${jobCategoryProps.name}-select`}
            label={jobCategoryProps.label}
            hidden={!showJobCategoryDropdown}
            disabled={jobCategoryProps.disabled}
            optionEls={jobCategoryOptions}
            required={jobCategoryProps.required}
            tooltip={jobCategoryProps.tooltip}
            selectValue={selectedJobCategoryId}
            onChange={handleJobCategoryChange}
            hiddenInputName={jobCategoryProps.name}
            wrapperClasses={"mb-0"}
          />}

          {!showAddJobCategory && isAuJurisdiction && canShowAddJobCategoryOptions && (
            <div className="tw-flex tw-justify-end tw-mt-0 tw-mb-2">
              <Button
                variant="link"
                classes="add-work-type-button tw-max-w-fit"
                iconType="PlusIcon"
                iconEnd
                onClick={() => {
                  setShowAddJobCategory(true);
                }}
              >
                {I18n.t("expenses.form.job_category.add_button_label")}
              </Button>
            </div>
          )}
        </div>
      )}
      {showAddJobCategory && (
        <AddJobCategory
          onCancel={() => {
            setShowAddJobCategory(false);
          }}
          onSave={(newOptions, selectedJobCategoryId) => {
            setJobCategoryOptions(newOptions);
            setSelectedJobCategoryId(selectedJobCategoryId);
            setShowAddJobCategory(false);
          }}
          expenseId={jobCategoryProps.expenseId}
        />
      )}

      {/* Note: this is the salary value */}
      {salary && <input type="hidden" name="expense[salary]" id="salary-hidden-field" value={salary} />}

      {!showAddJobCategory && <div
        className={classNames("md-form expense-categories required", {
          "expense-type-full-form": isMainForm,
          "expense-type-modal-form": !isMainForm,
          hidden: isHidden,
        })}
      >
        <Typedown
          dropdownOptions={expenseCategoryOptions}
          label={expenseCategoryProps.label}
          fireChangeOnLoad={expenseCategoryProps.fireChangeOnLoad}
          inputProps={{
            ...expenseCategoryProps.inputProps,
            onChange: onExpenseCategoryChange,
          }}
          componentId={isMainForm ? "" : "exp_modal_"}
          reset={resetTypedown}
        />
      </div>}
      <div id="motor-vehicle-alert" className={classNames({ hidden: !showMotorVehicleAlert })}>
        <div className="mt-1 alert alert-primary" role="alert" aria-live="polite">
          <p>{alertMotorVehicleText}</p>
          <div className={classNames("mt-2", { hidden: !showMotorVehicleAlertLink })}>
            <a href={alertMotorVehicleLinkHref} data-category="motor-vehicle" target="_blank" rel="noreferrer">Learn more</a>
          </div>
        </div>
      </div>
    </>
  );
};

ExpenseCreationForm.propTypes = {
  jobCategoryProps: PropTypes.object.isRequired,
  expenseCategoryProps: PropTypes.object.isRequired,
  showJobCategoryDropdown: PropTypes.bool,
  mileageCategoryIds: PropTypes.array.isRequired,
  motorVehicleCategoryIds: PropTypes.array.isRequired,
  nonSalaryCategoryIds: PropTypes.array.isRequired,
  isMainForm: PropTypes.bool,
  isHidden: PropTypes.bool,
  eoyf: PropTypes.bool,
};

export default ExpenseCreationForm;
