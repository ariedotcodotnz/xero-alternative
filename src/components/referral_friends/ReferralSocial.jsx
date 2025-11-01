import React from "react";
import PropTypes from "prop-types";
import {
  EmailShareButton, FacebookShareButton, LinkedinShareButton, TwitterShareButton,
} from "react-share";
import Icon from "../icon/Icon";

const REFERRAL_SOCIAL_TEXT = "Fancy automated taxes? Meet Hnry. Have some free credit while you're at it.";

const ReferralSocial = ({ referralUrl, tracking }) => {
  const inviteFriendClick = () => {
    if (navigator.canShare) {
      navigator.share({
        url: referralUrl,
        text: REFERRAL_SOCIAL_TEXT,
      })
        .then(() => {
          tracking("social_sharing_clicked", { social_media_type: "mobile" });
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.warn("Refer a friend: Sharing failed", error);
        });
    } else {
      // eslint-disable-next-line no-console
      console.warn("Refer a friend: Your system doesn't support sharing.");
    }
  };

  const triggerEvent = (type) => {
    tracking("social_sharing_clicked", { social_media_type: type });
  };

  return navigator.canShare ? (
    <button
      className="hnry-button hnry-button--primary tw-mt-2"
      onClick={inviteFriendClick}
    >
      Invite a friend
    </button>
  ) : (
    <div className="referral-sharing">
      <h5 className="tw-text-gray-900 tw-font-semibold tw-text-base">Share referral link</h5>
      <div className="tw-flex tw-justify-between tw-gap-4">
        <EmailShareButton
          className="hover:tw-opacity-70"
          beforeOnClick={() => triggerEvent("email")}
          url={`${referralUrl} \n\n Enjoy your day ✌️\n\n`}
          subject="Hey! I reckon you should check out Hnry."
          body={
            "Hi!\n\n I think you should check out Hnry - they automate tax for sole traders so you can get back to the good stuff.\n\n Plus, if you sign up using the link below, we’ll both get $25 free Hnry credit (I know that sounds scammy, but I promise it's not).\n\n"
          }
        >
          <Icon type="shares/email" title="Share via Email" label="Share via Email" />
        </EmailShareButton>
        <FacebookShareButton
          className="hover:tw-opacity-70"
          beforeOnClick={() => triggerEvent("facebook")}
          url={referralUrl}
          quote={REFERRAL_SOCIAL_TEXT}
        >
          <Icon type="shares/facebook" title="Share via Facebook" label="Share via Facebook" />
        </FacebookShareButton>
        <TwitterShareButton
          className="hover:tw-opacity-70"
          beforeOnClick={() => triggerEvent("twitter")}
          url={referralUrl}
          title={REFERRAL_SOCIAL_TEXT}
        >
          <Icon type="shares/x" title="Share via Twitter" label="Share via Twitter" />
        </TwitterShareButton>
        <LinkedinShareButton
          className="hover:tw-opacity-70"
          beforeOnClick={() => triggerEvent("linkedin")}
          url={referralUrl}
        >
          <Icon type="shares/linkedin" title="Share via Linkedin" label="Share via Linkedin" />
        </LinkedinShareButton>
      </div>
    </div>
  );
};

ReferralSocial.propTypes = {
  referralUrl: PropTypes.string.isRequired,
  tracking: PropTypes.func.isRequired,
};

export default ReferralSocial;
