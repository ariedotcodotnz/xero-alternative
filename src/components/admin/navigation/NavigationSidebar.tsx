import React from "react";
import NewNavigationSidebar, { iNavigationSidebar } from "../../../admin/components/_organisms/navigation/NavigationSidebar";

const NavigationSidebar = ({
  items,
  jurisdictions,
  adminUser,
}: iNavigationSidebar) => (
  <NewNavigationSidebar
    items={items}
    jurisdictions={jurisdictions}
    adminUser={adminUser}
  />
);

export default NavigationSidebar;
