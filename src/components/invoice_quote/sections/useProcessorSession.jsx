import React, { useState } from "react";

const useProcessorSession = (jurisdictionCode) => {
  const [modalUrl, setModalUrl] = useState(null);

  const jurisdictionConfig = {
    nz: {
      configureModal: ({ initiatePaymentUrl }) => {
        setModalUrl(initiatePaymentUrl);
      },
    },
    au: {
      configureModal: ({ merchantSession }) => {
        configureTyroSession(merchantSession);
        Checkout.showLightbox();
      },
    },
  };

  const configureModal = jurisdictionConfig[jurisdictionCode].configureModal;

  return { configureModal, modalUrl, showModal: jurisdictionCode === "nz" };
};

const configureTyroSession = (merchantSession) => {
  Checkout.configure({
    session: { id: merchantSession },
  });
};

export default useProcessorSession;
