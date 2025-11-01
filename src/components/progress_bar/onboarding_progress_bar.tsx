import React, { useEffect, useState } from "react";
import SteppedProgressBar, { stepsType } from "@hui/_molecules/stepped_progress_bar/SteppedProgressBar";
import * as ReactDOMServer from "react-dom/server"
import DOMPurify from "dompurify";

export default function OnboardingProgressBar({ progressSteps }: { progressSteps: stepsType }) {
  const [steps, setSteps] = useState(progressSteps);
  const [showProgressBar, setShowProgressBar] = useState(false)

  const base64EncodeUnicode = (str: string) => {
    const utf8Bytes = new TextEncoder().encode(str);
    let binary = "";
    utf8Bytes.forEach(byte => binary += String.fromCharCode(byte));
    return btoa(binary);
  }

  useEffect(() => {
    setSteps(progressSteps);
  }, [steps, progressSteps]);

  useEffect(() => {

    const allInclusivePackage = ReactDOMServer.renderToStaticMarkup(<>
      <SteppedProgressBar classes="tw-hidden md:tw-block" steps={steps} vertical={false} />
      <SteppedProgressBar classes="md:tw-hidden" steps={steps} />
    </>)

    sessionStorage.removeItem("onboardingProgressBarPlaceholderHtml")
    const sanitizedString = DOMPurify.sanitize(allInclusivePackage)
    const encodedStr = base64EncodeUnicode(sanitizedString)
    sessionStorage.setItem("onboardingProgressBarPlaceholderHtml", encodedStr)

  }, [showProgressBar, steps])

  useEffect(() => {
    const placeholder = document.getElementById("progress-bar-placeholder");
    if (placeholder && showProgressBar) {
      placeholder.classList.add("tw-opacity-0");
      placeholder.remove();
    }
  }, [showProgressBar]);

  useEffect(() => {
    const handleWindowLoad = () => {
      setShowProgressBar(true); // Trigger when everything (including images) is loaded
    };

    // check document state and see if things are already in a good state, if not, attach a listener to a load state
    if (document.readyState === "complete" || document.readyState === "interactive") {
      handleWindowLoad();
    } else {
      window.addEventListener("load", handleWindowLoad);
      window.addEventListener("DOMContentLoaded", handleWindowLoad);
    }

    /**
      If loading takes more than 1s OR the event listeners haven't been triggered,
      we have a fail safe that will ensure that we render the progress bar no matter what
    */
    setTimeout(() => {
      handleWindowLoad()
    }, 1000)
  }, []);


  return (
    <>

      {showProgressBar ? (<>
        {/* add root snapshot of mobile vs web */}
        <div id="screenshot-desktop-progress-bar">
          <SteppedProgressBar classes="tw-hidden md:tw-block" steps={steps} vertical={false} />
        </div>

        {/* Mobile View */}
        <div id="screenshot-mobile-progress-bar" className="tw-transition-opacity tw-duration-1000 tw-ease-in-out tw-opacity-100">
          <SteppedProgressBar classes="md:tw-hidden" steps={steps} />
        </div>
      </>) : null}

    </>
  );
}