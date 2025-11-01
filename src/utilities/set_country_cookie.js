// Functions on this page are used to track the "referrer_source" cookie in the Users browser
// The Cookie will hold the URL of the default referrer for a given jurisdiction, i.e.:
// for Australian users, they would come to the app from hnry.co, and in New Zealand the referrer
// would be hnry.co.nz. By determining what their referrer is, we can find out which Jurisdiction
// they will be using for the Hnry app.

// Set a default cookie on pageload if there isn't one already.
// This wouldn't usually be needed, but it's here for if a user
// somehow comes straight to app.hnry.io without first going through
// one of the marketing sites
$(document).ready(function () {
  const existingCookie = getCookie("referral_source");
  if (!existingCookie || existingCookie.includes("https://")) {
    setCookie("referral_source", "hnry.co.nz", 365 * 2);
  }
});

// Set the referral_source cookie when the user selects an option from the
// country select dropdown list
$(document).on("click", ".jurisdiction-selector .dropdown-menu .dropdown-item", function (event) {
  const referrerURL = $(event.currentTarget).data("referrer");
  setReferrerCookie(referrerURL, true);
});

// Set the referral_source cookie when the user selects which jurisdiction they're
// on when using the mobile app
$(document).on("click", "#pick-jurisdiction .jurisdiction-button", function (event) {
  const referrerURL = $(event.currentTarget).data("referrer");
  setReferrerCookie(referrerURL, false);

  // Sneaky change the how-it-work class to display a different background image
  const code = $(event.currentTarget).data("code");
  $("#how-it-works").removeClass("how-it-works-nz");
  $("#how-it-works").removeClass("how-it-works-au");
  $("#how-it-works").addClass(`how-it-works-${code}`);
});

function setReferrerCookie(url, redirect) {
  setCookie("referral_source", url, 365 * 2);
  if (redirect) {
    Turbolinks.visit();
  }
}

/**
 * Utility for setting a cookie
 *
 * @param {string} name - name of the cookie
 * @param {string} value - intended value for cookie
 * @param {number} days - how many days the cookie is valid for
 */
function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));

    expires = `; expires=${date.toUTCString()}`;
  }
  document.cookie = `${name}=${value || ""}${expires}; path=/; Domain=hnry.io;`;
}

/**
 * Utility for getting the value of a cookie by name
 *
 * @param {string} name - name of the cookie
 */
function getCookie(name) {
  const v = document.cookie.match(`(^|;) ?${name}=([^;]*)(;|$)`);
  return v ? v[2] : null;
}
