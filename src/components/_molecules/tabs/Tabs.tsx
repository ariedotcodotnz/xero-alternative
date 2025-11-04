import React from "react";
import classNames from "classnames";
// import "./styles.scss";

export type TabsLinkType = {
  name: string;
  shortenName?: string;
  url: string;
  active: boolean;
  remote?: boolean | string | undefined;
  trackClick?: TrackClick;
}

type TabsButtonType = {
  name: string;
  active: boolean;
}

interface iTabs {
  tabs: TabsLinkType[] | TabsButtonType[];
  onChange?: (value: string) => void;
  asButton?: boolean;
  centered?: boolean;
}

const Tabs = ({
  tabs,
  asButton = false,
  onChange,
  centered = false,
}
  : iTabs) => {
  const handleTabClick = (value) => {
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className="hui-tab-wrapper">
      <nav className={classNames("hui-tabs", { "hui-tabs--centered": centered })} aria-label="Tabs">
        {tabs.map((item, index) => {
          const { name, active, trackClick } = item;

          if (asButton) {
            return (
              <button
                key={index}
                className={classNames("hui-tabs__tab", {
                  "hui-tabs__tab--active": active,
                })}
                onClick={() => handleTabClick(name)}
                data-track-click={trackClick ? JSON.stringify(trackClick) : null}
              >
                {name}
              </button>
            );
          }

          const {
            shortenName, url, remote,
          } = item;

          return (
            <a
              key={`${name}_tab_item`}
              href={url}
              className={classNames("hui-tabs__tab", {
                "hui-tabs__tab--active": active,
              })}
              aria-current={active ? "page" : "false"}
              data-remote={remote}
              onClick={() => handleTabClick(name)}
              data-track-click={trackClick ? JSON.stringify(trackClick) : null}
            >
              { shortenName ? (
                <>
                  <span className="tw-hidden sm:tw-block">{name}</span>
                  <span className="sm:tw-hidden">{shortenName}</span>
                </>
              ) : name }
            </a>
          );
        })}
      </nav>
    </div>
  );
};

export default Tabs;
