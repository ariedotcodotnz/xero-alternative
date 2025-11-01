import React from "react";
import Loader from "../../../inputs/_elements/loader";


const SignUpTourLoader = ({ text }: { text: string }) => (
  <div className="tw-flex tw-flex-col tw-items-center tw-justify-center">
    <div className="tw-text-center">
      <p>{text}</p>
    </div>
    <div className="tw-text-center mt-4">
      <Loader />
    </div>
  </div>
)

export default SignUpTourLoader