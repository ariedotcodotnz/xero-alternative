import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";

const Collapse = ({
  isOpen,
  id,
  children,
  indentLevel,
  unmountChildren = true,
  ...otherProps
}) => {
  const [classes, setClasses] = useState("");

  useEffect(() => {
    let inProgress = "";
    const { className } = otherProps;
    if (indentLevel) {
      inProgress = `${indentLevel}-indent`;
    }
    if (className) {
      inProgress = `${inProgress} ${className}`;
    }
    setClasses(inProgress);
  }, []);

  const collapseProps = {
    variants: {
      open: { opacity: 1, height: "auto" },
      collapsed: { opacity: 0, height: 0, overflow: "auto" },
    },
    transition: { duration: 0.3 },
    "aria-expanded": String(isOpen),
    id,
    ...otherProps,
    className: classes,
  };

  return unmountChildren ? (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="collapsed"
          animate="open"
          exit="collapsed"
          {...collapseProps}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  ) : (
    <motion.div
      animate={isOpen ? "open" : "collapsed"}
      {...collapseProps}
      style={{ pointerEvents: isOpen ? "auto" : "none" }}
    >
      {children}
    </motion.div>
  );
};

export default Collapse;
