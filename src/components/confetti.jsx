import React, { useEffect } from "react";
import { motion } from "motion/react";
import { useReward } from "react-rewards";
import PropTypes from "prop-types";

const Confetti = ({
  children,
  styles,
  onAnimationComplete,
  title,
}) => {
  const { reward: confettiReward } = useReward("confetti-reward", "confetti");
  const { reward: emojiReward } = useReward("emoji-reward", "emoji", {
    angle: 90,
    emoji: ["🎉"],
    elementCount: 12,
  });

  useEffect(() => {
    const confettiTimeout = setTimeout(() => {
      confettiReward();
      emojiReward();
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
    <div style={{ minHeight: 440, ...styles }}
    >
      <motion.div
        initial={{ y: 220 }}
        animate={{ y: [220, 0] }}
        transition={{
          duration: 1,
          ease: "easeInOut",
          delay: 2,
        }}
        onAnimationComplete={onAnimationComplete}
      >

        <div id="emoji-reward">
          {title && <h4 className="h5 font-weight-bold white-text">{title}</h4>}
          <span id="confetti-reward" />
        </div>

      </motion.div>

      {children}
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
