import React, { Fragment, useMemo, useState } from "react";
import Logo from "../../../../../assets/images/hnry-logo-name-only-inverted.svg";
import Icon from "../../_atoms/icon/Icon";
import { navItemType, jurisdictionType } from "./types";
import Avatar, { iAvatar } from "../../_atoms/avatar/Avatar";
import NavigationMenuItem from "./NavigationMenuItem";
import DropdownMenu from "../../_molecules/dropdown_menu/DropdownMenu";
import NavigationSubmenu from "./NavigationSubmenu";
// import "./styles.scss";

export interface iNavigationSidebar {
  items: navItemType[];
  jurisdictions: jurisdictionType[];
  adminUser: iAvatar;
}

const NavigationSidebar = ({
  items,
  jurisdictions,
  adminUser,
}: iNavigationSidebar) => {
  const [selectedItem, setSelectedItem] = useState(null);

  const selectedJurisdiction = useMemo(() => {
    const index = jurisdictions.findIndex(({ selected }) => (selected));

    return jurisdictions[index];
  }, [jurisdictions]);

  const handleClick = (item: navItemType) => {
    setSelectedItem(item);
  }

  const closeMenu = () => {
    setSelectedItem("");
  }

  return (
    <>
      <div className="haui-navigation-sidebar">
        <div className="haui-sidebar-dropdown">
          <a href="/admin" aria-hidden="true" tabIndex={-1}>
            <img src={Logo} alt="" aria-hidden="true" className="haui-sidebar-dropdown-icon" />
          </a>
          <DropdownMenu value={selectedJurisdiction} options={jurisdictions} />
        </div>
        {/* Main navigation */}
        <ul className="haui-sidebar">
          <li className="haui-sidebar-border" />
          {items.map((item, index) => {
            const { name, icon, url, trackingEvent } = item;

            return (
              <Fragment key={`${name}-nav-item`}>
                {/* divider for admin settings & sign out */}
                {index === 4 && <li className="haui-sidebar-border haui-sidebar-border--thick" />}
                <li className="haui-sidebar-item">
                  {/* Nav item has no submenu if url is provided */}
                  {url ? (
                    <a
                      href={url}
                      className="haui-sidebar-link"
                      onClick={closeMenu}
                      data-track-click={trackingEvent && JSON.stringify(trackingEvent)}
                    >
                      <Icon type={icon} classes="haui-sidebar-link-icon" />
                      {name}
                    </a>
                  ) : (
                    <NavigationMenuItem
                      name={name}
                      icon={icon}
                      customColor={selectedJurisdiction.custom_color}
                      onClick={() => handleClick(item)}
                      selected={selectedItem}
                      close={closeMenu}
                    />
                  )}
                </li>
              </Fragment>
            );
          })}
        </ul>
        <Avatar colour={selectedJurisdiction.custom_color} initials={adminUser.initials} name={adminUser.name} url={adminUser.url} />
      </div>
      {selectedItem && (
        <NavigationSubmenu
          heading={selectedItem.heading}
          submenus={selectedItem.submenus}
          customColor={selectedJurisdiction.custom_color}
        />
      )}
    </>
  );
}

export default NavigationSidebar;
