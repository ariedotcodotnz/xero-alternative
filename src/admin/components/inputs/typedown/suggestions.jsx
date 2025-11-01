import React, { useEffect } from "react";
import classNames from "classnames";

const Suggestions = React.forwardRef(({
  options,
  setSelectedOption,
  inputId,
  isSuggestionOpen,
  activeSuggestion,
  surpressWarning,
  selected,
}, ref) => {
  useEffect(() => {
    ref.current.scrollTo(0, 0);
  }, []);

  return (
    <React.Fragment>
      <div
        className={classNames("suggestions", { active: isSuggestionOpen, hidden: !isSuggestionOpen })}
        ref={ref}
        id={`${inputId}_listbox`}
      >
        {options.length ? (
          <ul
            role="listbox"
            aria-labelledby={`${inputId}_label`}
          >
            {options.map((option, index) => {
              const [displayName, code] = option;

              return (
                <li
                  className={classNames("suggestion", { active: selected && selected === displayName })}
                  data-code={code}
                  key={code}
                  role="option"
                  aria-selected={ activeSuggestion === index }
                  id={`${inputId}-option-${index}`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedOption(option)}
                  >
                    {displayName}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          !surpressWarning && <div className="no-results">
            <span role="img" aria-hidden="true">
              😥
            </span>
            {" Couldn't find any matches – maybe try again?"}
          </div>
        )}
      </div>
    </React.Fragment>
  );
});

Suggestions.displayName = "Suggestions";

export default Suggestions;
