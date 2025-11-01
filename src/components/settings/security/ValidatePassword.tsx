import React from "react";
import I18n from "../../../utilities/translations";

interface iValidatePassword {
  handlePasswordChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  inputPassword?: string;
}

const ValidatePassword = ({
  handlePasswordChange,
  inputPassword = "",
}: iValidatePassword) => (
  <>
    <p>
      {I18n.t(
        "users.security.enable_two_factor_modal.validate_password.paragraph",
      )}
    </p>
    <label htmlFor="user-password">
      {I18n.t("users.security.enable_two_factor_modal.validate_password.label")}
    </label>
    <input
      name="user[password]"
      id="user-password"
      className="form-control"
      type="password"
      value={inputPassword}
      onChange={handlePasswordChange}
      required={true}
    />
  </>
);

export default ValidatePassword;
