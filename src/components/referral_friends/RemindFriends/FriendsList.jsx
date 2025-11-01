import React from "react";
import PropTypes from "prop-types";
import { animated, useTransition } from "@react-spring/web";
import Checkbox from "../../inputs/Checkbox";
import Loader from "../../inputs/_elements/loader";
import Icon from "../../icon/Icon";

const FriendsList = ({
  friends = [], setFriends, loading, disabledReminder, handleDelete,
}) => {
  const transitions = useTransition(friends, {
    key: (item) => item.id,
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    delay: 200,
  });

  const handleSelect = (e, id) => {
    const { checked } = e.target;

    const updated = friends.map((friend) => {
      if (friend.id == id) {
        return { ...friend, selected: checked };
      }
      return friend;
    });

    disabledReminder(updated, checked);
    setFriends(updated);
  };

  return loading ? <div className="remind-friends__list loader"><Loader /></div> : (
    <ul className="remind-friends__list" id="referee-list">
      {transitions((style, item) => {
        const {
          id, selected, referee, remindersBlocked, referrer,
        } = item;
        const { name, signUpTimeInWords, signUpComplete } = referee;
        const timestamp = signUpComplete ? `Sign-up complete - $${Math.trunc(referrer.creditAmount)} credit added to your account 🎉`
          : `Signed up ${signUpTimeInWords} ago and needs to receive a payment`;

        return (
          <animated.li className="remind-friends__list-item" key={id} style={style} id="friends-list-wrapper">
            {signUpComplete && <Icon type="statuses/accepted" className="list-item-icon" />}
            {(!signUpComplete && !remindersBlocked) && (
              <>
                <label className="tw-sr-only" htmlFor={`referralCheckbox${id}`}>{name}</label>
                <Checkbox
                  onChange={(e) => handleSelect(e, id)}
                  name={name}
                  id={`referralCheckbox${id}`}
                  defaultValue={selected}
                />
              </>
            )}
            <span className="remind-friends__name !tw-text-gray-700 tw-font-bold tw-mb-2 tw-ml-[2.2rem]">{name}</span>
            <div className="remind-friends__meta">
              <span className="remind-friends__timestamp">{timestamp}</span>
              <Icon
                label="Delete"
                type="actions/delete"
                asButton
                onClick={(e) => handleDelete(e, item)}
                className="tw-w-9 tw-h-9 tw-p-2 tw-rounded-full delete-btn"
                popover={{ placement: "top", content: "Delete" }}
              />
            </div>
          </animated.li>
        );
      })}
    </ul>
  );
};

FriendsList.propTypes = {
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
  disabledReminder: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default FriendsList;
