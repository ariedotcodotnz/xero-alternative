import React from "react";
import classNames from "classnames";
import Icon from "../../_atoms/icons/icon/Icon";
import HnryCardImg from "../../../../assets/images/hnry_card/hnry_card_au_nz.svg";
import HnryCardImgUk from "../../../../assets/images/hnry_card/hnry_card_uk.svg";
import I18n from "../../../utilities/translations";
import { getUserJurisdictionCode } from "../../../utilities/user_attributes";

interface JoinWaitlistProps {
  /*
   * True if the user already joined the waitlist
   */
  hasJoinedCardWaitlist: boolean;
}

const cardIdx = { scope: "home.index.hnry_card.coming_soon" };

const JoinWaitlist = ({ hasJoinedCardWaitlist }: JoinWaitlistProps) => (
  <>
    {/* header */}
    <div className="hui-card-heading">
      <h2 className="hui-card-heading__title max-xs:tw-text-base">
        {I18n.t("title", cardIdx)}
      </h2>
      <div className="hui-card-heading__actions !tw-hidden sm:!tw-block">
        <a
          className="hnry-button hnry-button--link hnry-button--icon-end"
          href={I18n.t("join_waitlist_learn_more", cardIdx)}
          target="_blank"
          rel="noreferrer"
          data-track-click={JSON.stringify({
            eventName: "dashboard_card_goto_hnry_card_marketing",
          })}
        >
          <Icon classes="-tw-ml-2" type="ArrowUpRightIcon" />
          <span className="tw-sr-only">
            {I18n.t("goto_link_text", cardIdx)}
          </span>
        </a>
      </div>
    </div>

    {/* content */}
    <div
      className={classNames(
        "tw-mx-3 tw-mt-5 tw-flex tw-grow tw-flex-col tw-items-center tw-justify-evenly sm:tw-mx-6",
        { "tw-mb-0": hasJoinedCardWaitlist, "tw-mb-6": !hasJoinedCardWaitlist },
      )}
    >
      <img
        src={getUserJurisdictionCode() === "uk" ? HnryCardImgUk : HnryCardImg}
        className={classNames("tw-mb-4 tw-w-full tw-rounded-xl", {
          "tw-bg-white tw-opacity-20": hasJoinedCardWaitlist,
        })}
        alt="Hnry debit card"
      />
      <h3 className="tw-mb-3 tw-whitespace-nowrap tw-text-sm tw-font-semibold tw-text-brand-700 xs:tw-text-base">
        {I18n.t("heading", cardIdx)}
      </h3>
      {!hasJoinedCardWaitlist && (
        <p className="tw-text-sm tw-text-gray-500">
          {I18n.t("slogan", cardIdx)}
        </p>
      )}
    </div>
    {hasJoinedCardWaitlist && (
      <div className="-tw-mx-4 -tw-mb-4 tw-rounded-md tw-bg-brand-50 tw-px-4 tw-py-3 tw-text-center tw-text-xs tw-text-gray-700">
        {I18n.t("joined_waitlist", cardIdx)}
      </div>
    )}
  </>
);

export default JoinWaitlist;
