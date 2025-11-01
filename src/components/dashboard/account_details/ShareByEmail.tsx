import React from "react";
import Button from "../../_atoms/button/Button";
import { UserAccountDetails } from "../../../types/user.type";
import Tooltip from "../../_atoms/tooltip/Tooltip";
import I18n from "../../../utilities/translations";

interface ShareByEmailProps {
  backToMainButton: () => void;
  currentUser: UserAccountDetails;
  onInputChange: (value: string) => void;
  isValid: boolean;
  accountType?: string;
  inputValue: string;
}

const ctx = { scope: "account_details_mailer.template" };

const ShareByEmail = ({
  backToMainButton,
  currentUser,
  accountType,
  onInputChange,
  isValid,
  inputValue,
}: ShareByEmailProps) => {
  const handleClick = () => {
    backToMainButton();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    onInputChange(value);
  };

  const emailContent = () => (
    <>
      <p>{I18n.t("line_1", ctx)}</p>
      <p>{I18n.t("line_2", ctx)}</p>
      <p>{I18n.t("line_3", ctx)}</p>
      {accountType === "International" ? (
        <ul className="tw-list-none">
          <li>
            <strong>{I18n.t("account_name", ctx)}</strong>:{" "}
            {currentUser.accountName}
          </li>
          {"bsb" in currentUser && (
            <li>
              <strong>{I18n.t("bsb", ctx)}</strong>: {currentUser.bsb}
              <br />
            </li>
          )}
          <li>
            <strong>{I18n.t("account_number", ctx)}</strong>:{" "}
            {currentUser.accountNumber}
          </li>
          <li>
            <strong>{I18n.t("bank_name", ctx)}</strong>: {currentUser.bankName}
          </li>
          {"swiftCode" in currentUser && (
            <li>
              <strong>{I18n.t("swift_code", ctx)}</strong>:{" "}
              {currentUser.swiftCode}
            </li>
          )}
        </ul>
      ) : (
        <ul className="tw-list-none">
          <li>
            <strong>{I18n.t("account_name", ctx)}</strong>:{" "}
            {currentUser.accountName}
          </li>
          {currentUser.jurisdiction === "uk" && (
            <li>
              <strong>{I18n.t("bank_account_type", ctx)}</strong>: Business
            </li>
          )}
          {"bsb" in currentUser && (
            <li>
              <strong>{I18n.t("bsb", ctx)}</strong>: {currentUser.bsb}
            </li>
          )}
          <li>
            <strong>{I18n.t("account_number", ctx)}</strong>:{" "}
            {currentUser.accountNumber}
          </li>
        </ul>
      )}
      {currentUser.jurisdiction === "nz" && (
        <p>
          {I18n.t("confirmation_of_payee_text", ctx)}{" "}
          <a
            href={I18n.t("confirmation_of_payee_link_url", ctx)}
            target="_blank"
            rel="noreferrer"
          >
            {I18n.t("confirmation_of_payee_link_text", ctx)}
          </a>
          .
        </p>
      )}
      <p>{I18n.t("sign_off", ctx)}</p>
      <p>{currentUser.fullName}</p>
    </>
  );

  return (
    <>
      <div className="tw-my-3 tw-flex tw-items-center">
        <Button
          onClick={handleClick}
          iconType="ArrowLeftIcon"
          variant="link"
          classes="!tw-text-left"
        >
          Back
        </Button>
      </div>

      <div className="alert tw-border-1 tw-bg-gray-50 tw-font-light tw-text-gray-900">
        {emailContent()}
      </div>

      <div className="tw-row tw-mt-4">
        <div className="tw-col-sm-12 tw-flex tw-flex-col tw-pt-1">
          <div className="tw-flex tw-items-center">
            <label htmlFor="recipient" className="active tw-mb-0 tw-pr-1">
              Recipient email address(es)
            </label>
            <Tooltip
              popoverMessage={I18n.t("clients.form.multiple_email_entry")}
            />
          </div>
          <div>
            <input
              type="text"
              name="recipient"
              placeholder="jane@example.com"
              className={`form-control ${!isValid ? "invalid" : ""}`}
              onChange={handleInputChange}
              value={inputValue}
            />
            {!isValid && (
              <p className="validation-errors">
                {I18n.t(
                  "home.index.share_account_details.email.validation_error_message",
                )}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ShareByEmail;
