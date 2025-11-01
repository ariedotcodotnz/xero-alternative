import React, { useState, useCallback, useEffect, Fragment } from "react";
import Combobox, { iHnryComboboxEntry } from "../_molecules/combobox/Combobox";
import Icon from "../icon/Icon";
import I18n from "../../utilities/translations";
import { removeButtonPopOver } from "../utils/base_helper";

type localJobCategory = {
  value: iHnryComboboxEntry;
  primary: boolean;
};

interface iSettingsWorkTypes {
  jobCategoryOptions: iHnryComboboxEntry[];
  allowUpdatePrimaryJob: boolean;
  userJobCategories: localJobCategory[];
}

interface iActionButton {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

const DeleteButton = ({ onClick, disabled = false }: iActionButton) => {
  const label = disabled
    ? "Cannot delete primary work type"
    : "Delete this work type";

  return (
    <td className="user-jobs-table__body-row">
      <Icon
        label={label}
        type="actions/delete"
        asButton
        onClick={onClick}
        className="tw-w-9 tw-h-9 tw-p-2"
        popover={{ placement: "top", content: label }}
        disabledIconButton={disabled || false}
      />
    </td>
  );
};

const AddButton = ({ onClick, disabled = false }: iActionButton) => {
  const label = "Add work type";

  return (
    <td>
      <Icon
        label={label}
        type="actions/add"
        asButton
        onClick={onClick}
        className="tw-w-9 tw-h-9 tw-p-2"
        popover={{ placement: "top", content: label }}
        disabledIconButton={disabled}
      />
    </td>
  );
};

const WorkTypes = ({
  jobCategoryOptions,
  allowUpdatePrimaryJob,
  userJobCategories,
}: iSettingsWorkTypes) => {
  const [formVisibility, setFormVisibility] = useState(false);
  const [newList, setNewList] = useState([]);
  const [jobOptions, setJobOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);

  const filterDropdownOptions = useCallback(
    (list) => {
      const selectedIds = list.map(({ value }) => value[1]);
      const filtered =
        selectedIds.length > 0
          ? jobCategoryOptions.filter((work) => !selectedIds.includes(work.key))
          : jobCategoryOptions;

      setJobOptions(filtered);
    },
    [jobCategoryOptions],
  );

  useEffect(() => {
    filterDropdownOptions(userJobCategories);
    setNewList(userJobCategories);

    if (userJobCategories.length === 0) {
      setFormVisibility(true);
    }
  }, []);

  const handleAddClick = useCallback(
    (event) => {
      event.preventDefault();
      removeButtonPopOver();
      setFormVisibility(true);
    },
    [newList],
  );

  useEffect(() => {
    if (selectedValue) {
      const primary = newList.length === 0;
      const selectedValueItem: localJobCategory = {
        value: jobCategoryOptions
          .filter((obj) => obj.key === selectedValue)
          .map((obj) => ({ key: obj.key, value: obj.value }))[0],
        primary,
      };
      const updated = [...newList, selectedValueItem];

      setNewList(updated);
      setFormVisibility(false);
      filterDropdownOptions(updated);
      setSelectedValue(null);
      window.unsaved_changes = true;
    }
  }, [filterDropdownOptions, jobCategoryOptions, newList, selectedValue]);

  const handleDeleteClick = useCallback(
    (event, selected) => {
      event.preventDefault();

      if (selected === null) {
        setFormVisibility(false);
      } else {
        const { value, primary } = selected;

        if (!primary) {
          const updated = newList.filter((v) => v.value !== value);

          setNewList(updated);
          filterDropdownOptions(updated);
        }

        window.unsaved_changes = true;
      }
      removeButtonPopOver();
    },
    [filterDropdownOptions, newList],
  );

  const handlePrimaryFieldClick = (selected) => {
    if (allowUpdatePrimaryJob) {
      const updated = newList.map(({ value }) => ({
        value,
        primary: value === selected,
      }));
      setNewList(updated);
    }
  };

  return (
    <div className="tw-mb-8">
      <hr />
      <table className="user-jobs-table">
        <thead className="user-jobs-table__header-group">
          <tr>
            <th className="user-jobs-table__header tw-font-weight-medium">
              Self-employed work type
            </th>
            {(newList.length > 1 ||
              (newList.length === 1 && formVisibility)) && (
              <Fragment>
                {allowUpdatePrimaryJob && (
                  <th className="user-jobs-table__header user-jobs-table__actions">
                    Primary
                  </th>
                )}
                <th className="user-jobs-table__header user-jobs-table__actions">
                  <span className="tw-sr-only">Delete</span>
                </th>
              </Fragment>
            )}
            <th className="user-jobs-table__header user-jobs-table__actions">
              <span className="tw-sr-only">Add new</span>
            </th>
          </tr>
        </thead>
        <tbody className="user-jobs-table__body">
          {newList.map((work, i) => {
            const { value, primary } = work;
            const showAddBtn = newList.length - 1 === i && !formVisibility;
            const showPrimaryAndDeleteBtn =
              newList.length > 1 || (newList.length === 1 && formVisibility);
            const showBadge = !allowUpdatePrimaryJob && primary; // NZ only
            const inputName = primary
              ? "user[primary_job_category_id]"
              : "user[secondary_job_category_ids][]";

            return (
              <tr key={`job-category-${value.key}`}>
                <td className="user-jobs-table__body-row">
                  <div
                    id={`work-id-${value.key}`}
                    className="user-jobs-table__job-name"
                  >
                    <input
                      type="number"
                      name={inputName}
                      defaultValue={value.key}
                      className="hidden"
                      readOnly
                    />
                    {`${value.value}`}
                    {showBadge && (
                      <span className="hnry-badge hnry-badge--green tw-ml-2">
                        Primary
                      </span>
                    )}
                  </div>
                </td>

                {showPrimaryAndDeleteBtn && (
                  <>
                    {allowUpdatePrimaryJob && (
                      <td className="user-jobs-table__body-row">
                        <div className="user-jobs-table__radio-btn">
                          <input
                            type="radio"
                            id={value.key}
                            name="primary"
                            value={value.key}
                            checked={primary}
                            onChange={() => handlePrimaryFieldClick(value)}
                          />
                          <label htmlFor={value.key} className="tw-sr-only">
                            Select as Primary
                          </label>
                        </div>
                      </td>
                    )}
                    <DeleteButton
                      onClick={(event) => handleDeleteClick(event, work)}
                      disabled={primary}
                    />
                  </>
                )}

                {showAddBtn && <AddButton onClick={handleAddClick} />}
              </tr>
            );
          })}

          {formVisibility && (
            <tr>
              <td className="user-jobs-table__body-row">
                <Combobox
                  entries={jobOptions}
                  placeholder="Search work type..."
                  filterBy="description"
                  selectedValue={selectedValue}
                  setSelectedValue={setSelectedValue}
                  id="job-category-combobox"
                />
              </td>
              {allowUpdatePrimaryJob && (
                <td className="user-jobs-table__body-row">
                  <div className="user-jobs-table__radio-btn">
                    <input
                      type="radio"
                      id="draftPrimary"
                      name="primary"
                      disabled
                    />
                    <label htmlFor="draftPrimary" className="tw-sr-only">
                      Select as Primary
                    </label>
                  </div>
                </td>
              )}
              <DeleteButton
                onClick={(event) => handleDeleteClick(event, null)}
                disabled={newList.length === 0}
              />
              <AddButton onClick={handleAddClick} disabled />
            </tr>
          )}
        </tbody>
      </table>
      <p className="user-jobs-table__bottom-text tw-text-gray-500 tw-font-semibold">
        {I18n.t("users.profile.primary_work_type")}
      </p>
    </div>
  );
};

export default WorkTypes;
