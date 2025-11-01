import React, {
  Fragment,
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
} from "react";
import classNames from "classnames";
import { Combobox as HeadlessUICombobox, Transition } from "@headlessui/react";
import Icon from "../../_atoms/icons/icon/Icon";
import { iHnryCombobox } from "./Combobox";


/**
 * Returns a list of entries that match the query
 * @param {string} query - The user input to filter by
 * @param {string} entries - An array of iHnryComboBoxEntry objects
 * @returns {array} An array of iHnryComboBoxEntry objects
 */
const defaultFilterFn = (query, entries) => (query === "" || query === undefined
  ? entries.slice()
  : entries
    .slice()
    .filter((entry) => entry.value.toLowerCase().includes(query.trim().toLowerCase())));

export const ComboBoxNoBorder = ({
  comboboxClasses,
  entries,
  fallbackOption,
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
  tertiaryAction,
  requiredIconOnly = false,
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


  const filterEntries = useCallback(() => {
    const matches = filterFunction(query, entries);
    if (fallbackOption) {
      matches.push(fallbackOption);
    }
    setFilteredEntries(matches);
  }, [entries, fallbackOption, filterFunction, query])
  /*
     * Filters entries based on the query and search fields and setFilteredEntries with results
     * We are using promises so external async results can be provided.
     */
  useMemo(() => {
    filterEntries()
  }, [filterEntries]);

  // TODO: Replace this approach to use `immediate` prop after upgrade to React 18
  const searchBtnRef = useRef<HTMLButtonElement>(null);
  const inputFocusRef = useRef(false);

  const handleFocus = () => {
    // show menu when input is focused
    if (openMenuOnFocus && !inputFocusRef.current && !selectedValue) {
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
        <div className="tw-relative">
          <div className="tw-relative tw-w-full 
                    tw-cursor-default
                     tw-bg-white tw-text-left sm:tw-text-sm">
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
            <div className="
            tw-flex 
            tw-gap-x-2 
            tw-rounded-md 
            tw-shadow-sm 
            tw-ring-1 
            tw-ring-inset 
            tw-ring-gray-300 
            placeholder:tw-text-gray-300
            disabled:tw-text-gray-500
            disabled:tw-cursor-not-allowed
            focus-within:tw-ring-1
            focus-within:tw-ring-inset
            focus-within:tw-ring-brand-200
            focus-within:!tw-outline-none
            ">
              <HeadlessUICombobox.Input
                className={"no-bs-no-ring tw-py-1.5 tw-px-3 !tw-box-shadow-none !tw-border-0 focus:!tw-border-0 focus:!tw-border-b-0 tw-h-2     tw-text-gray-900"}
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
              <span className="tw-pr-2 tw-inline-flex">
                {nullable && selectedValue && (
                  <button className="tw-pr-2" type="button" onClick={() => setSelectedValue("")} id="comboxbox-clear-button">
                    <Icon type="XCircleIcon" classes={iconClasses} />
                    <span className="tw-sr-only">Clear entry</span>
                  </button>
                )}
                <HeadlessUICombobox.Button className={"tw-pr-2"} ref={searchBtnRef} onClick={() => { inputFocusRef.current = true; }}>
                  <Icon
                    type="MagnifyingGlassIcon"
                    classes={iconClasses}
                    aria-hidden="true"
                  />
                  <span className="tw-sr-only">Search list</span>
                </HeadlessUICombobox.Button>
                {tertiaryAction || null}
              </span>
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
              className=
                "tw-absolute tw-max-h-60 tw-w-full tw-overflow-auto tw-bg-white tw-text-base tw-shadow-sm tw-ring-1 tw-ring-black tw-ring-opacity-5 focus:tw-outline-none sm:tw-text-md !tw-z-50">
              {hasEmptyOption && filteredEntries.length === 0 && query !== "" ? 
                (<div className="tw-relative tw-cursor-default tw-text-sm md:tw-text-lg tw-select-none tw-p-4 tw-text-hnry-brand-600 hover:tw-cursor-pointer">
                  Nothing found.
                </div>
                ) : (
                  filteredEntries.map((entry) => (
                    <HeadlessUICombobox.Option
                      key={entry.key}
                      className={({ active }) => 
                        `tw-relative tw-cursor-default tw-text-sm md:tw-text-lg tw-select-none tw-p-4 tw-text-hnry-brand-700 hover:tw-cursor-pointer ${active ? "tw-bg-gray-200" : "" }`
                      }
                      value={entry.key}
                    >
                      {({ selected, active }) => (
                        <>
                          <span className={`tw-block tw-truncate ${selected ? "tw-font-medium" : "tw-font-normal"}`}>
                            {entry.value}
                          </span>
                          {selected ? (
                            <span
                              className={`tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3 ${active ? "tw-text-white" : "tw-text-indigo-400"
                              }`}
                            ></span>
                          ) : null}
                        </>
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

export default ComboBoxNoBorder;
