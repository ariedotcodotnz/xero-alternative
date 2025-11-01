import React from "react";
import Content from "./Content";
import Icon from "../_atoms/icons/icon/Icon";
import I18n from "../../utilities/translations";

const Main = () => (
  <>
    <header className="tw-mb-4">
      {/* Cancel button for mobile only */}
      <div className="tw-mb-4 md:tw-hidden">
        <a
          className="hnry-button hnry-button--medium hnry-button--link !tw-w-auto"
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, no-undef, @typescript-eslint/no-unsafe-member-access
          href={Routes.root_path()}
          data-track-click={JSON.stringify({
            eventName: "dashboard_settings_cancel_btn_clicked",
          })}
        >
          <Icon type="ArrowLeftIcon" />
          Cancel
        </a>
      </div>
      <h1 className="page-title max-sm:!tw-text-[1.125rem]">
        {I18n.t("dashboard_settings.main.heading")}
      </h1>
      <p className="tw-text-sm tw-text-gray-600">
        {I18n.t("dashboard_settings.main.subheading")}
      </p>
    </header>
    <section className="tw-mx-6 tw-mb-8 tw-mt-4 sm:tw-mx-0 sm:tw-mt-8">
      <Content />
    </section>
  </>
);

export default Main;
