import React, { useEffect, useMemo, useState } from "react";
import DOMPurify from "dompurify";
import CheckboxGroup, {
  CheckboxGroupItem,
} from "@hui/_molecules/checkbox_group/CheckboxGroup";
import Button from "@hui/_atoms/button/Button";
import SearchInput from "@hui/_atoms/input/SearchInput";
import * as Dialog from "@radix-ui/react-dialog";
import areOptionsDifferent from "./helpers";
import "./styles.scss";

export interface iMultiSelectModal {
  confirmCTA?: string;
  onConfirm?: (value: CheckboxGroupItem[]) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  options: CheckboxGroupItem[];
  trackingEventPrefix?: string;
  noSearchResultsText?: string;
  addOptionText?: string;
  modalTriggerId?: string;
}

const MultiSelectModal = ({
  confirmCTA = "Confirm",
  onConfirm,
  open = false,
  setOpen,
  title,
  options,
  trackingEventPrefix,
  noSearchResultsText,
  addOptionText,
  modalTriggerId,
}: iMultiSelectModal) => {
  const [isAllButtonSelect, setIsAllButtonSelect] = useState<boolean>(
    options.some((option) => !option.checked),
  );
  const [localOptions, setLocalOptions] =
    useState<CheckboxGroupItem[]>(options);
  const [saveButtonDisabled, setSaveButtonDisabled] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchOptions, setSearchOptions] = useState<CheckboxGroupItem[]>([]);

  const allButtonText = useMemo(
    () => (isAllButtonSelect ? "Select all" : "Clear all"),
    [isAllButtonSelect],
  );

  const optionsToBeDisplayed = searchOptions.length
    ? searchOptions
    : localOptions;
  const checkedCount = localOptions.filter((option) => option.checked).length;
  const totalCount = localOptions.length;

  const mergeOptions = (
    optionsToUpdate: CheckboxGroupItem[],
    updatedOptions: CheckboxGroupItem[],
  ) => {
    const mergedMap = new Map<string, CheckboxGroupItem>();

    optionsToUpdate.forEach((optionToUpdate) => {
      mergedMap.set(optionToUpdate.value, { ...optionToUpdate });
    });

    updatedOptions.forEach((updatedOption) => {
      if (mergedMap.has(updatedOption.value)) {
        const existingOption = mergedMap.get(updatedOption.value)!;
        mergedMap.set(updatedOption.value, {
          ...existingOption,
          ...updatedOption,
        });
      }
    });

    return Array.from(mergedMap.values());
  };

  const closeModal = () => {
    if (open) {
      setOpen(false);
      setTimeout(() => {
        setSaveButtonDisabled(true);
        setSearchQuery("");
        setSearchOptions([]);
      }, 150);
    }
  };

  useEffect(() => {
    // Properly remove the component when modal never call setOpen to close the dialog
    // This happens when the modal redirects from rails controller and the modal is not proper unmount
    // The page lost its scrollbar when the modal is not proper unmount in the background
    document.addEventListener("hnry:turbolinks-render", closeModal);

    return () => {
      document.removeEventListener("hnry:turbolinks-render", closeModal);
    };
  }, []);

  const handleConfirm = () => {
    closeModal();
    onConfirm(localOptions);

    window.analytics?.track(`${trackingEventPrefix}_save_button_clicked`, {
      count: `${checkedCount}/${totalCount} options selected`,
    });
  };

  const handleCancel = () => {
    closeModal();
    window.analytics?.track(`${trackingEventPrefix}_cancel_button_clicked`, "");
    setTimeout(() => {
      setLocalOptions(options);
    }, 150);
  };

  const updateSelectAllButton = (options: CheckboxGroupItem[]) => {
    const someOptionsAreNotChecked = options.some((option) => !option.checked);
    setIsAllButtonSelect(someOptionsAreNotChecked);
  };

  const updateDisplayOptionsAndButtons = (
    displayOptions: CheckboxGroupItem[],
    optionsToBeSaved: CheckboxGroupItem[],
  ) => {
    updateSelectAllButton(displayOptions);

    if (
      optionsToBeSaved.some((optionToBeSaved) => optionToBeSaved.checked) &&
      areOptionsDifferent(optionsToBeSaved, options)
    ) {
      setSaveButtonDisabled(false);
    } else {
      setSaveButtonDisabled(true);
    }
  };

  const handleCheckboxesChanging = (checkedCheckboxes: string[]) => {
    if (searchQuery !== "") {
      const updatedOptions = searchOptions.map((searchOption) => ({
        ...searchOption,
        checked: checkedCheckboxes.includes(searchOption.value),
      }));
      const localOptionsToBeSaved = mergeOptions(localOptions, updatedOptions);

      updateDisplayOptionsAndButtons(updatedOptions, localOptionsToBeSaved);
      setSearchOptions(updatedOptions);
      setLocalOptions(localOptionsToBeSaved);
    } else {
      const updatedOptions = localOptions.map((localOption) => ({
        ...localOption,
        checked: checkedCheckboxes.includes(localOption.value),
      }));

      updateDisplayOptionsAndButtons(updatedOptions, updatedOptions);
      setLocalOptions(updatedOptions);
    }
  };

  const handleAllButtonClicked = () => {
    const someOptionsAreUnchecked = optionsToBeDisplayed.some(
      (optionToBeDisplayed) => !optionToBeDisplayed.checked,
    );
    const updatedOptions = optionsToBeDisplayed.map((optionToBeDisplayed) => ({
      ...optionToBeDisplayed,
      checked: someOptionsAreUnchecked,
    }));
    const localOptionsToBeSaved = mergeOptions(localOptions, updatedOptions);
    const checkedCount = optionsToBeDisplayed.filter(
      (option) => option.checked,
    ).length;
    const totalCount = localOptions.length;

    updateDisplayOptionsAndButtons(updatedOptions, localOptionsToBeSaved);
    if (searchOptions.length) setSearchOptions(updatedOptions);
    setLocalOptions(localOptionsToBeSaved);

    window.analytics?.track(
      `${trackingEventPrefix}_${someOptionsAreUnchecked ? "select_all" : "clear_all"}_button_clicked`,
      {
        count: `${checkedCount}/${totalCount} options ${someOptionsAreUnchecked ? "selected" : "cleared"}`,
      },
    );
  };

  const handleSearchQueryChanging = (searchString: string) => {
    if (searchString !== "") {
      const tidySearchString = searchString.trim().toLowerCase();
      const mergedOptions = mergeOptions(options, localOptions);
      const searchResults = mergedOptions.filter((mergedOption) =>
        mergedOption.name.toLowerCase().includes(tidySearchString),
      );

      setLocalOptions(mergedOptions);
      setSearchOptions(searchResults);
    } else {
      updateSelectAllButton(localOptions);
      setSearchOptions([]);
    }
    setSearchQuery(searchString);
  };

  const handleSearchBlur = () => {
    window.analytics?.track(`${trackingEventPrefix}_search_blur`, {
      count_on_blur: `${checkedCount}/${totalCount}`,
    });
  };

  const handleSearchFocus = () => {
    window.analytics?.track(`${trackingEventPrefix}_search_focused`, {
      count_on_focus: `${checkedCount}/${totalCount}`,
    });
  };

  const handleRootChanging = () => {
    handleCancel();
  };

  const resultsContent = () => {
    if (!options.length) {
      return (
        <p
          className="tw-text-sm tw-text-gray-700"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(addOptionText),
          }}
        />
      );
    }

    if (searchQuery !== "" && !searchOptions.length) {
      return (
        <p className="tw-text-sm tw-text-gray-700">{noSearchResultsText}</p>
      );
    }

    return (
      <CheckboxGroup
        name="select_clients"
        items={optionsToBeDisplayed}
        onChange={handleCheckboxesChanging}
      />
    );
  };

  const focusButtonOnClose = (event) => {
    event?.preventDefault();
    document.getElementById(modalTriggerId)?.focus();
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleRootChanging}>
      <Dialog.Portal>
        <Dialog.Overlay className="hnry-dialog-transition data-[state=closed]:tw-animate-opacityHideFast data-[state=open]:tw-animate-opacityShowFast" />
        <Dialog.Content
          onCloseAutoFocus={focusButtonOnClose}
          className="hnry-dialog-panel data-[state=closed]:tw-animate-opacityHideFast data-[state=open]:tw-animate-opacityShowFast"
        >
          <div className="hnry-dialog-panel-content tw-flex tw-flex-col">
            <div className="hnry-dialog-panel-header tw-flex-col tw-gap-4">
              <div className="tw-flex tw-w-full tw-items-center">
                <Button
                  classes="tw-absolute !tw-w-auto"
                  variant="link"
                  onClick={handleAllButtonClicked}
                >
                  {allButtonText}
                </Button>
                <Dialog.Title className="hnry-dialog-panel-header__title tw-w-full !tw-text-center">
                  {title}
                </Dialog.Title>
              </div>
              <SearchInput
                id={`${trackingEventPrefix}_search`}
                label="Search clients"
                showLabel={false}
                inputGroupClasses="tw-w-full"
                value={searchQuery}
                setValue={handleSearchQueryChanging}
                onBlur={handleSearchBlur}
                onFocus={handleSearchFocus}
              />
            </div>
            <div className="hide-scrollbar-track tw-flex-grow tw-overflow-scroll">
              {resultsContent()}
            </div>

            {/* To do: remove this and apply trackingEventPrefix to wherever it is needed in a follow up PR  */}
            <div className="tw-hidden">{trackingEventPrefix}</div>

            <div className="hnry-dialog-panel-actions">
              {onConfirm && (
                <Button
                  type="button"
                  onClick={handleConfirm}
                  variant="primary"
                  disabled={saveButtonDisabled}
                >
                  {confirmCTA}
                </Button>
              )}
              <Button type="button" variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default MultiSelectModal;
