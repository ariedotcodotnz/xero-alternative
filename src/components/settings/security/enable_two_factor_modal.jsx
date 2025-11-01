import React, { useEffect, useState } from "react";
import Modal from "../../_molecules/modal/Modal";
import ValidatePassword from "./ValidatePassword";
import TwoFactorSetupCode from "./TwoFactorSetupCode";
import VerificationCode from "./VerificationCode";
import I18n from "../../../utilities/translations";

const EnableTwoFactorModal = ({
  userId,
  reset,
  setOtpRequired,
  oauthOnly,
  show,
  setShow,
  otp,
  setOtp,
  twoFactorStep,
  setTwoFactorStep,
}) => {
  const [inputPassword, setInputPassword] = useState("");
  const [otpSecret, setOtpSecret] = useState("");
  const [code, setCode] = useState("");

  const resetInputs = () => {
    setInputPassword("");
    setCode("");
    setOtpSecret("");
    setOtp("");
  };

  const cancel = () => {
    resetInputs();
    reset();
  };

  const validatePasswordSubmit = () => {
    $.rails.ajax({
      type: "POST",
      dataType: "json",
      url: `/settings/security/${userId}/validate_password`,
      data: {
        user: { password: inputPassword },
      },
      success: (resp) => {
        const { last_attempt, valid, locked } = resp;

        if (locked) {
          cancel();
          setShow(false);
          toastr.error(I18n.t("users.security.enable_two_factor_modal.password_locked_error"));
        } else if (valid) {
          const { code, otp_secret } = resp;
          setTwoFactorStep("twoFactorCode");
          setCode(code);
          setOtpSecret(otp_secret);
        } else {
          resetInputs();
          toastr.error(last_attempt
            ? I18n.t("users.security.enable_two_factor_modal.password_last_attempt_error") 
            : I18n.t("users.security.enable_two_factor_modal.password_incorrect_error"));
        }
      },
    });
  };

  useEffect(() => {
    if (show && oauthOnly && twoFactorStep === "twoFactorCode") {
      validatePasswordSubmit();
    }
  }, [oauthOnly, twoFactorStep, show]);

  const handlePasswordChange = ({ target }) => {
    setInputPassword(target.value);
  };

  const TWO_FACTOR_STEPS = {
    passwordValidation: {
      content: <ValidatePassword handlePasswordChange={handlePasswordChange} inputPassword={inputPassword} />,
      confirmCTA: "Next",
      onConfirm: () => {
        validatePasswordSubmit();
      },
      title: I18n.t("users.security.enable_two_factor_modal.step_1_title"),
    },
    twoFactorCode: {
      content: <TwoFactorSetupCode otpSecret={otpSecret} code={code} />,
      confirmCTA: "Next",
      onConfirm: () => { setTwoFactorStep("validateTwoFactorCode"); },
      title: I18n.t("users.security.enable_two_factor_modal.step_2_title"),
    },
    validateTwoFactorCode: {
      content: <VerificationCode otp={otp} setOtp={setOtp}/>,
      confirmCTA: "Verify",
      onConfirm: () => {
        $.rails.ajax({
          type: "POST",
          dataType: "json",
          url: `/settings/security/${userId}/create_two_factor`,
          data: {
            user: {
              code: otp,
              otp_required_for_login: true,
            },
          },
          success: ({ two_factor_enabled }) => {
            if (two_factor_enabled) {
              toastr.success(I18n.t("users.security.enable_two_factor_modal.validate_two_factor_success"));
              resetInputs();
              setShow(false);
              setOtpRequired(true);
            } else {
              resetInputs();
              toastr.error(I18n.t("users.security.enable_two_factor_modal.validate_two_factor_error"));
            }
          },
        });
      },
      title: I18n.t("users.security.enable_two_factor_modal.step_3_title"),
    },
  };

  return (
    <Modal
      open={show}
      setOpen={setShow}
      onConfirm={TWO_FACTOR_STEPS[twoFactorStep].onConfirm}
      title={TWO_FACTOR_STEPS[twoFactorStep].title}
      confirmCTA={TWO_FACTOR_STEPS[twoFactorStep].confirmCTA}
      onCancel={cancel}
    >
      {TWO_FACTOR_STEPS[twoFactorStep].content}
    </Modal>
  );
};

export default EnableTwoFactorModal;
