import React from "react";
import Icon from "../../icon/Icon";
import MoreActions from "../../_molecules/dropdowns/more_actions/MoreActions";
import MenuItem from "../../_molecules/dropdowns/menu/MenuItem";
import DonutGraphIcon from "../../_atoms/icons/donut_graph_icon/DonutGraphIcon";
import { Allocation } from "./AddFunds";
import I18n from "../../../utilities/translations";

interface iAllocationTable {
  allocation: Allocation;
  isMobile: boolean;
}

const AllocationTable = ({
  allocation,
  isMobile,
}: iAllocationTable) => {
  const allocationStatus = () => {
    const {
      paused, invalid, statusMessage, cap, fullyPaid, portionPaid,
    } = allocation;
    const placement = "top";
    let iconType = "statuses/playing";

    if (invalid) {
      iconType = "statuses/notify_error";
    } else if (paused) {
      iconType = "statuses/paused";
    } else if (cap) {
      if (fullyPaid) {
        iconType = "statuses/accepted";
      } else {
        return (
          <DonutGraphIcon popoverMessage={statusMessage} amountFilledDecimal={portionPaid} />
        );
      }
    }

    return (
      <Icon
        className="pcard-allocation-status-icon"
        type={iconType}
        label={statusMessage}
        popover={{ content: statusMessage, placement }}
      />
    );
  };

  const editButton = () => {
    const href = Routes.edit_allocation_preference_path(allocation.id);
    const label = I18n.t("allocation_preferences.table.edit_label");

    if (isMobile) {
      return <MenuItem label={label} href={href} remote="true" iconType="PencilSquareIcon" method="GET" />;
    }

    return (
      <a data-remote="true" href={href} aria-label={label}>
        <Icon
          type="actions/edit"
          label={label}
          popover={{ content: label, placement: "left" }}
        />
      </a>
    );
  };

  const moreActions = () => {
    const { locked, paused, invalid, id } = allocation;
    const placement = "left";
    let content = I18n.t("allocation_preferences.table.pause_label");

    if (paused) {
      content = I18n.t("allocation_preferences.table.resume_label");

      if (locked) {
        content = I18n.t(
          "allocation_preferences.table.paused_and_locked_message",
        );
      } else if (invalid) {
        content = I18n.t(
          "allocation_preferences.table.paused_and_invalid_message",
        );
      }

      const pausePath = (locked || invalid) ? ""
        : `${Routes.pause_allocation_preference_path(id)}/?from=card`;

      if (isMobile) {
        return (
          <td>
            <MoreActions>
              {(!locked && !invalid) && (
                <MenuItem label={content} href={pausePath} remote="true" method="PUT" iconType="PlayIcon" />
              )}
              {editButton()}
            </MoreActions>
          </td>
        );
      }

      return (
        <td className="tw-flex tw-gap-x-7 tw-justify-end">
          {(locked || invalid) ? (
            <Icon
              type="actions/resume"
              label={content}
              popover={{ content, placement }}
              className="tw-m-0"
              disabled
              asButton
            />
          ) : (
            <a data-remote="true" data-method="put" href={pausePath} aria-label={content}>
              <Icon type="actions/resume" label={content} popover={{ content, placement }} />
            </a>
          )}
          {editButton()}
        </td>
      );
    }

    const confirmPausePath = `${Routes.confirm_pause_allocation_preference_path(id)}/?from=card`;

    if (isMobile) {
      return (
        <td>
          <MoreActions>
            <MenuItem
              label={content}
              href={confirmPausePath}
              remote="true"
              iconType="PauseIcon"
              method="GET"
            />
            {editButton()}
          </MoreActions>
        </td>
      );
    }

    return (
      <td className="tw-flex tw-gap-x-7 tw-justify-end">
        <a data-remote="true" href={confirmPausePath} aria-label={content}>
          <Icon type="actions/pause" label={content} popover={{ content, placement }} f/>
        </a>
        {editButton()}
      </td>
    );
  };

  return (
    <>
      <div className="hui-table-wrapper">
        <table className="hui-table">
          <thead>
            <tr>
              <th scope="col">
                <span className="tw-sr-only">Allocation Name</span>
              </th>
              <th scope="col" className="tw-w-3 tw-pb-8">
                %
              </th>
              <th className="tw-w-6 tw-text-center" scope="col">
                Status
              </th>
              <th className="tw-w-8" scope="col">
                <span className="tw-sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Card allocation</td>
              <td>{allocation.percentage}</td>
              <td>{allocationStatus()}</td>
              {moreActions()}
            </tr>
          </tbody>
        </table>
      </div>
      <a
        href={Routes.allocation_preferences_path()}
        aria-label="View all allocations"
        className="hui-link tw-float-right tw-text-sm tw-uppercase"
      >
        View all Allocations
      </a>
    </>
  );
};

export default AllocationTable;
