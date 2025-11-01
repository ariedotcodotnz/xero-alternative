import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { removeButtonPopOver, camelizeKeys } from "../utils/base_helper";
import { usePrevious } from "../utils/Hooks";
import ImageModal from "../modal/ImageModal";
import Button from "../_atoms/button/Button";
import InviteFriends from "./InviteFriends";
import RemindFriends from "./RemindFriends/Main";
import PromoCode from "./PromoCode";
import Tabs from "../Tabs";
import ReferralHeader from "./ReferralHeader";
import Alert from "./Alert";
import Content from "./Content";

const sortFriends = (referrals) => (
  referrals
    .sort((a, b) => new Date(a.referee.signUpTime) - new Date(b.referee.signUpTime))
    .sort((a, b) => a.referee.signUpComplete - b.referee.signUpComplete)
);

const REMIND_FRIENDS_TAB = "REMIND FRIENDS";
const INVITE_FRIENDS_TAB = "INVITE FRIENDS";
const ENTER_CODE_TAB = "ENTER A CODE";

const RAF_TABS = [REMIND_FRIENDS_TAB, INVITE_FRIENDS_TAB, ENTER_CODE_TAB];
const RAF_NO_REFERRALS_TABS = [INVITE_FRIENDS_TAB, ENTER_CODE_TAB];

