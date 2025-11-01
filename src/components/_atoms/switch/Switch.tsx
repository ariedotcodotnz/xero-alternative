import React from "react";
import classNames from "classnames";
import { Switch as HeadlessSwitch } from "@headlessui/react";
import "./styles.scss";

export interface iSwitch {
  checked: boolean;
  id?: string;
  isAdmin?: boolean;
  label?: string;
  name?: string;
  onChange: (checked: boolean) => void;
  stacked?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const Switch = ({
  checked = false,
  id,
  isAdmin = false,
  label = "Enable",
  name,
  onChange,
  stacked = false,
  disabled = false,
  children,
  className = "hnry-switch-label",
}: iSwitch) => (
  <HeadlessSwitch.Group
    as="div"
    className={classNames("hnry-switch-container", {
      "hnry-switch--stacked": stacked,
    })}
  >
    <div className="hnry-switch-input">
      <HeadlessSwitch
        checked={checked}
        onChange={onChange}
        id={id}
        name={name}
        className={classNames("hnry-switch", {
          "tw-bg-brand-green-600": !isAdmin && checked && !disabled,
          "tw-bg-gray-400": !isAdmin && !checked && !disabled,
          "tw-bg-gray-200 hover:tw-cursor-not-allowed": !isAdmin && disabled,
          "tw-bg-admin-600": isAdmin && checked && !disabled,
          "tw-bg-admin-400": isAdmin && !checked && !disabled,
          "tw-bg-admin-200 hover:tw-cursor-not-allowed": isAdmin && disabled,
        })}
        disabled={disabled}
      >
        <span className="tw-sr-only">{label}</span>
        <span
          className={`${
            checked ? "tw-translate-x-5" : "tw-translate-x-0"
          } hnry-switch-toggle`}
        />
      </HeadlessSwitch>
    </div>
    <HeadlessSwitch.Label
      as="div"
      className={classNames(className, {
        "tw-text-admin-500": isAdmin,
      })}
    >
      {children || label}
    </HeadlessSwitch.Label>
  </HeadlessSwitch.Group>
);

export default Switch;
