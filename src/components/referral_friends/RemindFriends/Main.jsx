import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Checkbox from "../../inputs/Checkbox";
import FriendsList from "./FriendsList";
import Confirmation from "./Confirmation";

const RemindFriends = ({
  isMobile, friends, loading, setFriends, handleDelete, setAlert,
}) => {
  const [selectAll, setSelectAll] = useState(false);
  const [disabledReminderBtn, setDisabledReminderBtn] = useState(true);
  const [confirmation, setConfirmation] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [headerStyle, setHeaderStyle] = useState(null);

  useEffect(() => {
    const selectedFriends = friends.filter(({ selected, remindersBlocked }) => !remindersBlocked && selected);
    setDisabledReminderBtn(selectedFriends.length <= 0);
  }, []);

  useEffect(() => {
    window.addEventListener("referralContentScroll", handleContentScroll);

    return () => {
      window.removeEventListener("referralContentScroll", handleContentScroll);
    };
  }, []);

  const handleContentScroll = (e) => {
    const { scrollTop, scrollHeight } = e.detail;
    const heightElBeforeHeader = 110;
    const heightToMakeHeaderSticky = 650;

    if (scrollTop >= heightElBeforeHeader && scrollHeight > heightToMakeHeaderSticky) {
      // Fixed the position of header when scrolling down the content element
      setHeaderStyle({
        position: "fixed",
        transform: "translateY(-8.1rem)",
        paddingTop: "0.8rem",
        width: "90%",
      });
    } else {
      setHeaderStyle(null);
    }
  };

  const handleSelectAllChange = (e) => {
    const { checked } = e.target;
    const updated = friends.map((friend) => ({ ...friend, selected: friend.remindersBlocked ? false : checked }));
    disabledReminder(updated, checked);
    setFriends(updated);
    setSelectAll(checked);
  };

  const disabledReminder = (list, checked) => {
    setDisabledReminderBtn(list.filter(({ selected }) => selected).length <= 0);

    if (!checked) {
      setSelectAll(false);
    }
  };

  const handleSendReminderClick = (e) => {
    const selected = friends.filter(({ selected, remindersBlocked }) => !remindersBlocked && selected);
    e.preventDefault();
    setConfirmation(true);
    setSelectedText(selected.length == 1 ? selected[0].referee.name : `${selected.length} friends`);
  };

  const sendReminder = (e) => {
    const selectedIds = friends.filter(({ selected, remindersBlocked }) => !remindersBlocked && selected).map(({ id }) => id);

    if (!disabledReminderBtn && selectedIds.length > 0) {
      e.preventDefault();
      setDisabledReminderBtn(true);

      $.rails.ajax({
        type: "POST",
        url: Routes.users_referrals_reminders_path(),
        data: { referral: { ids: selectedIds } },
        success: (_) => {
          const updated = friends.map((f) => (selectedIds.includes(f.id)
            ? { ...f, remindersBlocked: true, selected: false } : f));
          setFriends(updated);
          setSelectAll(false);
          setConfirmation(false);
          setAlert({ text: `Successfully sent reminder to ${selectedText}` });
        },
      });
    }
  };

  return confirmation ? (
    <Confirmation
      handleClick={sendReminder}
      setConfirmation={setConfirmation}
      selectedText={selectedText}
    />
  ) : (
    <>
      <div className="referral-modal__info">
        <h4 id="referral-friends-modal-title" className="tw-text-gray-900 tw-font-semibold tw-text-lg tw-mt-3">
          Your friends haven’t started using Hnry yet!
        </h4>
        <p className="tw-text-sm sm:tw-text-base tw-text-gray-700 referral-modal__paragraph">
          Drop them a line or alternatively, our team can send a reminder on
          your behalf and offer expert assistance. 👇
        </p>
      </div>
      <div className="remind-friends">
        <div className="remind-friends__header" style={headerStyle}>
          <Checkbox
            onChange={handleSelectAllChange}
            name={selectAll ? "Unselect all" : "Select all"}
            id="selectAllReferrals"
            defaultValue={selectAll}
            label={selectAll ? "Unselect all" : "Select all"}
          />
          {!isMobile && (
            <button
              className="hnry-button hnry-button--primary"
              aria-label="Send reminder to referrals"
              onClick={handleSendReminderClick}
              disabled={disabledReminderBtn}
            >
              Send reminder
            </button>
          )}
        </div>
        <div className="remind-friends__content">
          {isMobile && (
            <div className="send-reminder-btn">
              <button
                className="hnry-button hnry-button--primary"
                aria-label="Send reminder to friends"
                onClick={handleSendReminderClick}
                disabled={disabledReminderBtn}
              >
                Send reminder
              </button>
            </div>
          )}
          <FriendsList
            friends={friends}
            setFriends={setFriends}
            loading={loading}
            disabledReminder={disabledReminder}
            handleDelete={handleDelete}
          />
        </div>
      </div>
    </>
  );
};

RemindFriends.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  friends: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    referee: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      signUpTimeInWords: PropTypes.string.isRequired,
      signUpComplete: PropTypes.bool.isRequired,
    }),
    selected: PropTypes.bool.isRequired,
    remindersBlocked: PropTypes.bool.isRequired,
    referrer: PropTypes.shape({
      creditAmount: PropTypes.string.isRequired,
    }),
  })),
  setFriends: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default RemindFriends;
