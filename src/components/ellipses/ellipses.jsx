import React, { useEffect, useState } from "react";
import MoreActions from "../_molecules/dropdowns/more_actions/MoreActions";
import MenuItem from "../_molecules/dropdowns/menu/MenuItem";

const Ellipses = ({ actions, children, classes }) => {
  const [isEllipsesVisible, setIsEllipsesVisible] = useState(window.innerWidth > window.breakpoints.mobileMax);

  useEffect(() => {
    window.addEventListener("resize", () => handleResize());
    return () => window.removeEventListener("resize", () => handleResize());
  }, []);

  const handleResize = () => {
    setIsEllipsesVisible(window.innerWidth > window.breakpoints.mobileMax);
  };

  return isEllipsesVisible ? children : (
    <div className={classes}>
      <MoreActions>
        {actions.map(({ text, actionName, onClick, trackClick }) => (
          <MenuItem
            key={`more-actions-option-${actionName}`}
            label={text}
            onClick={onClick}
            asButton
            trackClick={trackClick}
          />
        ))}
      </MoreActions>
    </div>
  );
};

export default Ellipses;
