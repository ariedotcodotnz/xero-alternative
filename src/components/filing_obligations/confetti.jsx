import React, { useEffect } from "react";
import { motion } from "motion/react";
import { useReward } from "react-rewards";
import PropTypes from "prop-types";

const Confetti = ({ styles }) => {
  const { reward: confettiReward } = useReward("confetti-reward", "confetti");

  useEffect(() => {
    const confettiTimeout = setTimeout(() => {
      confettiReward();
    }, 200);

    const messageTimeout = setTimeout(() => {
      $("#modal-footer").fadeIn();
    }, 4500);

    return () => {
      // clear timeout when the component unmounts
      clearTimeout(confettiTimeout);
      clearTimeout(messageTimeout);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ minHeight: 440, ...styles }}>
      <motion.div
        initial={{ y: 220, x: 200 }}
        animate={{ y: [320, 0] }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          delay: 2,
        }}
      >
        <div id="emoji-reward">
          <span id="confetti-reward" />
        </div>
      </motion.div>
    </div>
  );
};

Confetti.propTypes = {
  children: PropTypes.any,
  styles: PropTypes.object,
  onAnimationComplete: PropTypes.func,
  title: PropTypes.string,
};

export default Confetti;
