import React, { useState, useEffect } from "react";

const Toggle = ({
  label, labelIsHidden, inputProps, className, note,
}) => {
  const [isOn, setIsOn] = useState(false);

  useEffect(() => {
    setIsOn(inputProps.value);
  }, [inputProps.value]);

  const handleChange = (event) => {
    setIsOn(!isOn);
    if (inputProps.onChange) {
      inputProps.onChange(event);
    }
  };

  return (
    <div className={`switch${className ? ` ${className}` : ""}`}>
      <label className="switch-container">
        <input type="checkbox" {...inputProps} onChange={handleChange} checked={isOn} role="switch"/>
        <span className="lever" />
        <span className={labelIsHidden ? "visually-hidden" : ""}>{label}</span>
      </label>
      { note && <p className="toggle-note">{note}</p> }
    </div>
  );
};

export default Toggle;
