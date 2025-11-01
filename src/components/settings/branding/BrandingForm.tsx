import React, { useState, useEffect } from "react";
import classNames from "classnames";
import Input from "@hui/_atoms/input/Input";
import Switch from "@hui/_atoms/switch/Switch";
import Tooltip from "@hui/_atoms/tooltip/Tooltip";
import Alert from "@hui/_molecules/alert/Alert";
import I18n from "../../../utilities/translations";

const FORBIDDEN_WORDS = ["limited", "ltd", "proprietary", "pty"];
const ctx = { scope: "users.form" };

const containsForbiddenWords = (text) => {
  const allWords = text.split(" ");
  const list = allWords.filter((word) => FORBIDDEN_WORDS.includes(word.toLowerCase()));

  return list.length > 0;
}

interface iBrandingForm {
  tradingNameDefault?: string;
  intercomLink: string;
  hideLegalNameDefault: boolean;
  supportHideLegalNameFeature: boolean;
}

const BrandingForm = ({
  tradingNameDefault,
  intercomLink,
  hideLegalNameDefault,
  supportHideLegalNameFeature,
}: iBrandingForm) => {
  const [showWarning, setShowWarning] = useState(tradingNameDefault ? containsForbiddenWords(tradingNameDefault) : false);
  const [tradingName, setTradingName] = useState(tradingNameDefault || "");
  const [hideLegalNameToggle, setHideLegalNameToggle] = useState(hideLegalNameDefault);
  const [disabledHideLegalName, setDisabledHideLegalName] = useState(tradingNameDefault ? tradingNameDefault.length > 0 : true);

  useEffect(() => {
    setShowWarning(containsForbiddenWords(tradingName));
    setDisabledHideLegalName(tradingName.length <= 0);
  }, []);

  const handleTradingNameChange = (value) => {
    setTradingName(value);
    setShowWarning(containsForbiddenWords(value));
    setDisabledHideLegalName(value.length <= 0);
  }

  const handleTradingNameBlur = (event) => {
    const { value } = event.target;
    setDisabledHideLegalName(value.length <= 0);
    setHideLegalNameToggle(value.length <= 0 ? false : hideLegalNameToggle);
  }

  return (
    <>
      <div className={classNames({ "tw-mb-4": showWarning })}>
        <label className="hnry-label" htmlFor="user_trading_name">
          <span className="tw-flex tw-items-center tw-gap-x-1">
            {I18n.t("trading_name", ctx)}
            <Tooltip
              popoverMessage={I18n.t("trading_name_info", ctx)}
              size="sm"
            />
          </span>
        </label>
        <Input
          name="user[trading_name]"
          id="user_trading_name"
          value={tradingName}
          setValue={handleTradingNameChange}
          labelRendered={false}
          onBlur={handleTradingNameBlur}
        />
      </div>
      {showWarning && (
        <Alert title="Important:" variant="danger">
          <p className="tw-mb-0">
            {`${I18n.t("trading_name_p1", ctx)} `}
            <a href={intercomLink}>{I18n.t("trading_name_p2", ctx)}</a>.
          </p>
        </Alert>
      )}
      <div className="tw-mb-4">
        {supportHideLegalNameFeature && (
          <Switch
            checked={hideLegalNameToggle}
            id="user_branding_settings_hide_legal_name"
            name="user[branding_settings_attributes][hide_legal_name]"
            label={I18n.t("hide_legal_name_label", ctx)}
            onChange={() => { setHideLegalNameToggle(!hideLegalNameToggle); }}
            disabled={disabledHideLegalName}
          >
            <div className="tw-pt-4">{I18n.t("hide_legal_name_label", ctx)}</div>
            <div className="tw-text-gray-400 tw-text-sm tw-font-normal">
              {I18n.t("hide_legal_name_subcopy", ctx)}
            </div>
          </Switch>
        )}
        <input
          type="hidden"
          name="user[branding_settings_attributes][hide_legal_name]"
          value={hideLegalNameToggle ? 1 : 0}
        />
      </div>
    </>
  );
}

export default BrandingForm;
