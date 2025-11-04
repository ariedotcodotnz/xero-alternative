import React, { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import Icon from "../../../_atoms/icons/icon/Icon";
// import "./styles.scss";

const MoreActions = ({ children }) => (
  <Menu as="div" className="hnry-more-actions">
    <Menu.Button className="hnry-more-actions__menu-button" data-testid="hnry-menu-action-open">
      <span className="tw-sr-only">Open options</span>
      <Icon type="EllipsisVerticalIcon" hoverOn />
    </Menu.Button>
    <Transition
      as={Fragment}
      enter="tw-transition tw-ease-out tw-duration-100"
      enterFrom="tw-transform tw-opacity-0 tw-scale-95"
      enterTo="tw-transform tw-opacity-100 tw-scale-100"
      leave="tw-transition tw-ease-in tw-duration-75"
      leaveFrom="tw-transform tw-opacity-100 tw-scale-100"
      leaveTo="tw-transform tw-opacity-0 tw-scale-95"
    >
      <Menu.Items className="hnry-more-actions__menu-items">
        {children}
      </Menu.Items>
    </Transition>
  </Menu>
);

export default MoreActions;
