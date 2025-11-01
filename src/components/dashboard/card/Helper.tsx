import { useState, useEffect, useRef, useCallback } from "react";
import _ from "lodash";

export const useCardManagementCallback = (
  reloadTriggerState,
  reloadEventHandler,
) => {
  const cardManagementCallback = window.CardManagementCallback;
  const [alreadyInWallet, setAlreadyInWallet] = useState(false);
  const [showApplePay, setShowApplePay] = useState(false);
  const [showGooglePay, setShowGooglePay] = useState(false);
  const reloadFunctionRef = useRef(null);

  const reload = useCallback(() => {
    reloadEventHandler((reloadTriggerState) => reloadTriggerState + 1);
  }, [reloadEventHandler]);

  useEffect(() => {
    reloadFunctionRef.current = reload;
  }, [reload]);

  useEffect(() => {
    if (cardManagementCallback) {
      const isAlreadyInWallet = cardManagementCallback.alreadyInWallet?.();
      const shouldShowApplePay = cardManagementCallback.shouldShowApplePay?.();
      const shouldShowGooglePay =
        cardManagementCallback.shouldShowGooglePay?.();
      if (isAlreadyInWallet) {
        setAlreadyInWallet(true);
      }
      if (!isAlreadyInWallet) {
        setAlreadyInWallet(false);
      }
      if (shouldShowApplePay) {
        setShowApplePay(true);
      } else if (shouldShowGooglePay) {
        setShowGooglePay(true);
      }
    }
  }, [cardManagementCallback, reloadTriggerState]);

  useEffect(() => {
    if (window.CardManagementCallback) {
      _.merge(window.CardManagementCallback, {
        reload: reloadFunctionRef.current,
      });
    }
  }, []);

  return {
    alreadyInWallet,
    showApplePay,
    showGooglePay,
    reloadTriggerState,
    reload,
  };
};

export const handleManageCardClick = () => {
  const cardManagementCallback = window.CardManagementCallback;
  if (cardManagementCallback) {
    cardManagementCallback.manageCardClicked();
  }
};
