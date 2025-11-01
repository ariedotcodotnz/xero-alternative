import React, { useEffect, useState } from "react";
import FakeInput from "@hui/_atoms/button/FakeInput";
import { CheckboxGroupItem } from "@hui/_molecules/checkbox_group/CheckboxGroup";
import MultiSelectModal from "../modal/multi_select_modal/MultiSelectModal";

interface MultiSelectFromInputProps {
  addOptionText?: string;
  allSelectedText: string;
  clientIdsName: string;
  id: string;
  labelText: string;
  modalButtonText: string;
  modalTitle: string;
  name: string;
  noSearchResultsText?: string;
  onChange: (value: CheckboxGroupItem[]) => void;
  options: CheckboxGroupItem[];
  placeholder?: string;
  trackingEventPrefix: string;
}

const modalTriggerId = "select-client-modal-trigger";

const MultiSelectFromInput = ({
  addOptionText = "No options found, please close this model by selecting 'Cancel'.",
  allSelectedText,
  clientIdsName,
  id,
  labelText,
  modalButtonText,
  modalTitle,
  name,
  noSearchResultsText = "No search results found. Please adjust your search query.",
  onChange,
  options,
  placeholder = "Select...",
  trackingEventPrefix,
}: MultiSelectFromInputProps) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const allOptionsAreChecked = options.every((option) => option.checked);

  const handleUpdateInput = (value: CheckboxGroupItem[]) => {
    onChange(value);
  };

  useEffect(() => {
    if (options.every((option) => option.checked)) {
      setInputValue(allSelectedText);
    } else {
      setInputValue(
        options
          .filter((option) => option.checked)
          .map((option) => option.name)
          .join(", "),
      );
    }
  }, [allSelectedText, options]);

  return (
    <>
      <div className="tw-w-full">
        <div className="tw-px-3.5 sm:tw-max-w-[50%]">
          <FakeInput
            ariaLabel="Select which clients to assign to the allocation"
            buttonLabel={labelText}
            buttonText={inputValue || placeholder}
            id={modalTriggerId}
            onClick={() => setModalOpen(true)}
            rightIcon="PencilSquareIcon"
          />
          <input
            id={id}
            name={name}
            type="hidden"
            value={String(allOptionsAreChecked)}
          />
          {allOptionsAreChecked ? (
            <input type="hidden" name={clientIdsName} value={[]} />
          ) : (
            options
              .filter((option) => option.checked)
              .map((option) => (
                <input
                  key={option.value}
                  name={clientIdsName}
                  type="hidden"
                  value={option.value}
                />
              ))
          )}
        </div>
      </div>

      <MultiSelectModal
        addOptionText={addOptionText}
        confirmCTA={modalButtonText}
        modalTriggerId={modalTriggerId}
        noSearchResultsText={noSearchResultsText}
        open={modalOpen}
        options={options}
        onConfirm={handleUpdateInput}
        setOpen={setModalOpen}
        title={modalTitle}
        trackingEventPrefix={trackingEventPrefix}
      />
    </>
  );
};

export default MultiSelectFromInput;
