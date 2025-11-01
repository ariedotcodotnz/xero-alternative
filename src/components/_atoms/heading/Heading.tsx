import React from "react";
import classNames from "classnames";

const Heading = ({
  level = 1,
  text = "",
  marketing = false,
  className = "",
}: iHeading) => {
  const classes = classNames("hnry-heading", {
    [`${className}`]: className,
    [`hnry-heading--h${level}`]: !marketing,
    [`hnry-heading-marketing-h${level}`]: marketing,
  });

  switch (level) {
    case 2:
      return <h2 className={classes}>{text}</h2>;
    case 3:
      return <h3 className={classes}>{text}</h3>;
    default:
      return <h1 className={classes}>{text}</h1>;
  }
};

interface iHeading {
  level: 1 | 2 | 3;
  text: string;
  marketing: boolean;
  className?: string;
}

export default Heading;
