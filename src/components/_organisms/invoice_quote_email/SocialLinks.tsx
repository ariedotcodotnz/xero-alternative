import React from "react";
import HnryLogo from "../../../../assets/images/hnry-logo-name-only-no-padding.svg";
import I18n from "../../../utilities/translations";

const SocialLinks = () => (
  <>
    <hr className="tw-mt-2 tw-mb-2" />
    <p className="invoice-quote-email-text">
      <img
        src={HnryLogo}
        height="48px"
        width="100px"
        className="tw-mt-4 tw-mb-1"
        alt="Hnry Logo"
      />
      <span className="tw-text-brand tw-font-bold tw-text-xs">
        Powered by Hnry
      </span>
    </p>
    <p className="tw-text-xs tw-mb-0">
      <a
        href={I18n.t("global.links.marketing_site")}
        className="tw-mr-1 invoice-quote-email-link"
        rel="noreferrer"
        target="_blank"
      >
        {I18n.t("global.links.marketing_site_short")}
      </a>
      |
      <a
        href={I18n.t("global.footer.social_network.twitter")}
        className="tw-mx-1 invoice-quote-email-link"
        rel="noreferrer"
        target="_blank"
      >
        {I18n.t("global.footer.social_network.twitter_short")}
      </a>
      |
      <a
        href={I18n.t("global.footer.social_network.facebook")}
        className="tw-mx-1 invoice-quote-email-link"
        rel="noreferrer"
        target="_blank"
      >
        {I18n.t("global.footer.social_network.facebook_short")}
      </a>
    </p>
  </>
);

export default SocialLinks;
