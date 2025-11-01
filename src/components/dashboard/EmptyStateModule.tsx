import React from "react";
import Icon from "../_atoms/icons/icon/Icon";

interface EmptyStateModuleProps {
  altImgText: string;
  createBtnText?: string;
  createUrl?: string;
  emptyStateImageSrc: string;
  hideButton?: boolean;
  subtext: string;
  title: string;
  trackClick?: TrackClick;
}

const onboardingPath = "/?tour_step=auto";

const EmptyStateModule = ({
  altImgText,
  createBtnText,
  createUrl,
  emptyStateImageSrc,
  hideButton = false,
  subtext,
  title,
  trackClick,
}: EmptyStateModuleProps) => (
  <div className="tw-text-center">
    <div className="hui-card-empty">
      <img src={emptyStateImageSrc} alt={altImgText} width="140" height="120" />
      <h3 className="hui-card-empty__title">{title}</h3>
      <p className="hui-card-empty__subtext">{subtext}</p>
      {!hideButton && (
        <a
          className="hnry-button hnry-button--primary"
          href={createUrl}
          data-remote={createUrl !== onboardingPath}
          data-track-click={JSON.stringify(trackClick)}
        >
          <Icon classes="-tw-ml-2" type="PlusIcon" />
          {createBtnText}
        </a>
      )}
    </div>
  </div>
);

export default EmptyStateModule;
