import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import Input from "./input";
import Suggestions from "./suggestions";
import InvisibleSelect from "./invisible_select";
import { useClickOutside, useCustomEventDispatch } from "../../../utilities/Hooks";
import { toRegexSafe, isIE } from "../../../../components/utils/base_helper";

const Typedown = ({
  dropdownOptions,
  fireChangeOnLoad = true,
  defaultToFallback = true,
  filterBy = null,
  fallbackOption,
  fallbackButtonAction,
  label,
  inputProps,
  allowFromOutsideOptions,
  labelIsHidden,
  iconIsHidden,
  useInputValueForSubmission,
  asTextarea,
  addressProps,
  noEmptySuggestions = false,
  style = null,
  componentId = "",
  iconName,
  invalidText = "",
  alwaysShowAllSuggestions = false,
  manuallyUpdated = false,
  reset,
}) => {
  // Stateful variables
  const [typedValue, setTypedValue] = useState("");
  const [selectedOption, setSelectedOption] = useState([]);
  const [lastSelectedOption, setLastSelectedOption] = useState(null);
  const [isSuggestionOpen, setSuggestionOpen] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(null);
  const [clearInputClicked, setClearInputClicked] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(fallbackOption ? [...dropdownOptions, fallbackOption] : dropdownOptions);
  const TypedownRef = useRef(null);
  const SelectRef = useRef(null);
  const SuggestionsRef = useRef(null);

  // To fix typedValue is not updated, inputProps.value is manually updated
  useEffect(() => {
    if (manuallyUpdated && inputProps && inputProps.value !== typedValue) {
      let value = inputProps.value;

      if (Array.isArray(inputProps.value) && inputProps.value.length > 0) {
        value = inputProps.value[0];
      }

      const selected = filteredOptions.filter(([a]) => a === value);
      setTypedValue(value);
      setSelectedOption(selected);
    }
  }, [inputProps, manuallyUpdated, filteredOptions, typedValue, setTypedValue, setSelectedOption]);

  useEffect(() => { // If this is for the address finder and someone types in the other fields manually then we clear the typedown.
    if (addressProps) {
      if (addressProps.manualTyped) {
        resetTypedown();
      }
    }
  }, [addressProps]);

  useEffect(() => {
    reset && resetTypedown();
  }, [reset]);

  // Close the Suggestions panel when component is not focussed
  useClickOutside(TypedownRef, () => {
    const inputElement = TypedownRef.current.querySelector(asTextarea ? "textarea" : "input");
    if (inputElement) {
      const valueInInput = inputElement.value;
      const isTypedValueValid = filteredOptions.some(([displayName]) => displayName === valueInInput) || allowFromOutsideOptions;

      if (!isTypedValueValid) {
        setTypedValue("");
        setSelectedOption([]);

        if (inputProps.onChange) {
          inputProps.onChange("");
        }
      }
      setSuggestionOpen(false);
    }
  }, addressProps ? [dropdownOptions] : [dropdownOptions, filteredOptions]);
  // Since address_autocomplete typedown uses filteredOptions differently to other Typedowns we do this

  // On Mount - using the initial "value" set in inputProps,
  // auto set the default value
  useEffect(() => {
    const { value } = inputProps;
    // If the Typedown is allowed to have a value not in the list,
    // then set the typedValue to the incoming string value
    if (allowFromOutsideOptions) {
      setTypedValue(value);
    }
    if (value && (Array.isArray(value) && value.length > 0)) {
      setTypedValue(value[0]);
      setSelectedOption(value);
    } else if (fallbackOption && defaultToFallback) {
      setTypedValue(fallbackOption[0]);
      setSelectedOption(fallbackOption);
    }
    setSuggestionOpen(false);
  }, []);

  // Whenever the typed value changes, re-determine the filtered options list
  useEffect(() => {
    if (!typedValue && noEmptySuggestions) { setSuggestionOpen(false); }
    if (addressProps) { addressProps.onInputChange(typedValue); }

    const list = fallbackOption ? [...dropdownOptions, fallbackOption] : dropdownOptions.slice();

    const matches = list.filter(([name, _, args]) => {
      switch (filterBy) {
        case "description": {
          if (args && args.match(new RegExp(toRegexSafe(typedValue.trim()), "gi"))) {
            return true;
          }
        }
        // eslint-disable-next-line no-fallthrough
        default:
          return name.match(new RegExp(toRegexSafe(typedValue), "gi")) || (fallbackOption && name === fallbackOption[0]);
      }
    });

    // If there are google address props use the given suggested options
    if (addressProps) {
      setFilteredOptions(list);
    } else {
      setFilteredOptions(matches);
    }

    if (clearInputClicked) {
      SelectRef.current.dispatchEvent(new Event("change", { bubbles: true }));
      setClearInputClicked(false);
    }
  }, [typedValue, dropdownOptions]);

  // Determine whether the Suggestions box should be open. Should be open if:
  // - there is content typed
  // - and the full typed value does not match what they've selected
  //     (essentially, close the Suggestions box after they select an option)
  useEffect(() => {
    setSuggestionOpen(!!typedValue && (typedValue !== selectedOption[0] && !manuallyUpdated));
  }, [typedValue, selectedOption, manuallyUpdated]);

  const setDispatchEvent = useCustomEventDispatch({
    eventName: "fieldValueChange",
    detail: { target: TypedownRef.current, type: "typedown" },
  });

  // Handler to update state when user types
  const handleInputChange = (event) => {
    const { value } = event.target;
    setTypedValue(value);
    inputProps.onType && inputProps.onType(event);
    setDispatchEvent(true);
  };

  // Reset the active suggestion when the suggestions change
  useEffect(() => {
    if (activeSuggestion >= filteredOptions.length) {
      setActiveSuggestion(null);
    }
  }, [activeSuggestion]);

  // Set the selected option and input value when the user selects an option
  const handleOptionSelect = (option) => {
    if (option) {
      if (fallbackButtonAction && JSON.stringify(option) === JSON.stringify(fallbackOption)) {
        // If the typedown has a fallbackButtonAction prop and they select the fallback option,
        // then we treat the fallback option as a button which clears the typedown and runs the fallbackButtonAction.
        resetTypedown();
        setSuggestionOpen(false);
        fallbackButtonAction();
        return;
      }
      const [displayName, code] = option;
      setTypedValue(displayName);
      setLastSelectedOption(selectedOption[1]);
      setSelectedOption([displayName, code]);
      if (inputProps.onChange) {
        inputProps.onChange(code, option);
      }

      setDispatchEvent(true);

      // Inform user that the form has unsaved changes
      if (selectedOption[0] !== displayName) {
        window.unsaved_changes = true;
      }
    }
  };

  // Open the Suggestions panel when the user clicks the input
  const handleInputClick = () => {
    if (!typedValue && noEmptySuggestions) {
      setSuggestionOpen(false);
      return;
    }
    setSuggestionOpen(true);

    if (alwaysShowAllSuggestions) {
      setFilteredOptions(dropdownOptions);
    }
  };

  // Reset Typedown
  const resetTypedown = () => {
    setLastSelectedOption(selectedOption[1]);
    setTypedValue("");
    setClearInputClicked(true);
    if (inputProps.onChange) {
      inputProps.onChange("");
    }
  };

  return (
    isIE() ? (
      <InvisibleSelect
        hasHadInitialValue={!!inputProps.value}
        {...{
          lastSelectedOption, clearInputClicked, dropdownOptions, fallbackOption, fireChangeOnLoad,
        }}
        ref={SelectRef}
        name={inputProps.name}
        required={inputProps.required}
        className="mdb-select ie-fallback"
        id={inputProps.id || inputProps.name}
        value={typedValue === "" ? "" : selectedOption[1]}
        label={label}
        defaultToFallback={defaultToFallback}
      />
    )
      : (
        <>
          <div
            className="typedown"
            ref={TypedownRef}
            style={{ style }}
          >
            <InvisibleSelect
              hasHadInitialValue={!!inputProps.value}
              {...{
                lastSelectedOption, clearInputClicked, dropdownOptions, fallbackOption, fireChangeOnLoad,
              }}
              ref={SelectRef}
              name={useInputValueForSubmission ? null : inputProps.name}
              required={inputProps.required}
              id={inputProps.id || inputProps.name}
              value={typedValue === "" ? "" : selectedOption[1]}
              defaultToFallback={defaultToFallback}
              readOnly
            />
            <Input
              label={label}
              inputProps={inputProps}
              id={`${componentId}${inputProps.id || inputProps.name}`}
              onChangeHandler={handleInputChange}
              typedValue={typedValue}
              isSuggestionOpen={isSuggestionOpen}
              filteredSuggestions={filteredOptions}
              activeSuggestion={activeSuggestion}
              setActiveSuggestion={setActiveSuggestion}
              setSelectedOption={handleOptionSelect}
              onClick={() => handleInputClick()}
              resetTypedown={resetTypedown}
              suggestionsRef={SuggestionsRef}
              labelIsHidden={labelIsHidden}
              iconIsHidden={iconIsHidden}
              allowFromOutsideOptions={allowFromOutsideOptions}
              useInputValueForSubmission={useInputValueForSubmission}
              asTextarea={asTextarea}
              iconName={iconName}
              invalidText={invalidText}
            />
            <Suggestions
              input={typedValue}
              options={filteredOptions}
              setSelectedOption={handleOptionSelect}
              inputId={inputProps.id || inputProps.name}
              activeSuggestion={activeSuggestion}
              setActiveSuggestion={setActiveSuggestion}
              isSuggestionOpen={isSuggestionOpen}
              ref={SuggestionsRef}
              surpressWarning={allowFromOutsideOptions}
              selected={typedValue}
            />
          </div>
          {invalidText.length > 0 && <p className="validation-errors">{invalidText}</p>}
        </>
      ));
};

Typedown.propsType = {
  invalidText: PropTypes.string,
  componentId: PropTypes.string,
  filterBy: PropTypes.string,
  fireChangeOnLoad: PropTypes.bool,
  defaultToFallback: PropTypes.bool,
  alwaysShowAllSuggestions: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  noEmptySuggestions: PropTypes.bool,
  manuallyUpdated: PropTypes.bool,
  reset: PropTypes.bool,
};

export default Typedown;
