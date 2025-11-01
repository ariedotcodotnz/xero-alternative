document.addEventListener("turbolinks:load", () => {
  const form = document.getElementById("signup-jurisdiction-form");

  if (form) {
    const radioButtons = form.querySelectorAll('input[name="code"]');
    const referrerInput = form.querySelector("#signup-jurisdiction-referrer");
    const hnryReferrerInput = form.querySelector(
      "#signup-jurisdiction-hnry-referrer",
    );
    const submitButton = form.querySelector(
      "#jurisdiction-selection-submit-btn",
    );

    form.addEventListener("keyup", () => {
      submitButton.disabled = !form.checkValidity();
    });

    form.addEventListener("change", () => {
      submitButton.disabled = !form.checkValidity();
    });

    radioButtons.forEach((radioBtn) => {
      radioBtn.addEventListener("click", (e) => {
        const { referrer } = e.target.dataset;

        referrerInput.value = referrer;
        hnryReferrerInput.value = referrer;
        if (e.target.value) {
          updateQueryParam("jurisdiction_code", e.target.value);
        }
      });
    });
  }
});

function updateQueryParam(param, value) {
  const url = new URL(window.location.href);
  url.searchParams.set(param, value);
  window.history.replaceState({ path: url.href }, "", url.href);
}
