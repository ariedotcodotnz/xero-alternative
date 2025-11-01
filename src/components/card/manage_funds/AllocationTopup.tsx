import React from "react";
import CreateAllocationImg from "../../../../assets/images/hnry_card/create_allocation.svg";
import { Allocation } from "./AddFunds";
import AllocationTable from "./AllocationTable";
import I18n from "../../../utilities/translations";

interface iAllocationTopup {
  allocation?: Allocation | undefined;
  isMobile: boolean;
  jurisdictionCode;
}

const ctx = { scope: "cards.manage_funds.topup_by_allocation" };

const AllocationTopup = ({
  allocation = undefined,
  isMobile,
  jurisdictionCode,
}: iAllocationTopup) => (
    <div className="tw-pb-8 accordion-content-card">
      <h6 className="tw-font-semibold tw-text-base tw-text-gray-900">
        {I18n.t("title", ctx)}
      </h6>
      <hr className="hr-line-light mt-0" />
      <div className="full-sc-on-mob mb-2">
        <div className="tw-text-sm sm:tw-text-base tw-text-gray-700">
          <p>{I18n.t("p1", ctx)}</p>
          <p>{I18n.t("p2", ctx)}</p>
        </div>
        <img
          src={CreateAllocationImg}
          alt="Create allocation"
          className="pcard-allocation-img"
        />
      </div>
      {allocation ? (
        <AllocationTable allocation={allocation} isMobile={isMobile} />
      ) : (
        <a
          className="hnry-button hnry-button--primary"
          data-remote="true"
          href={Routes.new_allocation_preference_path({
            allocation_template_name: `hnry-card-${jurisdictionCode}`,
          })}
          aria-label="Create allocation"
        >
          Create allocation
        </a>
      )}
    </div>
  );

export default AllocationTopup;
