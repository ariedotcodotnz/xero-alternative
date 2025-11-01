import React, { useState, useEffect } from "react";
import Collapse from "./collapse/Collapse";

const Accordion = ({
  title,
  children,
  unmountChildren,
  classes,
  open,
  trackClick
}) => {
  const [opened, setOpened] = useState(open);

  useEffect(() => {
    setOpened(open);
  }, [open]);

  const accordion = () => {
    setOpened(!opened);
    // Make sure that inputs that mount when the Accordion opens
    // have the correct label styling applied
    if (!opened) {
      Materialize.updateTextFields();
      if (trackClick) window.analytics?.track(trackClick.eventName, trackClick.data);
    }
  };

  const baseId = title.toLowerCase().replace(/\s/g, "-");

  return (
    <div className="accordion tw-mt-4" role="region">
      <div className={`card accordion-card ${classes}`}>
        <button
          id={`${baseId}_header`}
          type="button"
          className={`card-header ${opened ? "expanded" : ""} ${classes ? `${classes}__header` : ""}`}
          aria-controls={`${baseId}_body`}
          aria-expanded={opened ? "true" : "false"}
          onClick={accordion}
        >
          <h5 className="mb-0 h5-responsive">
            {title} <i className="fa fa-angle-down accordion-icon"></i>
          </h5>
        </button>
        <Collapse isOpen={opened} unmountChildren={unmountChildren}>
          <div className="accordion-content" id={`${baseId}_body`} aria-labelledby={`${baseId}_header`}>
            <div className={`card-body ${classes ? `${classes}__body` : ""}`}>
              {children}
            </div>
          </div>
        </Collapse>
      </div>
    </div>
  );
};

export default Accordion;
