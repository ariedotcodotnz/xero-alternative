import React, { useRef, useEffect } from "react";
import { submenusType, headingType } from "./types";

interface iNavigationSubmenu {
  heading: headingType;
  submenus: submenusType;
  customColor: "admin-nz" | "admin-au" | "admin-uk";
}

const NavigationSubmenu = ({
  heading,
  submenus,
  customColor,
}: iNavigationSubmenu) => {
  const focusRef = useRef(null);

  useEffect(() => {
    if (focusRef && focusRef.current) {
      focusRef.current.focus();
    }
  }, [heading]);

  return (
    // bg-admin-nz-default bg-admin-au-default bg-admin-uk-default
    // tw-bg-admin-nz-default tw-bg-admin-au-default tw-bg-admin-uk-default (for layout bs_application)
    <div
      className={`haui-sidebar-submenu bg-${customColor}-default tw-bg-${customColor}-default`}
    >
      {heading.map((title, idx) => (
        <div className="haui-sidebar-heading" key={title}>
          <h1 className="haui-sidebar-heading--h1">{title.replaceAll("_", " ").toUpperCase()}</h1>
          <hr className="haui-sidebar-heading-hr" />
          <ul>
            {submenus[title].map(({ name, url, trackingEvent }, index) => (
              <li key={name}>
                {/* hover:bg-admin-nz-dark hover:bg-admin-au-dark hover:bg-admin-uk-dark */}
                {/* hover:tw-bg-admin-nz-dark hover:tw-bg-admin-au-dark hover:tw-bg-admin-uk-dark (for layout bs_application) */}
                <a
                  href={url}
                  className={`haui-sidebar-heading-link hover:bg-${customColor}-dark hover:tw-bg-${customColor}-dark`}
                  ref={(index === 0 && idx === 0) ? focusRef : null}
                  data-track-click={trackingEvent && JSON.stringify(trackingEvent)}
                >
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default NavigationSubmenu;
