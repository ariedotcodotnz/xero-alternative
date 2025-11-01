import React from "react";
import PropTypes from "prop-types";
import CopyButton from "../_molecules/copy_button/CopyButton";
import ReferralSocial from "./ReferralSocial";
import I18n from "../../utilities/translations";

const InviteFriends = ({ referralUrl, tracking }) => {
  const title = I18n.t("refer_a_friend.invite_friends.title");
  const paragraph = I18n.t("refer_a_friend.invite_friends.paragraph_1");
  const handleClick = () => {
    tracking("referral_url_copied");
  };

  return (
    <>
      <div className="referral-modal__info">
        <h4
          id="referral-friends-modal-title"
          className="tw-text-gray-900 tw-font-semibold tw-text-lg tw-mt-3"
        >
          {title}
        </h4>
        <p className="tw-text-sm sm:tw-text-base tw-text-gray-700 referral-modal__paragraph">{paragraph}</p>
      </div>
      <CopyButton
        copyValue={referralUrl}
        label="Referral link"
        onClick={handleClick}
      >
        <span className="tw-text-sm tw-pr-1 sm:tw-pr-4">{referralUrl}</span>
      </CopyButton>
      <ReferralSocial referralUrl={referralUrl} tracking={tracking} />
    </>
  );
};

InviteFriends.propTypes = {
  referralUrl: PropTypes.string.isRequired,
  tracking: PropTypes.func.isRequired,
};

export default InviteFriends;
