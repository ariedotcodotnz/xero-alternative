import React, { useEffect, useState } from "react";

const Input = ({
  name, value, label, onChange, required,
}) => {
  const [typedValue, setTypedValue] = useState(value);

  useEffect(() => { // Use effect is being used when autocomplete fills out the rest.
    setTypedValue(value);
  }, [value]);

  const onInputChange = (input) => { // Input change is being used when we type something in it.
    setTypedValue(input);
    onChange(input); // Calls the on change from the address autocomplete, to clear the google place id.
  };

  const nameToId = (name) => name.replace(/\[/g, "_").replace(/\]/g, "");

  return (
    <div className="col">
      <div className={required ? "md-form required" : "md-form"}>
        <input
          id={nameToId(name)}
          name={name}
          value={typedValue}
          onChange= {(event) => onInputChange(event.target.value)}
          required={required}
          className="form-control"
          type="text"
        />
        <label htmlFor={nameToId(name)}>{label}</label>
      </div>
    </div>
  );
};

export default Input;
