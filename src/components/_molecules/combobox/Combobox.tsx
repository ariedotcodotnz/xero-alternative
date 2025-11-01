import React, {
  Fragment,
  useCallback,
  useEffect,
  useState,
  useRef,
} from "react";
import classNames from "classnames";
import { Combobox as HeadlessUICombobox, Transition } from "@headlessui/react";
import Icon from "../../_atoms/icons/icon/Icon";

export interface iHnryComboboxEntry {
  key: number | string;
  value: string
  customOption?: React.ReactNode;
  description?: string;
  disabled?: boolean;
}

export interface iHnryCombobox {
  comboboxClasses?: string;
  entries: iHnryComboboxEntry[];
  fallbackOption?: iHnryComboboxEntry;
  filterBy?: string;
  filterFunction?: (
    query: string,
    entries: iHnryComboboxEntry[],
  ) => iHnryComboboxEntry[];
  hasEmptyOption?: boolean;
  id?: string;
  label?: string;
  labelIsHidden?: boolean;
  legacyStyles?: boolean;
  name?: string;
  nullable?: boolean;
  placeholder?: string;
  query?: string;
  required?: boolean;
  selectedValue?: string | number;
  setQuery?: React.Dispatch<React.SetStateAction<string>>;
  setSelectedValue?: React.Dispatch<React.SetStateAction<string | number>>;
  // Replace this with `immediate` prop after React is upgrade
  openMenuOnFocus?: boolean;
  tertiaryAction?: React.ReactNode;
  requiredIconOnly?: boolean;
  optionsClasses? : string;
}

/**
 * Returns a list of entries that match the query
 * @param {string} query - The user input to filter by
 * @param {string} entries - An array of iHnryComboBoxEntry objects
 * @returns {array} An array of iHnryComboBoxEntry objects
 */
const defaultFilterFn = (query, entries) => ((query === "" || query === undefined)
  ? entries.slice()
  : entries
    .slice()
    .filter((entry) => entry.value?.toLowerCase().includes(query.trim().toLowerCase())));

