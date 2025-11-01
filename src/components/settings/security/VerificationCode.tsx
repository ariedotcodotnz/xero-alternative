import React from "react";
import OtpInput from "../../_atoms/otp_input/OtpInput";
import I18n from "../../../utilities/translations";

interface iVerificationCode {
  otp?: string;
  setOtp: React.Dispatch<React.SetStateAction<string>>;
}

const VerificationCode = ({ otp = "", setOtp }: iVerificationCode) => (
  <>
    <p>
      {I18n.t(
        "users.security.enable_two_factor_modal.verification_code.paragraph",
      )}
    </p>
    <div className="tw-my-6 tw-mx-0 tw-py-2 tw-px-0 sm:tw-px-6">
      <OtpInput value={otp} onChange={setOtp} inputName="otp_code" />
    </div>
  </>
);

export default VerificationCode;
