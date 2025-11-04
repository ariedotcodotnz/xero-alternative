import React from "react";
import classNames from "classnames";
import {
  ArrowRightOnRectangleIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Cog6ToothIcon,
  CreditCardIcon,
  DocumentDuplicateIcon,
  EllipsisHorizontalIcon,
  ExclamationTriangleIcon,
  HomeIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  ReceiptPercentIcon,
  UserGroupIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import NZIcon from "./NZIcon";
import AUIcon from "./AUIcon";
import UKIcon from "./UKIcon";

export const sizeClasses = {
  xs: "w-3.5 h-3.5",
  sm: "w-4 h-4",
  base: "w-5 h-5",
  lg: "w-7 h-7",
  xl: "w-12 h-12",
} as const;

const HeroIcons = {
  ArrowRightOnRectangleIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Cog6ToothIcon,
  CreditCardIcon,
  DocumentDuplicateIcon,
  EllipsisHorizontalIcon,
  ExclamationTriangleIcon,
  HomeIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  ReceiptPercentIcon,
  UserGroupIcon,
  XCircleIcon,
  XMarkIcon,
  NZIcon,
  AUIcon,
  UKIcon
} as const;

export const IconTypes = Object.keys(HeroIcons);
export type IconType = (typeof IconTypes)[number];
export type IconSizes = "xs" | "sm" | "base" | "lg" | "xl";

interface iIcon {
  hoverOn?: boolean;
  type?: IconType;
  classes?: string;
  size?: IconSizes;
  strokeWidth?: string
}

const Icon = ({
  type = "PencilSquareIcon",
  hoverOn = false,
  classes = undefined,
  size = "base",
  strokeWidth = "1.5"
}: iIcon) => {
  const className = classNames({
    "hover:tw-text-gray-600": hoverOn,
    [`${classes}`]: classes,
    [`${sizeClasses[size]}`]: size,
  });

  const SingleIcon = HeroIcons[type];
  return SingleIcon ? (
    <SingleIcon data-testid="icon" className={className} strokeWidth={strokeWidth} aria-hidden="true" />
  ) : null;
};

export default Icon;

