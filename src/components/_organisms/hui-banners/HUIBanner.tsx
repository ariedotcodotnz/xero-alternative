import classNames from "classnames";
import React, { useState } from "react";

// import "./styles.scss";
import { useReward } from "react-rewards";

import { addFeature, removeFeature } from "../../../API/users.api";

interface iHUIBanner {
  // Ui has a lowercase i as the react-rails camelizeProps translates like that
  hasHuiEnabled: boolean;
}

const wrapperClasses = "tw-py-4 tw-px-6 tw-flex tw-flex-col md:tw-flex-row tw-gap-4 tw-justify-between tw-items-center tw-bg-blue-100 tw-text-black";

const OptIn = () => {
  const { reward } = useReward("rewardId", "confetti", {
    lifetime: 300,
    angle: window.innerWidth > 768 ? 180 : 270,
    spread: 90,
    colors: ["#4FA7CF", "#33B082", "#F9D44C", "#E9986A", "#E172A1"],
  });

  const [isLoading, setIsLoading] = useState(false);

  const enableHnryUI = async () => {
    reward();
    setIsLoading(true);

    try {
      const animationTimeout = new Promise((resolve) => {
        setTimeout(resolve, 3000);
      });
      const flagLoader = await addFeature({
        feature: "hnry_ui", // This is the flag name
      });

      await Promise.all([animationTimeout, flagLoader]);
      window.location.reload();
    } catch (err) {
      toastr.error(
        "Eeek, we couldn't load the new look for you right now. Please try again in a bit.",
      );
      if (typeof Rollbar !== "undefined") {
        Rollbar.warning("User unable to enable Hnry UI", { error: err });
      }
      setIsLoading(false);
    }
  };

  return (
    <div
      className={classNames(
        wrapperClasses,
        "hnryui", // To get the button look we want
        "animated-background-setup",
        {
          "animated-background-run": isLoading,
        },
      )}
    >
      <p className="tw-m-0 tw-text-center md:tw-text-left">
        Hey there! Do you want to have a sneak peek at our new look? ✨
      </p>
      <button
        className="hnry-button hnry-button--primary"
        onClick={enableHnryUI}
        disabled={isLoading}
      >
        <span id="rewardId" />
        {isLoading ? "Preparing your new look..." : "I want a sneak peek!"}
      </button>
    </div>
  );
};

const OptOut = () => {
  const [isLoading, setIsLoading] = React.useState(false);

  const disableHnryUI = async () => {
    setIsLoading(true);

    try {
      await removeFeature({
        feature: "hnry_ui",
      });

      window.location.reload();
    } catch (err) {
      toastr.error(
        "Eeek, we couldn't revert the design right now. Please try again in a bit.",
      );
      if (typeof Rollbar !== "undefined") {
        Rollbar.warning("User unable to disable Hnry UI", { error: err });
      }
      setIsLoading(false);
    }
  };
  return (
    <div
      className={classNames(
        wrapperClasses,
        "hnryui", // To get the button look we want
      )}
    >
      <p className="tw-m-0 tw-text-center md:tw-text-left">
        We hope you are enjoying your sneak peek! 😎
      </p>
      <button
        className="hnry-button hnry-button--tertiary"
        onClick={disableHnryUI}
        disabled={isLoading}
      >
        <span id="rewardId" />
        {isLoading ? "Travelling back to the past..." : "Take me back"}
      </button>
    </div>
  );
};

const HUIBanner = ({ hasHuiEnabled }: iHUIBanner) => (hasHuiEnabled ? <OptOut /> : <OptIn />);

export default HUIBanner;
