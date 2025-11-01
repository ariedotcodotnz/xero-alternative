// Checks whether an element (modal) has been scrolled most of the way to the
// bottom and then disableds the agree button if it has
function handleScrolling(modal) {
  const agreeButton = document.querySelector("#consent-to-act-agree-button");
  if (agreeButton) {
    const { scrollTop, scrollHeight } = modal;
    const { height } = modal.getBoundingClientRect();
    const threshold = scrollHeight - height - 50; // Buffer of 50px

    if (scrollTop >= threshold) {
      if (agreeButton.hasAttribute("disabled")) {
        agreeButton.removeAttribute("disabled");
      }
    }
  }
}

const replaceFormWithLoader = () => {
  const form = document.querySelector("#sign-up-tour-form.has-loader");
  const loaderDiv = document.querySelector("#loader-div");

  form.hidden = true;
  loaderDiv.hidden = false;
}

// On scroll, if the scrolling element is the modal-body (which is case on desktop)
// or modal-content (on mobile), then check if the user has reached the bottom yet
document.addEventListener("scroll", (event) => {
  const { target } = event;
  if (target.classList && (target.classList.contains("modal-body") || target.classList.contains("modal-content"))) {
    handleScrolling(target);
  }
}, true);


window.addEventListener("transitionend", () => {
  const tourNextBtn = document.querySelector("#tour-next-btn");
  const form = document.querySelector(".has-loader");

  if (tourNextBtn && form) {
    tourNextBtn.removeEventListener("click", replaceFormWithLoader);
    tourNextBtn.addEventListener("click", replaceFormWithLoader);
  };
});
