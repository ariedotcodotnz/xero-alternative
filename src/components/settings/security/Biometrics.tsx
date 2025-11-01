import React, { useEffect, useState, useMemo } from "react";
import classNames from "classnames";
import Button from "@hui/_atoms/button/Button";
import Accordion from "@hui/_molecules/accordion/Accordion";
import I18n from "../../../utilities/translations";

const ctx = { scope: "users.security.biometrics" };

const Biometrics = () => {
  const defaultProductName = I18n.t("product_title_placeholder", ctx);
  const defaultProductDescription = I18n.t(
    "product_description_placeholder",
    ctx,
  );
  const defaultBtnText = I18n.t("manage_biometrics", {
    biometrics_product: defaultProductName,
    ...ctx,
  });

  const [open, setOpen] = useState(false);
  const [showAccordion, setShowAccordion] = useState(false);
  const [productName, setProductName] = useState(defaultProductName);
  const [disabledBtn, setDisabledBtn] = useState(false);

  /**
   * On mobile, the native app is responsible for telling us whether the device has biometrics enabled via a callback function.
   * We check for the existence of the callback, and then call it to check if biometrics are supported; if so, the biometrics section
   * on the security part of the settings page is shown. Additionally, the callback can provide us with a more specific product name for
   * biometrics (e.g. Face ID); if the app implements this function, then we update the labels as appropriate.
   */
  useEffect(() => {
    if (window.BiometricsCallback) {
      const biometricsCallback = window.BiometricsCallback;
      const isBiometricsSupported = biometricsCallback.isBiometricsSupported();
      let disabled = !isBiometricsSupported;

      if (isBiometricsSupported) {
        const isAllowedToDisable = biometricsCallback.isAllowedToDisable?.(); // this is for MBV
        const biometricsProduct: string =
          biometricsCallback.getBiometricsProductName?.();

        if (biometricsProduct) {
          setProductName(biometricsProduct);
        }

        disabled =
          isAllowedToDisable === undefined ? false : !isAllowedToDisable;
        setShowAccordion(true);
      }

      setDisabledBtn(disabled);
    }
  }, []);

  /**
   * Calls the native app to handle the "Manage biometrics" button click
   */
  const handleClick = () => {
    if (window.BiometricsCallback) {
      if (!disabledBtn) {
        window.BiometricsCallback.manageBiometricsClicked();
      }
    }
  };

  const isDefaultProductName = useMemo(
    () => productName.toLowerCase() === defaultProductName.toLowerCase(),
    [productName, defaultProductName],
  );

  const getDescription = useMemo(() => {
    if (disabledBtn) {
      const disabledText = I18n.t("disabled_description", {
        product_name: productName,
        ...ctx,
      });

      return disabledText;
    }

    const descriptionProductName = isDefaultProductName
      ? defaultProductDescription
      : productName;
    const description = I18n.t("intro", {
      biometrics_product: descriptionProductName,
      ...ctx,
    });

    return description;
  }, [
    disabledBtn,
    productName,
    defaultProductDescription,
    isDefaultProductName,
  ]);

  const getButtonText = useMemo(
    () =>
      isDefaultProductName
        ? defaultBtnText
        : defaultBtnText.replace(defaultProductName, productName),
    [defaultBtnText, defaultProductName, productName, isDefaultProductName],
  );

  return (
    <Accordion
      title={productName}
      open={open}
      onOpenChange={() => setOpen(!open)}
      className={classNames({
        "tw-hidden": !showAccordion,
        "tw-block": showAccordion,
      })}
    >
      <p className="tw-text-gray-700 tw-mb-8">{getDescription}</p>
      <Button onClick={handleClick} variant="secondary" disabled={disabledBtn}>
        {getButtonText}
      </Button>
    </Accordion>
  );
};

export default Biometrics;
