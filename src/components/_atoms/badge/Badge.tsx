import React from "react";
import "./styles.scss";

const Badge = ({
  variant = "green",
  text,
}: iBadge) => (
  <span className={`hnry-badge hnry-badge--${variant}`}>{text}</span>
);

export const BadgeVariants = [
  "admin",
  "amber",
  "blue",
  "burple",
  "error",
  "gray",
  "green",
  "info",
  "orange",
  "pink",
  "red",
  "success",
  "warning",
] as const;
export type BadgeVariant = (typeof BadgeVariants)[number];

interface iBadge {
  variant?: BadgeVariant;
  text: string;
}

export default Badge;
