import React, { useRef, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Tab from "./Tab";

const Tabs = ({
  menuList, selected, classes = null, onSelect,
}) => {
  const indicatorRef = useRef(null);

  const calculateWidth = useCallback((menuItem) => {
    const index = menuList && menuList.indexOf(menuItem);
    indicatorRef.current.style.left = `${100 / menuList.length * index}%`;
  }, [menuList]);

  useEffect(() => {
    if (indicatorRef) {
      calculateWidth(selected);
    }
  }, [selected, calculateWidth]);

  const handleClick = (e, tabName) => {
    onSelect(e, tabName);
    calculateWidth(tabName);
  };

  return (
    <div className={classNames("hnry-tabs", classes)} style={{ "--tabs-indicator-width": `${100 / menuList.length}%` }}>
      <ul className="hnry-tabs__menu">
        {menuList.map((tabName) => (
          <Tab
            key={tabName}
            name={tabName}
            selected={selected}
            onClick={handleClick}
          />
        ))}
      </ul>
      <div ref={indicatorRef} className="hnry-tabs__indicator" />
    </div>
  );
};

Tabs.propTypes = {
  onSelect: PropTypes.func.isRequired,
  selected: PropTypes.string.isRequired,
  menuList: PropTypes.arrayOf(PropTypes.string).isRequired,
  classes: PropTypes.string,
};

export default Tabs;
