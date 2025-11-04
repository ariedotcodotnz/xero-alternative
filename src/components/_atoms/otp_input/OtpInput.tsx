import React, { useState } from "react";
import ReactOtpInput from "react-otp-input";
// import "./styles.scss";

const OtpCodeInput = ({
  value,
  onChange,
  inputName,
}: iOtpInput) => {
  const handleInputChange = (newValue) => {
    onChange(newValue);
  };

  if (typeof value === "undefined" || typeof onChange !== "function") {
    [value, onChange] = useState("");
  }

  const parseClipboardValue = (e) => {
    // Ensure that any non-numeric characters are removed from the clipboard data
    const data = e.clipboardData.getData("text");
    const otp = data.replace(/\D/g, "");
    onChange(otp);
  };

  return (
    <div className="otp-input-wrapper">
      <ReactOtpInput
        value={value}
        onChange={handleInputChange}
        numInputs={6}
        renderInput={(props, index) => (
          <>
            <input {...props} className="otp-input" placeholder="0" name={`otp_code_input[${index}]`} onPaste={parseClipboardValue} />
            {index === 2 && <span className="otp-input-divider">–</span>}
          </>
        )}
        inputType="tel"
        containerStyle={{ justifyContent: "space-between", width: "100%" }}
      />
      <input id="otp_input_hidden" type="hidden" value={value} name={inputName} />
    </div>
  );
};
interface iOtpInput {
  value: string;
  onChange: React.Dispatch<React.SetStateAction<string>>,
  inputName: string;
}

export default OtpCodeInput;
