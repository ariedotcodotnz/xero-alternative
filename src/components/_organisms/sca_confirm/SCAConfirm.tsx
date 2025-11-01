import React, { useState, useEffect } from "react";
import Modal from "../../_molecules/modal/Modal";
import I18n from "../../../utilities/translations";
import SCAContent from "./SCAContent";
import SCAIcon from "./SCAIcon";
import SCAFooter from "./SCAFooter";
import consumer from "../../../wsConsumer";
import { cancelChallenge } from "../../../API/sca_challenge.api";
import { SCA_DEFAULT, SCA_FAILED, SCA_SUCCESS, confirmStatusType } from "./types";
import "./styles.scss";

interface iSCAConfirm {
  deviceName: string;
  actionName: string;
  challengeId: string;
}

const completeChallenge = ({ id }:{id: string}) => {
  window.location = Routes.complete_challenge_path( id );
};

export const getSCATitle = (status: confirmStatusType) => {
  switch (status) {
  case SCA_SUCCESS:
    return I18n.t("sca_confirm.success_title");
  case SCA_FAILED:
    return I18n.t("sca_confirm.failed_title");
  default:
    return I18n.t("sca_confirm.default_title");
  }
}

const SCAConfirm = ({
  deviceName,
  actionName,
  challengeId,
}: iSCAConfirm) => {
  const [show, setShow] = useState(true);
  const [confirmStatus, setConfirmStatus] = useState(SCA_DEFAULT);

  const reset = () => {
    setShow(false);
    setConfirmStatus(SCA_DEFAULT);
  }

  useEffect(() => {
    consumer.subscriptions.create({
      channel: "GetChallengeStatusChannel",
      challenge_id: challengeId,
    },
    {
      // Called when the WebSocket connection is closed.
      disconnected: () => {
        setShow(false);
        setConfirmStatus(SCA_DEFAULT);
      },
      received: (data) => {
        const { status } = data;

        switch (status) {
        case "challenge_succeeded":
          setConfirmStatus(SCA_SUCCESS);
          setTimeout(() => {
            completeChallenge({ id: challengeId });
          }, 3000);
          break;
        case "challenge_failed":
          setConfirmStatus(SCA_FAILED);
          setTimeout(() => {
            completeChallenge({ id: challengeId });
          }, 3000);
          break;
        default: {
          // eslint-disable-next-line no-console
          console.warn(`SCA websocket ${actionName} error:}`, { status });
          break;
        }
        }
      },
    });

    return () => { consumer.disconnect(); }
  }, []);

  useEffect(() => {
    if (window.MbvCallback) {
      window.MbvCallback.fetchChallenge?.();
    }
  }, []);

  const handleCancel = async () => {
    await cancelChallenge({ id: challengeId });
    reset();
  }

  const handleClose = () => {
    reset();
  }

  return (
    <Modal
      open={show}
      setOpen={setShow}
      title={getSCATitle(confirmStatus as confirmStatusType)}
      includesFooter={false}
      extraHeaderContent={<SCAIcon confirmStatus={confirmStatus as confirmStatusType} />}
      id="sca-confirmation-modal"
      modalClasses="hui-sca"
    >
      <div className="tw-flex tw-justify-between tw-flex-col">
        <SCAContent deviceName={deviceName} />
        <SCAFooter
          handleCancelClick={confirmStatus === SCA_DEFAULT ? handleCancel : handleClose}
          closeAction={confirmStatus !== SCA_DEFAULT}
        />
      </div>
    </Modal>
  );
}

export default SCAConfirm;
