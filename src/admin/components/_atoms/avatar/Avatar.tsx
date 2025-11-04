import React from "react";
// import "./styles.scss";

export interface iAvatar {
  name: string;
  initials: string;
  colour: "admin-nz" | "admin-au" | "admin-uk" | `#${string}`;
  url: string;
}
// Possible colour classes so tailwind can do JIT compilation
// https://v2.tailwindcss.com/docs/just-in-time-mode
// tw-bg-admin-nz-default
// tw-bg-admin-au-default
// tw-bg-admin-uk-default
// bg-admin-nz-default
// bg-admin-au-default
// bg-admin-uk-default

const Avatar = ({ name, initials, colour, url }: iAvatar) => (
  <a href={url} className="haui-avatar-wrapper tw-group">
    <div
      className={`haui-avatar bg-${colour}-default tw-bg-${colour}-default`}
      style={{ backgroundColor: colour }}
    >
      {initials}
    </div>
    <span className="haui-avatar-title group-hover:tw-underline">{name}</span>
  </a>
);

export default Avatar;
