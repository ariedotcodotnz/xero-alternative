import React from "react";
import { format, parse } from "date-fns";
import Alert from "@hui/_molecules/alert/Alert";
import { TimeZone } from "../../../types/invoices.type";

interface iDestinationAlert {
  destination: string,
  scheduleDate?: InstanceType<typeof Date>,
  scheduleTime?: string;
  timeZone?: TimeZone;
};

// An alert showing whom the Invoice will be sent to
const DestinationAlert = ({
  destination,
  scheduleDate,
  scheduleTime,
  timeZone,
}: iDestinationAlert) => {
  const content = () => {
    let text = `This email will be sent to: ${destination}`;
    if (scheduleDate instanceof Date && scheduleTime) {
      text = `${text} at ${format(parse(scheduleTime, "HH:mm", new Date()), "h:mma")} on ${format(
        scheduleDate,
        "d/M/yyyy",
      )}`;
      if (!timeZone.browserInTimezone) {
        text = `${text} (${timeZone.friendlyName})`;
      }
    }

    return text;
  };

  return <Alert includesIcon={false}><p className="tw-text-xs sm:tw-text-sm">{content()}</p></Alert>;
};

export default DestinationAlert;
