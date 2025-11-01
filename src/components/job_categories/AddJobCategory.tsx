import React, { useState, useEffect } from "react";
import Alert from "@hui/_molecules/alert/Alert";
import Typedown from "../inputs/typedown/typedown";
import Button from "../_atoms/button/Button";
import Toggle from "../inputs/toggle/Toggle";
import I18n from "../../utilities/translations";
import { getJobCategories, createJobCategory } from "../../API/job_categories.api";

interface JobCategory {
  label: string;
  value: number;
  attributes: {
    "data-allow-mileage-expense": boolean;
    selected: boolean;
  };
}
interface AddJobCategoryProps {
  onCancel: () => void;
  onSave: (jobCategories: JobCategory[], selectedId: string) => void;
  expenseId: string;
}

const AddJobCategory = ({ onCancel, onSave, expenseId }: AddJobCategoryProps) => {
  const [jobCategoryOptions, setJobCategoryOptions] = useState<JobCategory[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [isPrimaryJobCategory, setIsPrimaryJobCategory] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await getJobCategories();
      const options = response.job_category_options.map(({ id, title }) => [title, id, {}]);

      setJobCategoryOptions(options);
    };

    fetchCategories();
  }, []);

  const handleChange = (value) => {
    setSelectedId(value);
  };

  const handleSave = async () => {
    if (!selectedId) return;

    try {
      const response = await createJobCategory({
        job_category_id: selectedId,
        expense_id: expenseId,
        primary_job_category: isPrimaryJobCategory
      });

      if (response.errors?.length) {
        throw new Error(response.errors[0]);
      }

      const jobCategories = response.job_categories;
      const event = new CustomEvent("job-category-created");

      toastr.success("Job category created");
      onSave(jobCategories, selectedId);
      window.dispatchEvent(event);
    } catch (error) {
      toastr.error(I18n.t("expenses.form.job_category.errors.failed_to_create"), error);
    }
  };

  return (
    <div id="add-job-category-form" className="tw-p-4 tw-bg-white">
      <Typedown
        dropdownOptions={jobCategoryOptions}
        label={I18n.t("expenses.form.job_category.select_work_type")}
        inputProps={{
          onChange: handleChange,
          type: "text",
          id: "job-category",
        }}
      />
      <Toggle
        label={I18n.t("expenses.form.job_category.primary_toggle")}
        inputProps={{
          id: "primary-job-category-toggle",
          name: "primary_job_category",
          value: isPrimaryJobCategory,
          onChange: () => setIsPrimaryJobCategory(!isPrimaryJobCategory),
        }}
      />
        <div id="job-category-info-message">
            <Alert variant="warning">
                <p className="tw-mb-0">{I18n.t("expenses.form.job_category.info")}</p>
            </Alert>
        </div>
      <div className="tw-flex tw-gap-2">
        <div id="cancel-add-job-category-button">
          <Button variant="secondary" onClick={onCancel}>
            {I18n.t("expenses.form.job_category.buttons.back")}
          </Button>
        </div>
          <div id="save-add-job-category-button">
            <Button variant="primary" onClick={handleSave}>
              {I18n.t("expenses.form.job_category.buttons.save")}
            </Button>
          </div>
      </div>
    </div>
  );
};

export default AddJobCategory;
