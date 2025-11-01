import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Tooltip from "../../tooltip";

const Dropdown = ({
  id,
  name,
  label,
  hidden = false,
  hiddenInputName = "",
  invalidText = "",
  disabled = false,
  wrapperClasses = "",
  selectValue = "",
  onChange = () => { },
  optionEls,
  required = false,
  tooltip,
}) => {
  const select = useRef(null);
  const selectWrapper = useRef(null);
  const [options, setOptions] = useState(optionEls);
  const showToolTip = typeof tooltip !== "undefined";

  const val = selectValue || "";

  useEffect(() => {
    if (select.current) {
      $(select.current).material_select();
    }
    updateState();
  }, [select.current, options]);

  useEffect(() => {
    setOptions(optionEls);
  }, [optionEls]);

  useEffect(() => {
    document.addEventListener("click", onUserInteraction);
    document.addEventListener("keydown", onUserInteraction);
    updateState();

    // Remove listeners on un-mount
    return () => {
      document.removeEventListener("click", onUserInteraction);
      document.removeEventListener("keydown", onUserInteraction);
    };
  }, []);

  const onUserInteraction = ({ target }) => {
    if (selectWrapper.current.contains(target) || target === document.body) {
      updateState();
    }
  };

  const updateState = () => {
    const selectedValue = select.current.value;
    const selectedEl = select.current;
    const selectedOptionEl = select.current.options[select.current.selectedIndex];
    const selectedText = selectedOptionEl?.text;

    if (onChange) {
      onChange({
        selectedValue,
        selectedText,
        selectedOptionEl,
        selectedEl,
      });
    }
  };

  return (
    <div
      className={classNames("md-form", wrapperClasses, { required: !!required }, { hidden: !!hidden }, { invalid: !!invalidText.length })}
      ref={selectWrapper}
      id={`${id}-wrapper`}
    >
      <select
        ref={select}
        className="mdb-select inline-select"
        name={name}
        id={id}
        value={val}
        readOnly
        disabled={disabled}
      >
        {options.map((opt) => {
          const { disabled: optDisabled, selected, ...rest } = opt.attributes;
          return (
            <option key={opt.value} value={opt.value} disabled={optDisabled || false} {...rest}>
              {opt.label}
            </option>
          );
        })}
      </select>
      {showToolTip
        && <label htmlFor={id}>{label}
          <Tooltip text={tooltip.text} link={tooltip.link} sameWindow={true} icon="question-circle" otherClasses="pl-1" />
        </label>
      }
      {!showToolTip
        && <label htmlFor={id}>{label}</label>
      }
      <input type="hidden" name={hiddenInputName} value={val} onChange={() => { }} />
      {invalidText.length > 0 && <p className="validation-errors">{invalidText}</p>}
    </div>
  );
};

Dropdown.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  hidden: PropTypes.bool,
  hiddenInputName: PropTypes.string,
  invalidText: PropTypes.string,
  disabled: PropTypes.bool,
  wrapperClasses: PropTypes.string,
  selectValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onChange: PropTypes.func,
  optionEls: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
    attributes: PropTypes.shape({
      disabled: PropTypes.bool,
      "data-allow-mileage-expense": PropTypes.bool,
    }),
  })).isRequired,
  required: PropTypes.bool,
};

export default Dropdown;
