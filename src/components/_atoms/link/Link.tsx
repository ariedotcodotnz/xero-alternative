import React from "react";
import classNames from "classnames";
import Icon, { IconType } from "../icons/icon/Icon";

interface iLinkProps {
  args?: React.HTMLProps<HTMLAnchorElement>;
  href: string;
  iconType?: IconType;
  text: string;
  type?: "primary" | "danger" | "info";
}

const Link = ({
  text,
  href,
  type = "primary",
  iconType,
  args,
}: iLinkProps) => {
  const classes = classNames(
    "hui-link",
    { "hui-link--danger": type === "danger" },
  );

  return (
    <a href={href} className={classes} {...args}>
      {iconType && <Icon type={iconType} size="base" />}
      {text}
    </a>
  );
};

export default Link;
