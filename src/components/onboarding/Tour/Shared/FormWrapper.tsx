import React, { ReactNode, useEffect, useRef } from "react"
import classNames from "classnames";
import { useOnboardingTour } from "./context/OnboardingTourContext";


type FormWrapperProps = {
  children: ReactNode;
  classes?: string;
}


const FormWrapper = ({ children, classes = "" }: FormWrapperProps) => {
  const { setChildContainerHeight } = useOnboardingTour();
  const childrenRef = useRef(null);

  useEffect(() => {
    if (!childrenRef.current) return
    const resizeObserver = new ResizeObserver(() => {
      setChildContainerHeight(
        childrenRef.current.getBoundingClientRect().height
      );
    })
    resizeObserver.observe(childrenRef.current)

    // eslint-disable-next-line consistent-return
    return () => resizeObserver.disconnect()

  }, [setChildContainerHeight]);

  return (
    <div
      className={classNames(`tw-flex tw-flex-col tw-flex-1 ${classes}`)}
      ref={childrenRef}
    >
      {children}
    </div>
  );
};

export default FormWrapper