import React from "react";

const InfoBox = ({
  heading, body, style, otherClasses, learnMoreLink,
}) => (
  <div className={`alert alert-${style || "warning"} ${otherClasses}`} role="alert">
    {heading && <h4 className="alert-heading"><strong>{heading}</strong></h4>}
    <p>{body}</p>
    {learnMoreLink && <a href={learnMoreLink}>Learn more</a>}
  </div>
);

export default InfoBox;
