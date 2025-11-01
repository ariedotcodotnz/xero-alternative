import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "../../_atoms/icon/Icon";

const ClearButton = ({ isVisible, onClick }) => (
  <AnimatePresence>
    {isVisible && (
      <motion.button
        initial="inactive"
        animate="active"
        exit="inactive"
        onClick={() => onClick()}
        variants={{
          active: { y: "-50%", scale: 1 },
          inactive: { y: "-50%", scale: 0 },
        }}
        transition={{ type: "tween", duration: 0.05 }}
        className="clear-input"
        aria-label="Clear this input"
        type="button"
      >
        <Icon type="XCircleIcon" />
      </motion.button>
    )}
  </AnimatePresence>
);

export default ClearButton;
