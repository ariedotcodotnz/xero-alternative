import React, { Fragment, useEffect, useState } from "react";
import { Transition } from "@headlessui/react";
import Combobox, { iHnryComboboxEntry } from "../../_molecules/combobox/Combobox";
import Input from "../../_atoms/input/Input";
import jobCategoryFilter from "./job_category_helper";

const JobCategorySelection = ({
  categories,
  fallbackOption,
  label = "Select a job type",
  required = true,
  name,
  id = "job-category",
  placeholder = "Main self-employed work",
  value,
}: iJobCategorySelection) => {
  const [selectedValue, setSelectedValue] = useState(value || "");
  const [showOtherWorkType, setShowOtherWorkType] = useState(false);

  useEffect(() => {
    setShowOtherWorkType(selectedValue === fallbackOption.id);
  }, [selectedValue]);

  const entries: iHnryComboboxEntry[] = categories.map((category) => ({
    key: category.id,
    value: category.title,
    description: category.description,
  }));

  const fallbackOptionElement = fallbackOption && {
    key: fallbackOption.id,
    value: fallbackOption.title,
    description: fallbackOption.description,
  };

  const transitionClasses = {
    enter: "tw-transition tw-ease-out tw-duration-200",
    enterFrom: "tw-opacity-0 tw--translate-y-1",
    enterTo: "tw-opacity-100 tw-translate-y-0",
    leave: "tw-transition tw-ease-in tw-duration-150",
    leaveFrom: "tw-opacity-100 tw-translate-y-0",
    leaveTo: "tw-opacity-0 tw--translate-y-1",
  };

  return (
    <div className="sign-up-typedown">
      <div className="tw-z-10 tw-relative no-bs">
        <Combobox
          entries={entries}
          fallbackOption={fallbackOptionElement}
          filterFunction={jobCategoryFilter}
          placeholder={placeholder}
          name={name}
          id={id}
          nullable={true}
          label={label}
          required={required}
          labelIsHidden={true}
          selectedValue={selectedValue}
          setSelectedValue={setSelectedValue}
        />
      </div>
      <Transition as={Fragment} show={showOtherWorkType} {...transitionClasses}>
        <div
          className="tw-mt-3 tw-overflow-hidden"
          data-job-category-other-id={fallbackOption.id}
        >
          <Input
            type="text"
            name="other_work_type"
            id="other_work_type"
            autocomplete="off"
            required={showOtherWorkType}
            label="My job type is..."
            labelClasses="tw-block tw-text-sm tw-font-medium tw-leading-6 tw-mb-0"
            legacyStyles={true}
          />
        </div>
      </Transition>
    </div>
  );
};

interface iJobCategorySelection {
  categories: iJobCategory[];
  fallbackOption: iJobCategory;
  label: string;
  required: boolean;
  name: string;
  id: string;
  placeholder: string;
  value: number;
}

export interface iJobCategory {
  id: number | string;
  title: string;
  description?: string;
}

export default JobCategorySelection;
