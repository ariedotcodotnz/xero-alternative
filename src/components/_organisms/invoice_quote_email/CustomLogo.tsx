import React from "react";

interface iCustomLogo {
  customLogo: string;
  tradingName?: string;
  userName?: string;
}

const CustomLogo = ({ customLogo, tradingName, userName }: iCustomLogo) => (
  <img
    src={customLogo}
    height="80px"
    className="tw-max-h-24"
    alt={`${tradingName || userName} Logo`}
  />
);;

export default CustomLogo;
