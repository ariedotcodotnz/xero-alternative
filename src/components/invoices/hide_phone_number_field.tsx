import React from "react";
import Toggle from "../inputs/toggle/Toggle";
import I18n from "../../utilities/translations";

interface iHidePhoneNumber {
  hidePhoneNumber: boolean;
  setHidePhoneNumber: (value: boolean) => void;
}

const HidePhoneNumberField = ({
  hidePhoneNumber,
  setHidePhoneNumber,
}: iHidePhoneNumber) => (
  <Toggle
    label={I18n.t("invoices.form.hide_phone_number_label")}
    inputProps={{
      id: "hide-my-phone-number",
      name: "invoice[hide_phone_number]",
      value: hidePhoneNumber,
      onChange: () => setHidePhoneNumber(!hidePhoneNumber),
    }}
  />
);

export default HidePhoneNumberField;
