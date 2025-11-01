import React, { useState, useEffect } from "react";

const InvisibleSelect = React.forwardRef(({
  dropdownOptions, fallbackOption, defaultToFallback, fireChangeOnLoad, clearInputClicked, lastSelectedOption, hasHadInitialValue, label, ...selectProps
}, ref) => {
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    if ((fireChangeOnLoad && selectProps.value)) {
      ref.current.dispatchEvent(new Event("change", { bubbles: true }));
    } else {
      ref.current.dispatchEvent(new Event("initialize", { bubbles: true }));
    }
    if ((hasHadInitialValue && !isFirstRender)) {
      if (selectProps.value) {
        if (lastSelectedOption) {
          if (lastSelectedOption !== selectProps.value) {
            ref.current.dispatchEvent(new Event("change", { bubbles: true }));
          }
        }
      }
    } else if (!hasHadInitialValue && !isFirstRender) {
      if (selectProps.value) {
        if (lastSelectedOption !== selectProps.value) {
          ref.current.dispatchEvent(new Event("change", { bubbles: true }));
        }
      }
    } else {
      setIsFirstRender(false);
    }
  }, [selectProps.value]);

  return (
    <React.Fragment>
      { label && <label className="active" htmlFor={selectProps.id}>{label}</label>}
      <select
        {...selectProps}
        ref={ref}
        tabIndex="-1"
        >
        <FallbackOption {...{ selectProps, fallbackOption, defaultToFallback }} />
          {dropdownOptions.map(([displayName, code, extraArgs]) => (
            <option
              value={code}
              key={`${displayName}-${code}`}
              {...((typeof extraArgs === "object") && extraArgs)}
            >
              {displayName}
            </option>
          ))}
      </select>
    </React.Fragment>
  );
});

const FallbackOption = ({ selectProps, fallbackOption, defaultToFallback }) => {
  const { value: selectedValue } = selectProps;

  // If we have a fallback that we do not want to default to, we will default to whatever was given to us.
  if (!defaultToFallback) {
    return <option value={selectedValue}>{""}</option>;
  // If theres no selected value passed in, and the fallback is a default option
  // (e.g.: Reconciling to a client in Reconciliations)
  } if (selectedValue === "" && fallbackOption && fallbackOption[1] === "") {
    return <option value="">{fallbackOption[0]}</option>;
  // Otherewise, if there is a fallback that is still a valid option
  // (e.g.: Other work type in Job Type Select)
  } if (fallbackOption && fallbackOption[1]) {
    return <option value={fallbackOption[1]}>{fallbackOption[0]}</option>;
    // Else show a default prompt
  }
  return <option value="">Choose an Option</option>;
};

InvisibleSelect.displayName = "InvisibleSelect";

export default InvisibleSelect;
