import React from "react";
import MenuItem from "@hui/_molecules/dropdowns/menu/MenuItem";
import MoreActions from "@hui/_molecules/dropdowns/more_actions/MoreActions";
import I18n from "../../../../../utilities/translations";


const MenuActions = ({ intercomLink }: { intercomLink: string }) => (
  <div className="tw-flex tw-mr-1">
    <MoreActions>
      <MenuItem
        label={I18n.t("onboarding.v3.menu_actions.do_it_later")}
        onClick={() => { window.location = Routes.root_path() }}
        asButton
        trackClick={{ eventName: "onboarding_tour_do_it_later_click" }}
      />
      <MenuItem
        label={I18n.t("onboarding.v3.menu_actions.talk_to_team")}
        href={intercomLink}
        trackClick={{ eventName: "onboarding_tour_request_help_click" }}
      />
      <MenuItem
        label={I18n.t("onboarding.v3.menu_actions.sign_out")}
        href="/users/sign_out"
        trackClick={{ eventName: "onboarding_tour_logout_click" }}
      />
    </MoreActions>
  </div>
);

export default MenuActions;