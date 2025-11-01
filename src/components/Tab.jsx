import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

const Tab = ({ name, selected, onClick }) => {
  const classes = classNames("hnry-tabs__btn tw-text-gray-600 tw-font-bold", { selected: selected === name });
  const buttonRef = useRef();

  useEffect(() => {
    if (selected === name) {
      buttonRef.current.focus();
    }
  }, []);

  return (
    <li className="hnry-tabs__tab" key={`${name}Tab`}>
      <button ref={buttonRef} className={classes} onClick={(e) => onClick(e, name)}>{name}</button>
    </li>
  );
};

Tab.propTypes = {
  name: PropTypes.string.isRequired,
  selected: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Tab;
