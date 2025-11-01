import React, { useEffect } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Search from "../../../../assets/images/icons/search.svg";
import ClearButton from "../_elements/clear_button";
import Textarea from "./textarea";

const Input = ({
  label,
  inputProps,
  typedValue,
  onChangeHandler,
  onClick,
  isSuggestionOpen,
  filteredSuggestions,
  activeSuggestion,
  setActiveSuggestion,
  setSelectedOption,
  resetTypedown,
  suggestionsRef,
  id,
  labelIsHidden = false,
  iconIsHidden = false,
  allowFromOutsideOptions,
  useInputValueForSubmission,
  asTextarea,
  iconName = Search,
  invalidText = "",
}) => {
  // Extract other props needed to be passed to the input
  const {
    type, disabled, value, name, onChange, onType, ...otherInputProps
  } = inputProps;

  useEffect(() => {
    suggestionsRef.current.scrollTo(0, 0);
  }, [typedValue]);

  // Set the active selected option to the previous option
  const handleArrowUp = () => {
    let newIndex;
    if (activeSuggestion === null) {
      newIndex = 0;
    } else if (activeSuggestion > 0 && activeSuggestion < filteredSuggestions.length) {
      newIndex = activeSuggestion - 1;
    }
    if (newIndex !== undefined) {
      scrollOptionIntoView(newIndex, "up");
      setActiveSuggestion(newIndex);
    }
  };

  // Set the active selected option to the next option
  const handleArrowDown = () => {
    let newIndex;
    if (activeSuggestion === null) {
      newIndex = 0;
    } else if (activeSuggestion >= 0 && activeSuggestion < filteredSuggestions.length - 1) {
      newIndex = activeSuggestion + 1;
    }
    if (newIndex !== undefined) {
      scrollOptionIntoView(newIndex, "down");
      setActiveSuggestion(newIndex);
    }
  };

  // Set the currently active option as the typedown content
  const handleEnter = (event) => {
    if (!asTextarea) {
      event.preventDefault();
      setSelectedOption(filteredSuggestions[activeSuggestion]);
    }
  };

  // Reset typedown when ESC is pressed
  const handleEscape = () => {
    resetTypedown();
  };

  // // When the user unfocuses the typedown, set the activelySelected option
  // // or if one isnt selected, it will reset and close the typedown
  const handleBlur = () => {
    // Don't try to validated the selected option if the Typedown
    // is allowed to have a value outside of the provided suggestions
    if (allowFromOutsideOptions) return;

    if (activeSuggestion) {
      setSelectedOption(filteredSuggestions[activeSuggestion]);
    } else {
      resetTypedown();
    }
  };

  // Intercept keypresses and take appropriate action
  // This is to comply to the WAI-ARIA spec
  const handleKeyDown = (event) => {
    if (!isSuggestionOpen) {
      return;
    }
    const { key } = event;

    if (key === "ArrowUp") {
      handleArrowUp();
    }
    if (key === "ArrowDown") {
      handleArrowDown();
    }
    if (key === "Enter") {
      handleEnter(event);
    }
    if (key === "Escape") {
      handleEscape(event);
    }
    if (key === "Tab") {
      handleBlur(event);
    }
  };

  const scrollOptionIntoView = (optionIndex, direction) => {
    const targetElement = suggestionsRef.current.querySelectorAll("li")[optionIndex];

    const { height: targetElementHeight, top: targetElementTop } = targetElement.getClientRects()[0];
    const { height: suggestionsHeight, top: suggestionsTop } = suggestionsRef.current.getClientRects()[0];

    const scrollDistance = targetElementHeight;
    const bottomOfSuggestionsBox = suggestionsTop + suggestionsHeight - (scrollDistance * 2);
    const topOfSuggestionsBox = suggestionsTop;

    if (targetElementTop > bottomOfSuggestionsBox && direction === "down") {
      suggestionsRef.current.scrollBy(0, scrollDistance);
    }
    if (targetElementTop < topOfSuggestionsBox && direction === "up") {
      suggestionsRef.current.scrollBy(0, -scrollDistance);
    }
  };

  return (
    <div
      className={classNames(
        "md-form",
        { "!tw-mb-0": labelIsHidden },
        { required: inputProps.required },
      )}
      role="combobox"
      aria-controls={`${id}_listbox`}
      aria-expanded={!!isSuggestionOpen}
      aria-haspopup="listbox"
      id={`${id}_combobox`}
      aria-labelledby={`${id}_label`}
    >
      {asTextarea ? (
        <Textarea
          className="form-control md-textarea"
          disabled={inputProps.disabled}
          value={typedValue}
          onClick={onClick}
          onChange={(event) => onChangeHandler(event)}
          onKeyDown={(event) => handleKeyDown(event)}
          {...otherInputProps}
          name={useInputValueForSubmission ? name : null}
          id={`${id}_typedown`}
          autoComplete="off"
          aria-autocomplete="list"
          aria-activedescendant={activeSuggestion && `${id}-option-${activeSuggestion}`}
        />
      ) : (
        <input
          className={classNames("form-control", { invalid: invalidText.length })}
          type={inputProps.type}
          disabled={inputProps.disabled}
          value={typedValue}
          onClick={onClick}
          onChange={(event) => onChangeHandler(event)}
          onKeyDown={(event) => handleKeyDown(event)}
          {...otherInputProps}
          name={useInputValueForSubmission ? name : null}
          id={`${id}_typedown`}
          autoComplete="off"
          aria-autocomplete="list"
          aria-activedescendant={activeSuggestion && `${id}-option-${activeSuggestion}`}
        />
      )}
      {
        /* eslint-disable xss/no-mixed-html */
      }
      <label
        htmlFor={`${id}_typedown`}
        id={`${id}_label`}
        dangerouslySetInnerHTML={{ __html: label }}
        className={labelIsHidden ? "visually-hidden" : ""}
      />
      {
      /* eslint-enable xss/no-mixed-html */
      }
      <ClearButton
        isVisible={!inputProps.disabled && typedValue}
        onClick={() => resetTypedown()}
      />
      {!iconIsHidden && <img src={iconName} className="icon" aria-hidden="true" alt="icon" />}
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  inputProps: PropTypes.object,
  typedValue: PropTypes.string,
  onChangeHandler: PropTypes.func,
  onClick: PropTypes.func,
  isSuggestionOpen: PropTypes.bool,
  filteredSuggestions: PropTypes.array,
  activeSuggestion: PropTypes.object,
  setActiveSuggestion: PropTypes.func,
  setSelectedOption: PropTypes.func,
  resetTypedown: PropTypes.func,
  suggestionsRef: PropTypes.object,
  id: PropTypes.string,
  labelIsHidden: PropTypes.bool,
  allowFromOutsideOptions: PropTypes.bool,
  useInputValueForSubmission: PropTypes.bool,
  asTextarea: PropTypes.bool,
  iconName: PropTypes.string,
  iconIsHidden: PropTypes.bool,
  invalidText: PropTypes.string,
};

export default Input;
