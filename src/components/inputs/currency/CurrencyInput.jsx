import React, { useState, useEffect } from "react";
import Cleave from "cleave.js/react";

const CurrencyInput = (props) => {
  const {
    label, labelIsHidden, inputProps, blankDefault,
  } = props;
  const [amount, setAmount] = useState("");
  const [labelClasses, setLabelClasses] = useState("active");

  useEffect(() => {
    if (inputProps.value) {
      setAmount(Number.parseFloat(inputProps.value).toFixed(2));
    } else if (blankDefault) {
      setAmount("");
    } else {
      setAmount((0.0).toFixed(2));
    }
  }, []);

  useEffect(() => {
    setAmount(inputProps.value);
  }, [inputProps.value]);

  useEffect(() => {
    if (labelIsHidden) {
      setLabelClasses("active visually-hidden");
    } else {
      setLabelClasses("active");
    }
  }, [inputProps.value]);

  const handleChange = (event) => {
    const { value } = event.target;
    setAmount(value);
    if (inputProps.onChange) {
      inputProps.onChange(event);
    }
  };

  const handleBlur = (event) => {
    const { value } = event.target;
    if (!value) {
      if (blankDefault) {
        setAmount("");
      } else {
        setAmount((0.0).toFixed(2));
      }
    } else {
      const asNumber = Number(value.replace(/\,/g, ""));
      if (asNumber.toFixed(2) === asNumber.toString()) {
        setAmount(asNumber);
      } else {
        setAmount(asNumber.toFixed(2));
      }
    }
    if (inputProps.onBlur) {
      inputProps.onBlur(event);
    }
  };

  return (
    inputProps && <React.Fragment>
      <Cleave
        options={{
          numeral: true,
          numeralThousandsGroupStyle: "thousand",
        }}
        {...inputProps}
        value={amount}
        className={`form-control ${inputProps.className}`}
        onChange={(event) => handleChange(event)}
        onBlur={(event) => handleBlur(event)}
        inputMode="decimal"
        name={inputProps.id || inputProps.name}
        id={inputProps.id || inputProps.name}
      />
      <label className={labelClasses} htmlFor={inputProps.id || inputProps.name}>{label}</label>
      <input type="hidden" name={inputProps.name} value={amount} />
    </React.Fragment>
  );
};

export default CurrencyInput;
