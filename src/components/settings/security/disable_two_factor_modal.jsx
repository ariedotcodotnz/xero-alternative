import React from "react";
import Modal from "../../_molecules/modal/Modal";
import OtpInput from "../../_atoms/otp_input/OtpInput";
import I18n from "../../../utilities/translations";

const DisableTwoFactorModal = ({
  userId,
  setOtpRequired,
  emailTwoFactorEnabled,
  show,
  setShow,
  otp = "",
  setOtp,
  reset,
}) => {

  const disableTwoFactor = () => {
    $.rails.ajax({
      type: "POST",
      dataType: "json",
      url: `/settings/security/${userId}/destroy_two_factor`,
      data: {
        user: { code: otp },
      },
      success: ({ two_factor_enabled, last_attempt, locked }) => {
        setOtp("");

        if (locked) {
          setShow(false);
          setOtpRequired(two_factor_enabled);
          toastr.error(I18n.t("users.security.disable_two_factor_modal.locked_error"));
        } else if (two_factor_enabled) {
          toastr.error(last_attempt
            ? I18n.t("users.security.disable_two_factor_modal.last_attempt_error") 
            : I18n.t("users.security.disable_two_factor_modal.incorrect_password_error"));
        } else {
          setShow(false);
          setOtpRequired(two_factor_enabled);
          toastr.success(emailTwoFactorEnabled 
            ? I18n.t("users.security.disable_two_factor_modal.disable_authy_app_success") 
            : I18n.t("users.security.disable_two_factor_modal.disable_success"));
        }
      },
    });
  };

  return (
    <Modal
      open={show}
      setOpen={setShow}
      onCancel={reset}
      onConfirm={disableTwoFactor}
      title={emailTwoFactorEnabled 
        ? I18n.t("users.security.disable_two_factor_modal.email_mfa_title") 
        : I18n.t("users.security.disable_two_factor_modal.title")}
      confirmCTA="Disable"
      variant="danger"
    >
      <p>{emailTwoFactorEnabled 
        ? I18n.t("users.security.disable_two_factor_modal.email_mfa_body_para1") 
        : I18n.t("users.security.disable_two_factor_modal.body_para1")}</p>
      <p>{emailTwoFactorEnabled 
        ? I18n.t("users.security.disable_two_factor_modal.email_mfa_body_para2") 
        : I18n.t("users.security.disable_two_factor_modal.body_para2")}</p>
      <div className="tw-my-6 tw-py-2 tw-px-0 sm:tw-px-6 tw-mx-0">
        <OtpInput value={otp} onChange={setOtp} inputName="otp_code" />
      </div>
    </Modal>
  );
};

export default DisableTwoFactorModal;
