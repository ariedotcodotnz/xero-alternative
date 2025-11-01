import React, { useEffect, useState } from "react";
import * as Progress from "@radix-ui/react-progress";

const ProgressBar = ({
  progressStart,
  progressEnd,
}: {
  progressStart: number;
  progressEnd: number;
}) => {
  const [progress, setProgress] = useState(progressStart);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(progressEnd), 500);
    return () => clearTimeout(timer);
  }, [progressEnd]);

  return (
    <Progress.Root
      className="tw-relative tw-h-3 tw-min-w-full tw-overflow-hidden tw-rounded-full tw-bg-brand-green-100"
      style={{
        // Fix overflow clipping in Safari
        // https://gist.github.com/domske/b66047671c780a238b51c51ffde8d3a0
        transform: "tw-translateZ(0)",
      }}
      value={progress}
      aria-label="Progress bar"
    >
      <Progress.Indicator
        className="tw-ease-[cubic-bezier(0.65, 0, 0.35, 1)] tw-size-full tw-bg-brand-green-500 tw-transition-transform tw-duration-[660ms]"
        style={{ transform: `translateX(-${100 - progress}%)` }}
      />
    </Progress.Root>
  );
};

export default ProgressBar;
