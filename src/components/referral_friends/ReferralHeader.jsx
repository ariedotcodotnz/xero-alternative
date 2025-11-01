import React from "react";
import PropTypes from "prop-types";
import { animated, useSpring } from "@react-spring/web";

const ReferralHeader = ({
  pendingReferralsTotal,
  prevShowModalValue,
  showModal,
  hnryCreditBalance,
  imageUrl,
}) => {
  const resetCounter = !prevShowModalValue && showModal;

  const { number } = useSpring({
    reset: resetCounter,
    from: { number: 0 },
    number: hnryCreditBalance,
    delay: 30,
  });

  const formatOptions = { style: "currency", currency: window.Hnry.User.jurisdiction.currencyCode };
  const numberFormat = new Intl.NumberFormat(window.Hnry.User.jurisdiction.locale, formatOptions);

  return (
    <div className="tw-flex tw-justify-between tw-pt-4 tw-px-4 sm:tw-px-8">
      <div className="tw-text-white tw-text-xs tw-font-light tw-text-left">
        <span className="tw-text-xl">Your balance:</span><br />
        <animated.span className="tw-text-4xl tw-font-normal tw-py-4 !tw-leading-[3.8rem]">
          {resetCounter ? number.to((n) => numberFormat.format(n.toFixed(2))) : numberFormat.format(hnryCreditBalance.toFixed(2))}
        </animated.span><br />
        <span className="tw-whitespace-nowrap">+ {numberFormat.format(pendingReferralsTotal)} when your friends get paid</span>
      </div>
      <img src={imageUrl} alt="Stacks of coins" className="tw-w-36 sm:tw-w-48 tw-h-full" />
    </div>
  );
};

ReferralHeader.propTypes = {
  prevShowModalValue: false,
};

ReferralHeader.propTypes = {
  pendingReferralsTotal: PropTypes.number.isRequired,
  prevShowModalValue: PropTypes.bool,
  showModal: PropTypes.bool.isRequired,
  hnryCreditBalance: PropTypes.number.isRequired,
  imageUrl: PropTypes.string.isRequired,
};

export default ReferralHeader;
