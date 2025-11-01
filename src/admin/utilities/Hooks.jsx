import { useEffect, useState, useRef } from "react";

// Reusable React Hooks that can be shared across components

/**
 * Detects a click outside the component and then executes a callback
 *
 * @param {React.Ref} subject - React.Ref object representing the element to be detecting a click outside of
 * @param {Function} callback - The effect to be executed
 */
export const useClickOutside = (subject, callback, dependencies = []) => {
  let timeoutId;

  // Reject clicks on the subject but execute callback otherwise
  const handleClick = (event) => {
    if (subject.current && subject.current.contains(event.target)) {
      return;
    }
    timeoutId = setTimeout(() => callback(event), 0);
  };

  // Set up and then clean up event listeners
  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
      clearTimeout(timeoutId);
    };
  }, [...dependencies]);
};

export const useDragAndDrop = ({
  target,
  onDrop,
  onDragOver,
  onDragEnter,
  onDragLeave,
}) => {
  useEffect(() => {
    // Remove default event listeners for the dragover and drop events
    window.addEventListener(
      "dragover",
      function (e) {
        e.preventDefault();
      },
      false,
    );
    window.addEventListener(
      "drop",
      function (e) {
        e.preventDefault();
      },
      false,
    );

    // Add appropriate event listeners
    if (target.current !== null) {
      target.current.addEventListener("drop", onDrop);
      target.current.addEventListener("dragover", onDragOver);
      target.current.addEventListener("dragenter", onDragEnter);
      target.current.addEventListener("dragleave", onDragLeave);
    }

    return () => {
      // Remove default event listeners for the dragover and drop events
      window.removeEventListener(
        "dragover",
        function (e) {
          e.preventDefault();
        },
        false,
      );
      window.removeEventListener(
        "drop",
        function (e) {
          e.preventDefault();
        },
        false,
      );

      if (target.current !== null) {
        // Remove appropriate event listeners
        target.current.removeEventListener("drop", onDrop);
        target.current.removeEventListener("dragover", onDragOver);
        target.current.removeEventListener("dragenter", onDragEnter);
        target.current.removeEventListener("dragleave", onDragLeave);
      }
    };
  }, []);
};

// Drop in Popover functionality
// - placement: "top" | "right" | "bottom" | "left" - where the popover should be positioned
// - content: The message inside the popover
// - otherClasses: additional classes to attach to the target element
export const usePopover = ({
  placement,
  content,
  otherClasses,
  html = false,
}) => {
  const [popoverProps, setPopoverProps] = useState({});

  useEffect(() => {
    if (placement && content) {
      setPopoverProps({
        "data-toggle": "popover",
        "data-placement": placement,
        "data-content": content,
        "data-html": html,
        className: `${otherClasses} has-popover`,
      });
    }
  }, [placement, content, otherClasses, html]);

  return popoverProps;
};

// Drop in functionality for executing a function on ESC key press
export const useEscapeKey = (callback) => {
  useEffect(() => {
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  const handleEscapeKey = (event) => {
    if (event && event.keyCode === 27) {
      // Escape key
      callback(event);
    }
  };
};

export const usePrevious = (value) => {
  const ref = useRef();

  // Run when the value of 'value' changes
  useEffect(() => {
    // Assign the value of ref to the argument
    ref.current = value;
  }, [value]);

  return ref.current;
};

export const useCustomEventDispatch = ({ eventName, detail }) => {
  const [dispatchEvent, setDispatchEvent] = useState(false);

  useEffect(() => {
    if (dispatchEvent) {
      document.dispatchEvent(new CustomEvent(eventName, { detail }));
      setDispatchEvent(false);
    }
  }, [dispatchEvent]);

  return setDispatchEvent;
};
