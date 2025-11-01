import React, { useEffect } from "react";
import DOMPurify from "dompurify";
import { motion, AnimatePresence } from "motion/react";
import ToastIcon from "./ToastIcon";
import CloseToast from "./CloseToast";

const MultipleErrorsMessage = ({
  errors,
  errorType,
  toggleToast,
  setToastWidth,
  toastRef,
  isExpanded,
  setExpanded,
}) => {
  const [firstError, secondError, thirdError, ...otherErrors] = errors;

  useEffect(() => {
    setExpanded(isExpanded);
  });

  const handleExpandToggle = () => {
    setExpanded(!isExpanded);
    setToastWidth(toastRef.current.offsetWidth);
  };

  const sanitizedData = (data) => ({
    // eslint-disable-next-line xss/no-mixed-html
    __html:
      data !== undefined
        ? DOMPurify.sanitize(
            new DOMParser().parseFromString(data, "text/html").documentElement
              .textContent,
            { USE_PROFILES: { html: true } },
          )
        : "",
  });

  return (
    <>
      <div className="toast-message">
        <ToastIcon type={errorType} />
        <div className="tw-text-gray-700">
          <span
            className="toast-content"
            dangerouslySetInnerHTML={sanitizedData(firstError)}
          />
          {(secondError || thirdError) && (
            <ul
              className={`tw-ml-2 ${errors.size > 3 ? "tw-mb-1" : "tw-mb-0"}`}
            >
              <li className="tw-text-xs tw-mb-1 tw-mt-2">
                <span dangerouslySetInnerHTML={sanitizedData(secondError)} />
              </li>
              <li className="tw-text-xs">
                <span dangerouslySetInnerHTML={sanitizedData(thirdError)} />
              </li>
            </ul>
          )}
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.ul
                className="tw-ml-2 tw-mb-0"
                key="more-errors"
                initial="collapsed"
                animate="open"
                exit="collapsed"
                variants={{
                  open: { opacity: 1, height: "auto" },
                  collapsed: { opacity: 0, height: 0 },
                }}
              >
                {otherErrors.map((error, index) => (
                  <li
                    className="tw-text-xs tw-mb-1"
                    key={`toast-error-${index}`}
                  >
                    <span dangerouslySetInnerHTML={sanitizedData(error)} />
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
          {/* Since we pull out and display the first three errors without needing to expand the list,
              only give an option to expand the list if there are more than three errors in total */}
          {errors.size > 3 && (
            <button
              className="toast-toggle-more"
              onClick={() => handleExpandToggle()}
            >
              {isExpanded
                ? `Hide ${otherErrors.length} errors`
                : `Show ${otherErrors.length} more errors`}
            </button>
          )}
        </div>
      </div>
      <CloseToast handler={toggleToast} />
    </>
  );
};

export default MultipleErrorsMessage;
