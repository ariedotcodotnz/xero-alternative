import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import DOMPurify from "dompurify";
import MultipleErrorsMessage from "./multiple_errors";
import CloseToast from "./CloseToast";
import ToastIcon from "./ToastIcon";

const unmountComponent = (root) => {
  if (root) {
    root.unmount();
  }
};

const Toastr = ({ type, message, root }) => {
  const [isShowing, setShowing] = useState(true);
  const [messageItems, setMessageItems] = useState(undefined);
  const [toastWidth, setToastWidth] = useState(0);
  const [isExpanded, setExpanded] = useState(false);
  const toastRef = useRef(null);

  const sanitizedData = (data) => ({
    // eslint-disable-next-line xss/no-mixed-html
    __html: DOMPurify.sanitize(
      new DOMParser().parseFromString(data, "text/html").documentElement
        .textContent,
      { USE_PROFILES: { html: true } },
    ),
  });

  // Determine on mount whether there's one or multiple messages to display
  useEffect(() => {
    try {
      const messages = new Set(JSON.parse(message));
      // If the messages comes through as an array with only one value,
      // extract that one value so it is treated as one message rather than an array of many
      if (typeof messages === "object" && messages.length === 1) {
        setMessageItems(messages[0]);
      } else {
        setMessageItems(messages);
      }
    } catch (error) {
      setMessageItems("");
    }
  }, []);

  // Hide component after 6 seconds if its a short message,
  // or 10 seconds if it is an expandable one
  useEffect(() => {
    if (messageItems !== undefined) {
      const delay = typeof messageItems === "string" ? 7000 : 13000;

      const timerID = setTimeout(() => {
        setShowing(false);
      }, delay);

      // Cleanup - remove timers on unmount
      return () => {
        clearTimeout(timerID);
      };
    }
  }, [messageItems]);

  const handleDrag = (dragDetails) => {
    const { y: dragDirection } = dragDetails.delta;
    if (dragDirection > 10) {
      // A swipe down, expand the notifcation if possible
      setExpanded(true);
    } else if (dragDirection < -10) {
      if (isExpanded) {
        // A swipe up, collapse the notification if it's open
        // and close notification
        setExpanded(false);
      }
      setShowing(false);
    }
  };

  const dismiss = () => {
    setShowing(false);
  };

  return (
    <AnimatePresence initial onExitComplete={() => unmountComponent(root)}>
      {isShowing && (
        <motion.div
          className={`toast toast--${type}`}
          aria-live="polite"
          key="toast-notification"
          initial="hide"
          animate="open"
          exit="hide"
          ref={toastRef}
          style={{ width: toastWidth || "auto" }}
          variants={{
            open: { opacity: 1, y: 0 },
            hide: { opacity: 0, y: -100 },
          }}
          drag="y"
          dragConstraints={{
            bottom: 2,
            top: 5,
          }}
          dragElastic={0.05}
          onDrag={(event, info) => handleDrag(info)}
        >
          {messageItems && typeof messageItems !== "string" ? (
            <MultipleErrorsMessage
              errors={messageItems}
              errorType={type}
              toggleToast={dismiss}
              toastRef={toastRef}
              setToastWidth={setToastWidth}
              setExpanded={setExpanded}
              isExpanded={isExpanded}
            />
          ) : (
            <>
              <div className="toast-message">
                <ToastIcon type={type} />
                <span
                  className="toast-content"
                  dangerouslySetInnerHTML={sanitizedData(
                    messageItems || message,
                  )}
                />
              </div>
              <CloseToast handler={dismiss} />
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toastr;