const Referral = ({
  referralUrl,
  creditBalance,
  promoCode = "",
  pendingTotal,
  launcherType = "full",
  buttonText,
  defaultTab = 0,
  buttonEventName,
  promoCodeUrl,
  imageUrl,
}) => {
  const [showModal, setShowModal] = useState(false);
  const prevShowModalValue = usePrevious(showModal);
  const [selectedTab, setSelectedTab] = useState(RAF_TABS[defaultTab]);
  const [hnryCreditBalance, setHnryCreditBalance] = useState(creditBalance);
  const [promoCodeApplied, setPromoCodeApplied] = useState(promoCode);
  const [pendingReferralsTotal, setPendingReferralsTotal] = useState(pendingTotal);
  const isMobile = window.matchMedia(
    "only screen and (max-width: 480px)",
  ).matches;
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [deleted, setDeleted] = useState(null);
  const [tabs, setTabs] = useState(RAF_TABS);
  const deletedRef = useRef();
  const friendsRef = useRef();
  deletedRef.current = deleted;
  friendsRef.current = friends;

  useEffect(() => {
    if (loading && showModal) {
      fetchReferrals();
    }
  }, [loading, showModal]);

  const launchModal = () => {
    setShowModal(true);
  };

  useEffect(() => {
    document.addEventListener("hnry:showShareDialog", launchModal);
    return () => {
      document.removeEventListener("hnry:showShareDialog", launchModal);
    };
  }, []);

  const fetchReferrals = () => {
    $.rails.ajax({
      type: "GET",
      dataType: "json",
      url: Routes.users_referrals_path(),
      success: (data) => {
        const { referrals } = data;

        const list = referrals.map((r) => camelizeKeys({
          ...r,
          selected: false,
          referrer: camelizeKeys(r.referrer),
          referee: camelizeKeys(r.referee),
        }));
        const newTabs = referrals.length > 0 ? RAF_TABS : RAF_NO_REFERRALS_TABS;
        setTabs(newTabs);
        setSelectedTab(newTabs[0]);
        setFriends(sortFriends(list));
        setLoading(false);
      },
      error: (_) => {
        setLoading(false);
        setAlert({
          text: "Oops, something went wrong.",
          btnText: "Refresh",
          iconType: "alert",
          handleClick: () => {
            fetchReferrals();
          },
        });
      },
    });
  };

  const tracking = (eventName, metaData) => {
    window.analytics.track(`raf_${eventName}`, {
      feature_code: "Refer a friend",
      ...metaData,
    });
  };

  const handleBtnClick = (e) => {
    e.preventDefault();
    setShowModal(!showModal);
    tracking(buttonEventName);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTab(tabs[defaultTab || 0]); // reset selected
    setLoading(true);
    removeButtonPopOver();
    setAlert(null);
  };

  const handleTabSelect = (e, value) => {
    e.preventDefault();
    setSelectedTab(value);
    setAlert(null);
    tracking(`${value.toLowerCase().replace(" ", "_")}_tab_clicked`);
  };

  const handleUndoDelete = (e) => {
    if (deletedRef) {
      const { id } = deletedRef.current;

      e.preventDefault();
      $.rails.ajax({
        type: "PATCH",
        data: { referral: { deleted_at: null } },
        url: Routes.users_referral_path(id),
        success: (resp) => {
          const { pending_total } = resp;

          setFriends(sortFriends([...friendsRef.current, deletedRef.current]));
          setAlert({ text: "Undo success!" });
          setDeleted(null);
          setPendingReferralsTotal(parseFloat(pending_total));
        },
        error: (_) => {
          setAlert({
            text: "Oops, undo failed.",
            iconType: "alert",
            btnText: "Retry",
            handleClick: (event) => {
              handleUndoDelete(event);
            },
          });
        },
      });
    }
  };

  const handleDelete = (e, item) => {
    const { id, referee } = item;

    e.preventDefault();
    removeButtonPopOver();
    $.rails.ajax({
      type: "DELETE",
      url: Routes.users_referral_path(id),
      success: (resp) => {
        const { pending_total } = resp;

        setDeleted(item);
        setFriends(friends.filter((friend) => friend.id != id));
        setAlert({
          text: `Removed ${referee.name} from friends list`,
          btnText: "Undo",
          handleClick: (event) => {
            handleUndoDelete(event);
          },
        });
        setPendingReferralsTotal(parseFloat(pending_total));
      },
    });
  };

  const launcher = () => {
    if (launcherType === "headless") {
      return null;
    }

    return (
      <Button
        variant="primary"
        classes="hnry-button--mob-full"
        onClick={handleBtnClick}
      >
        {buttonText}
      </Button>
    );
  };

  return (
    <>
      {launcher()}
      <ImageModal
        id="referral-friends-modal"
        onCancel={closeModal}
        show={showModal}
        classes="referral-modal"
        customiseHeader={
          <ReferralHeader
            pendingReferralsTotal={pendingReferralsTotal}
            prevShowModalValue={prevShowModalValue}
            showModal={showModal}
            hnryCreditBalance={hnryCreditBalance}
            imageUrl={imageUrl}
          />
        }
      >
        <Tabs
          menuList={tabs}
          selected={selectedTab}
          classes="referral-modal__tabs"
          onSelect={handleTabSelect}
        />
        <Content isMobile={isMobile}>
          <Alert message={alert} />
          {selectedTab === REMIND_FRIENDS_TAB && (
            <RemindFriends
              isMobile={isMobile}
              friends={friends}
              loading={loading}
              handleDelete={handleDelete}
              setFriends={setFriends}
              setAlert={setAlert}
            />
          )}
          {selectedTab === INVITE_FRIENDS_TAB && (
            <InviteFriends referralUrl={referralUrl} tracking={tracking} />
          )}
          {selectedTab === ENTER_CODE_TAB && (
            <PromoCode
              promoCodeUrl={promoCodeUrl}
              setHnryCreditBalance={setHnryCreditBalance}
              promoCodeApplied={promoCodeApplied}
              setPromoCodeApplied={setPromoCodeApplied}
            />
          )}
        </Content>
      </ImageModal>
    </>
  );
};

Referral.propTypes = {
  referralUrl: PropTypes.string.isRequired,
  creditBalance: PropTypes.number.isRequired,
  promoCode: PropTypes.string,
  pendingTotal: PropTypes.number.isRequired,
  buttonText: PropTypes.string.isRequired,
  launcherType: PropTypes.oneOf(["full", "button", "headless"]),
  defaultTab: PropTypes.number,
  buttonEventName: PropTypes.string.isRequired,
  promoCodeUrl: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
};

export default Referral;
