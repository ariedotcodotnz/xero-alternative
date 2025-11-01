import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

const Checkbox = ({
  name, id, onChange, defaultValue, label, disabled,
}) => {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(defaultValue);
  }, [defaultValue]);

  const handleChange = (e) => {
    const { checked } = e.target;

    setChecked(checked);

    if (onChange) {
      onChange(e, checked);
    }
  };

  const handleKeyUp = (e) => {
    if (e.key === "Enter") {
      if (onChange) onChange(e);
      setChecked(!e.target.checked);
    }
  };

  return (
    <div className="hnry-checkbox">
      <input
        type="checkbox"
        checked={checked}
        name={name}
        id={id}
        onChange={handleChange}
        onKeyUp={handleKeyUp}
        disabled={disabled}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
};

Checkbox.propTypes = {
  onChange: null,
  label: "",
  disabled: false,
};

Checkbox.propTypes = {
  onChange: PropTypes.func,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  disabled: PropTypes.bool,
};

export default Checkbox;
