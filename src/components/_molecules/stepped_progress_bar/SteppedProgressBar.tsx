import React from "react";
import classNames from "classnames";
import Icon from "../../_atoms/icons/icon/Icon";
// import "./styles.scss";

type stepType = {
  name: string,
  description: string,
  status: "complete" | "current" | "incomplete",
}

export type stepsType = stepType[];

interface iSteppedProgressBar {
  steps: stepsType;
  vertical?: boolean;
  classes?: string;
}

const SteppedProgressBar = ({
  steps,
  vertical = true,
  classes,
}: iSteppedProgressBar) => {
  if (vertical) {
    return (
      <nav aria-label="Progress" className={classNames("tw-min-h-full tw-mt-4 tw-block", { [`${classes}`]: classes })}>
        <ol className="tw-overflow-hidden">
          {steps.map((step, stepIdx) => (
            // must have unique key - so use description if no name
            <li key={step.name || step.description} className="tw-relative tw-h-20 tw-pb-8">
              {/* this is the line between steps */}
              {stepIdx !== steps.length - 1 && <div aria-hidden="true" className={`hui-progress-bar__line--vertical ${step.status}`} />}
              <div className="hui-progress-bar__list-item" aria-current={step.status === "current" ? "step" : "false"}>
                <span aria-hidden="true" className="hui-progress-bar__indicator tw-h-9">
                  <span className={`hui-progress-bar__indicator-item ${step.status}`}>
                    {step.status === "complete" ? (
                      <Icon
                        type="CheckIcon"
                        classes="hui-progress-bar__icon"
                        strokeWidth="3"
                      />): <span className={`hui-progress-bar__indicator-circle ${step.status}`} />
                    }
                  </span>
                </span>
                {/* content */}
                <span className="hui-progress-bar__content tw-ml-4 tw-min-w-0">
                  <span className={`hui-progress-bar__title ${step.status}`}>{step.name}</span>
                  <span className="hui-progress-bar__subtext">{step.description}</span>
                </span>
              </div>
            </li>
          ))}
        </ol>
      </nav>
    );
  }

  return (
    <nav aria-label="Progress" className={classNames("tw-min-h-max tw-block", { [`${classes}`]: classes })}>
      <ol className={classNames("tw-grid tw-min-w-full",
        {
          [`tw-grid-cols-${steps.length}`]: steps.length <= 3,
          "tw-grid-flow-col tw-col-auto": steps.length > 3
        }
      )}>
        {steps ? steps.map((step, stepIdx) => (
          // must have unique key - so use description if no name
          <li key={step.name || step.description} className="tw-grid tw-grid-rows-2 tw-align-middle">
            <div className="tw-flex tw-flex-row">
              {/* this is the icon */}
              <div className="hui-progress-bar__indicator">
                <div className={`hui-progress-bar__indicator-item ${step.status}`} aria-current={step.status === "current" ? "step" : "false"}>
                  {step.status === "complete" ? (
                    <Icon type="CheckIcon" classes="hui-progress-bar__icon" strokeWidth="3.5" />
                  ) : (
                    <>
                      <span aria-hidden="true" className={`hui-progress-bar__indicator-circle ${step.status}`} />
                      <span className="tw-sr-only">{step.name}</span>
                    </>
                  )}
                </div>
              </div>
              {/* this is the line between steps */}
              {stepIdx !== steps.length - 1 && (
                <div aria-hidden="true" className="hui-progress-bar__line-wrapper">
                  <div className="hui-progress-bar__line complete" />
                </div>
              )}
            </div>
            {/* content */}
            <div className="hui-progress-bar__content tw-mr-4">
              <div className="hui-progress-bar__title">{step.name}</div>
              <div className="hui-progress-bar__subtext">{step.description}</div>
            </div>
          </li>
        )) : null}
      </ol>
    </nav>
  );
}

export default SteppedProgressBar;
