import React, { useState, useEffect } from "react";
import Toggle from "../../inputs/toggle/Toggle";
import EnableTwoFactorModal from "./enable_two_factor_modal";
import DisableTwoFactorModal from "./disable_two_factor_modal";

const TwoFactorToggle = ({
  user: { id, otpRequiredForLogin, oauthOnly },
  toggleLabelText,
  toggleNoteText,
  emailTwoFactorEnabled,
}) => {
  const twoFactorInitialStep = () => (oauthOnly ? "twoFactorCode" : "passwordValidation");

  const [twoFactorStep, setTwoFactorStep] = useState(twoFactorInitialStep());
  const [otpRequired, setOtpRequired] = useState(otpRequiredForLogin);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [showEnableModal, setShowEnableModal] = useState(false);
  const [otp, setOtp] = useState("");

  useEffect(() => {
    setOtpRequired(otpRequiredForLogin);
  }, [otpRequiredForLogin]);

  useEffect(() => {
    setTwoFactorStep(twoFactorInitialStep());
  }, []);

  const reset = () => {
    setOtpRequired(!otpRequired);
    setTwoFactorStep(twoFactorInitialStep());
    setOtp("");
  };

  const handleToggleChange = ({ target }) => {
    setOtpRequired(target.checked);
    if (target.checked) {
      setShowEnableModal(true);
      setTwoFactorStep(twoFactorInitialStep());
    } else if (!target.checked) {
      setShowDisableModal(true);
    }
  };

  return (
    <>
      <Toggle
        label={toggleLabelText}
        inputProps={{
          name: "user[otp_required_for_login]",
          value: otpRequired,
          onChange: handleToggleChange,
        }}
        note={toggleNoteText}
      />
      <EnableTwoFactorModal
        userId={id}
        reset={reset}
        setOtpRequired={setOtpRequired}
        oauthOnly={oauthOnly}
        show={showEnableModal}
        setShow={setShowEnableModal}
        otp={otp}
        setOtp={setOtp}
        twoFactorStep={twoFactorStep}
        setTwoFactorStep={setTwoFactorStep}
      />
      <DisableTwoFactorModal
        userId={id}
        reset={reset}
        setOtpRequired={setOtpRequired}
        oauthOnly={oauthOnly}
        emailTwoFactorEnabled={emailTwoFactorEnabled}
        show={showDisableModal}
        setShow={setShowDisableModal}
        otp={otp}
        setOtp={setOtp}
      />
    </>
  );
};

export default TwoFactorToggle;
