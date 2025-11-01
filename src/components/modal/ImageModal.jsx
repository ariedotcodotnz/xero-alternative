import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import { useEscapeKey } from "../utils/Hooks";
import { removeButtonPopOver } from "../utils/base_helper";
import Icon from "../_atoms/icons/icon/Icon";

const ImageModal = ({
  children = null, show, id, onCancel, classes = "", imageSrc = "", imgAlt = "", customiseHeader = null,
}) => {
  useEscapeKey(() => {
    onCancel();
  });

  useEffect(() => {
    // eslint-disable-next-line xss/no-mixed-html
    const htmlEl = document.querySelector("html");

    if (!htmlEl) return;

    if (show) {
      if (!htmlEl.classList.contains("overflow-hidden")) {
        htmlEl.classList.add("overflow-hidden");
      }
    } else {
      if (htmlEl.classList.contains("overflow-hidden")) {
        htmlEl.classList.remove("overflow-hidden");
      }
      removeButtonPopOver();
    }
  }, [show]);

  return show ? createPortal(<>
      <div
        className={`hnry-info-modal hnry-info-modal--show ${classes}`}
        id={id}
        role="dialog"
        aria-labelledby={`${id}-title`}
        aria-hidden="false"
        tabIndex="-1"
      >
        <div className="hnry-info-modal__content" role="document">
          <div className="hnry-info-modal__header">
            <div className="sm:tw-rounded-t-md tw-py-4 tw-px-0 sm:tw-px-4 tw-mb-6 tw-bg-gradient-to-br tw-from-brand-700 tw-to-brand-violet-700">
              {customiseHeader || <img src={imageSrc} alt={imgAlt} className="hnry-info-modal__header-img" />}
              <button className="tw-rounded-md tw-absolute tw-top-3 tw-right-3 focus:!tw-bg-gray-50/20 tw-p-1" onClick={onCancel}>
                <Icon type="XMarkIcon" hoverOn classes="!tw-mx-0 tw-text-white hover:!tw-text-gray-300" />
                <span className="tw-sr-only">Dismiss</span>
              </button>
            </div>
          </div>
          <div className="hnry-info-modal__body">
            {children}
          </div>
        </div>
      </div>
    </>, document.body) : null;
};

ImageModal.propTypes = {
  customiseHeader: PropTypes.object,
  show: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  imageSrc: PropTypes.string,
  imgAlt: PropTypes.string,
  classes: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default ImageModal;