const Combobox = ({
  comboboxClasses,
  entries,
  fallbackOption,
  filterBy,
  filterFunction = defaultFilterFn,
  hasEmptyOption = false,
  id,
  label = "Type to search",
  labelIsHidden,
  legacyStyles = true,
  name,
  nullable = false,
  placeholder = "Type to search",
  query,
  required,
  selectedValue,
  setQuery,
  setSelectedValue,
  openMenuOnFocus = false,
  requiredIconOnly = false,
  optionsClasses,
}: iHnryCombobox) => {
  if (
    typeof selectedValue === "undefined"
    || typeof setSelectedValue !== "function"
  ) {
    // Provide local state if one hasn't been provided
    [selectedValue, setSelectedValue] = useState("");
  }

  if (typeof query === "undefined" || typeof setQuery !== "function") {
    [query, setQuery] = useState("");
  }
  const [filteredEntries, setFilteredEntries] = useState(entries);
  const queryInput = useRef<HTMLInputElement>(null);
  const iconClasses = "tw-text-gray-500 hover:tw-text-gray-700";

  /*
   * Returns the list of options that should be searched, with fallbackOption added if requested
   * @returns {array} An array of options in iHnryComboboxEntry format
   */
  const relevantOptions = useCallback(() => {
    const searchList = [...entries];
    if (fallbackOption) searchList.push(fallbackOption);
    return searchList;
  }, [entries, fallbackOption]);

  /*
   * Returns a human friendly display value from the selected iHnryComboboxEntry or an empty string if not found
   * @returns {string} The display value
   */
  const extractDisplayValue = useCallback(() => {
    const searchList = relevantOptions();

    return searchList.find((e) => e.key === selectedValue)?.value || "";
  }, [selectedValue, fallbackOption, entries]);

  /*
   * Runs a custom validation on the input field
   * It also fires a custom change event so this can be picked up in the parent form
   */
  useEffect(() => {
    if (queryInput.current === null) return;

    if (!required || selectedValue) {
      queryInput.current?.setCustomValidity("");
    } else {
      const searchList = relevantOptions();
      if (searchList.find((e) => e.value === query)) {
        queryInput.current?.setCustomValidity("");
      } else {
        queryInput.current?.setCustomValidity("Please select an option.");
      }
    }
    const event = new Event("change", { bubbles: true });
    queryInput.current.dispatchEvent(event);
  }, [queryInput, entries, fallbackOption, query, required, selectedValue]);

  /*
   * Filters entries based on the query and search fields and setFilteredEntries with results
   * We are using promises so external async results can be provided.
   */
  useEffect(() => {
    const matches = filterFunction(query, entries);
    if (fallbackOption) {
      matches.push(fallbackOption);
    }
    setFilteredEntries(matches);
  }, [query, entries, filterBy, fallbackOption]);

  // TODO: Replace this approach to use `immediate` prop after upgrade to React 18
  const searchBtnRef = useRef<HTMLButtonElement>(null);
  const inputFocusRef = useRef(false);

  const handleFocus = () => {
    // show menu when input is focused
    if (openMenuOnFocus && !inputFocusRef.current) {
      searchBtnRef.current?.click();
      inputFocusRef.current = true;
    }
  }

  const handleBlur = () => {
    inputFocusRef.current = false;
  }

  return (
    <div className={comboboxClasses}>
      <HeadlessUICombobox
        value={selectedValue}
        onChange={setSelectedValue}
        // @ts-ignore // Unsure if this is a bug with HeadlessUI or not
        nullable={nullable}
        name={name}
      >
        <div className="tw-relative tw-mt-1">
          <div
            className={classNames("tw-relative tw-w-full tw-cursor-default tw-overflow-hidden tw-bg-white tw-text-left sm:tw-text-sm",
              { "tw-border-b tw-border-b-gray-300 focus-within:tw-border-brand-green": legacyStyles })}
          >
            <HeadlessUICombobox.Label
              className={classNames({
                "tw-sr-only": labelIsHidden,
                "hnry-label": !legacyStyles,
                "hnry-label--legacy": legacyStyles,
                "after:tw-content-['*'] after:tw-inline after:tw-text-red after:tw-ml-1": required || requiredIconOnly,
              })}
            >
              {label}
            </HeadlessUICombobox.Label>
            <div className={classNames("tw-flex", { "tw-gap-x-2": legacyStyles })}>
              <HeadlessUICombobox.Input
                className={classNames({
                  "hnry-comboxbox-with-clear": !legacyStyles && nullable && selectedValue,
                  "hnry-comboxbox": !legacyStyles && !nullable,
                  "hnry-input no-bs": !legacyStyles,
                  "hnry-input--legacy no-border": legacyStyles,
                })}
                displayValue={extractDisplayValue}
                onChange={(event) => setQuery(event.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={placeholder}
                autoComplete="off"
                required={required}
                ref={queryInput}
                id={id}
              />
              <div className={classNames("tw-flex tw-items-center tw-gap-x-3", {
                "tw-absolute tw-inset-y-0 tw-right-0 tw-pt-7 tw-pr-3": !legacyStyles,
                "-tw-ml-[4.5rem]": !legacyStyles && selectedValue,
                "-tw-ml-9": !legacyStyles && !selectedValue,
              })}>
                {(nullable && selectedValue) && (
                  <button type="button" className="tw-ml-4" onClick={() => setSelectedValue("")} id="comboxbox-clear-button">
                    <Icon type="XCircleIcon" classes={iconClasses} />
                    <span className="tw-sr-only">Clear entry</span>
                  </button>
                )}
                <HeadlessUICombobox.Button
                  ref={searchBtnRef}
                  onClick={() => { inputFocusRef.current = true; }}
                >
                  <Icon type="MagnifyingGlassIcon" classes={iconClasses} />
                  <span className="tw-sr-only">Search list</span>
                </HeadlessUICombobox.Button>
              </div>
            </div>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <HeadlessUICombobox.Options
              className={classNames(
                "tw-mt-2 tw-py-1 tw-z-10 tw-absolute tw-w-full tw-overflow-auto tw-max-h-48 sm:tw-max-h-60",
                { [`${optionsClasses}`]: optionsClasses },
                "sm:tw-text-md tw-bg-white tw-text-base tw-text-gray-900 tw-border tw-border-solid tw-border-gray-100",
                "tw-rounded-md tw-shadow-lg tw-ring-1 tw-ring-gray-300 tw-ring-opacity-5 focus:tw-outline-none",
              )}
            >
              {hasEmptyOption &&
                filteredEntries.length === 0 &&
                query !== "" ? (
                  <div className="tw-relative tw-cursor-default tw-text-sm tw-select-none tw-p-4 hover:tw-cursor-pointer">
                    Nothing found.
                  </div>
                ) : (
                  filteredEntries.map((entry) => (
                    <HeadlessUICombobox.Option
                      key={entry.key}
                      className={({ active }) =>
                        `tw-relative tw-cursor-default tw-text-sm tw-select-none tw-px-3.5 tw-py-2.5 hover:tw-cursor-pointer ${active && "tw-bg-gray-50"}`
                      }
                      value={entry.key}
                    >
                      {({ selected, active }) => (
                        <div>
                          {entry.customOption ? (
                            entry.customOption
                          ) : (
                            <>
                              <span
                                className={`tw-block tw-truncate ${selected ? "tw-font-medium" : "tw-font-normal"}`}
                              >
                                {entry.value}
                              </span>
                              {selected ? (
                                <span
                                  className={`tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3 ${active ? "tw-text-white" : "tw-text-indigo-400"}`}
                                />
                              ) : null}
                            </>
                          )}
                        </div>
                      )}
                    </HeadlessUICombobox.Option>
                  ))
                )}
            </HeadlessUICombobox.Options>
          </Transition>
        </div>
      </HeadlessUICombobox>
    </div>
  );
};

export default Combobox;
