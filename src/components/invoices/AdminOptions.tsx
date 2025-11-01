import React from "react";
import Dropdown from "@hui/_molecules/dropdown/Dropdown";
import * as RadixDropdownMenu from "@radix-ui/react-dropdown-menu";
import Icon from "@hui/_atoms/icons/icon/Icon";

interface AdminOptionsProps {
  links: { name: string; url: string; method: string; confirm_text: string }[];
  buttonText: string;
}

const hnryDomains = [".hnry.com/", ".hnry.io/"];

const externalUrl = (url: string) => {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return !hnryDomains.some((domain) => url.includes(domain));
  }
  return false;
};

const AdminOptions: React.FC<AdminOptionsProps> = ({
  links,
  buttonText = "Admin Actions",
}) => {
  return (
    <Dropdown buttonText={buttonText}>
      <div className="tw-py-1">
        {links.map((link) => (
          <RadixDropdownMenu.Item asChild key={link.url}>
            <a
              href={link.url}
              data-method={link.method}
              data-confirm={link.confirm_text}
              className="tw-block tw-px-4 tw-py-2 tw-text-sm tw-text-gray-700"
              rel={externalUrl(link.url) ? "noreferrer" : undefined}
            >
              {link.name}
              {externalUrl(link.url) && (
                <Icon
                  type="ArrowTopRightOnSquareIcon"
                  classes="tw-ml-2 tw-inline-block tw-text-gray-400"
                  size="xs"
                />
              )}
            </a>
          </RadixDropdownMenu.Item>
        ))}
      </div>
    </Dropdown>
  );
};

export default AdminOptions;
