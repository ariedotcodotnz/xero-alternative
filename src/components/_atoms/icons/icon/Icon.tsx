import React from "react";
import classNames from "classnames";
import {
  AdjustmentsVerticalIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowRightOnRectangleIcon,
  ArrowTopRightOnSquareIcon,
  ArrowUpRightIcon,
  ArrowUpTrayIcon,
  ArrowPathIcon,
  BellAlertIcon,
  BoltIcon,
  BuildingLibraryIcon,
  CalendarDaysIcon,
  ChartPieIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleStackIcon,
  ClipboardDocumentIcon,
  ClipboardDocumentListIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
  CurrencyPoundIcon,
  DevicePhoneMobileIcon,
  DocumentArrowUpIcon,
  DocumentDuplicateIcon,
  DocumentTextIcon,
  EllipsisHorizontalIcon,
  EllipsisVerticalIcon,
  EnvelopeIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
  FingerPrintIcon,
  ForwardIcon,
  HandThumbUpIcon,
  HomeIcon,
  InformationCircleIcon,
  LightBulbIcon,
  LockClosedIcon,
  MagnifyingGlassIcon,
  PaperClipIcon,
  PauseIcon,
  PencilIcon,
  PencilSquareIcon,
  PlayIcon,
  PlusIcon,
  ReceiptPercentIcon,
  Square2StackIcon,
  SunIcon,
  TrashIcon,
  UserCircleIcon,
  UserIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import SmsMobileIcon from "./SmsMobileIcon";
import SnowFlakeIcon from "./SnowFlakeIcon";
import DoubleEllipsisIcon from "./DoubleEllipsisIcon";
import InvoicingDollarIcon from "./InvoicingDollarIcon";
import InvoicingPoundIcon from "./InvoicingPoundIcon";
import PDFIcon from "./PDFIcon";

export const sizeClasses = {
  xs: "tw-w-3.5 tw-h-3.5",
  sm: "tw-w-4 tw-h-4",
  base: "tw-w-5 tw-h-5",
  lg: "tw-w-7 tw-h-7",
  xl: "tw-w-12 tw-h-12",
} as const;

const HeroIcons = {
  AdjustmentsVerticalIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowRightOnRectangleIcon,
  ArrowTopRightOnSquareIcon,
  ArrowUpRightIcon,
  ArrowUpTrayIcon,
  ArrowPathIcon,
  BellAlertIcon,
  BoltIcon,
  BuildingLibraryIcon,
  CalendarDaysIcon,
  ChartPieIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleStackIcon,
  ClipboardDocumentIcon,
  ClipboardDocumentListIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
  CurrencyPoundIcon,
  DevicePhoneMobileIcon,
  DocumentArrowUpIcon,
  DocumentDuplicateIcon,
  DocumentTextIcon,
  DoubleEllipsisIcon,
  EllipsisHorizontalIcon,
  EllipsisVerticalIcon,
  EnvelopeIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
  FingerPrintIcon,
  ForwardIcon,
  HandThumbUpIcon,
  HomeIcon,
  InformationCircleIcon,
  InvoicingDollarIcon,
  InvoicingPoundIcon,
  LightBulbIcon,
  LockClosedIcon,
  MagnifyingGlassIcon,
  PaperClipIcon,
  PauseIcon,
  PDFIcon,
  PencilIcon,
  PencilSquareIcon,
  PlayIcon,
  PlusIcon,
  ReceiptPercentIcon,
  SmsMobileIcon,
  SnowFlakeIcon,
  Square2StackIcon,
  SunIcon,
  TrashIcon,
  UserCircleIcon,
  UserIcon,
  XCircleIcon,
  XMarkIcon,
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
  const className = classNames("tw-text-gray-800", {
    "hover:tw-text-gray-600": hoverOn,
    [`${classes}`]: classes,
    [`${sizeClasses[size]}`]: size,
  });

  const SingleIcon = HeroIcons[type];
  return <SingleIcon className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
};

export default Icon;
