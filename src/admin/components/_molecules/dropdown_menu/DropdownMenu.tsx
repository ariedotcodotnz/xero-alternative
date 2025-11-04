import React from "react";
import classNames from "classnames";
import * as UIDropdownMenu from "@radix-ui/react-dropdown-menu";
import { IconType } from "@hui/_atoms/icons/icon/Icon";
import Icon from "../../_atoms/icon/Icon";
// import "./styles.scss";

type DropdownMenuOptionsType = {
  url?: string,
  selected: boolean,
  name: string,
  icon: IconType
}

interface iDropdownMenu {
  value: DropdownMenuOptionsType;
  options: DropdownMenuOptionsType[];
  onChange?: () => void;
}

const DropdownMenu = ({
  value,
  options,
  onChange,
}: iDropdownMenu) => (
  <UIDropdownMenu.Root>
    <UIDropdownMenu.Trigger
      className="haui-dropdown-trigger"
      onChange={onChange}
    >
      {value.icon && <Icon type={value.icon} classes="haui-dropdown-jurisdiction-icon" strokeWidth="0"/>}
      {value.name}
      <span className="haui-dropdown-trigger-icon">
        <Icon type="ChevronDownIcon" />
      </span>
    </UIDropdownMenu.Trigger>
    <UIDropdownMenu.Content
      className="haui-dropdown-content"
      align="start"
    >
      {options.map(({ name, url, selected, icon }) => (
        <UIDropdownMenu.Item
          key={`${name}-dropdown-option`}
          className="haui-dropdown-menu-item"
        >
          <a
            href={url}
            className={classNames("haui-dropdown-menu-item-link", {
              "haui-dropdown-menu-item-link--selected": selected,
            })}
          >
            {icon && <Icon type={icon} classes="haui-dropdown-jurisdiction-icon" strokeWidth="0"/>}
            {name}
          </a>
        </UIDropdownMenu.Item>
      ))}
    </UIDropdownMenu.Content>
  </UIDropdownMenu.Root>
)

export default DropdownMenu;
