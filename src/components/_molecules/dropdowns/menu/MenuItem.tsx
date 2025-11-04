import React from "react";
import { Menu } from "@headlessui/react";
import classNames from "classnames";
import Icon, { IconType } from "../../../_atoms/icons/icon/Icon";
// import "./styles.scss";

interface iMenuItem {
  asButton?: boolean;
  confirm?: string;
  href?: string;
  iconType?: IconType;
  id?: string;
  label: string;
  method?: HttpMethod | undefined;
  remote?: string;
  trackClick?: TrackClick;
  /**
   * Optional click handler
   */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}

const MenuItem = ({
  asButton = false,
  confirm = undefined,
  href = "",
  iconType = undefined,
  id = undefined,
  label,
  method = undefined,
  onClick = undefined,
  remote = undefined,
  trackClick = null,
  disabled = false,
}: iMenuItem) => (
  <Menu.Item>
    {({ active }) =>
      asButton ? (
        <button
          type="button"
          className={classNames("hnry-menu-item-link", {
            disabled,
            active: !disabled,
          })}
          onClick={onClick}
          data-track-click={trackClick ? JSON.stringify(trackClick) : null}
          disabled={disabled}
        >
          {iconType && <Icon type={iconType} />}
          {label}
        </button>
      ) : (
        <a
          href={href}
          data-remote={remote}
          className={classNames("hnry-menu-item-link", { active })}
          data-method={method}
          data-confirm={confirm}
          id={id}
          data-track-click={trackClick && JSON.stringify(trackClick)}
        >
          {iconType && <Icon type={iconType} />}
          {label}
        </a>
      )
    }
  </Menu.Item>
);

export default MenuItem;
