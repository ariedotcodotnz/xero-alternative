document.addEventListener("turbolinks:load", () => {
  document.querySelectorAll("#outside_hnry").forEach((toggle) => {
    toggle.addEventListener("change", (event) => {
      if (!event.target.checked) {
        const form = document.getElementById("outside-hnry-form");
        form.querySelectorAll("input.currency_field_formatting").forEach((input) => {
          const hiddenInput = document.getElementById(input.dataset.inputId);
          // eslint-disable-next-line no-param-reassign
          input.value = "$0.00";
          hiddenInput.value = 0;
        });

        form.dispatchEvent(new Event("submit", { bubbles: true }));
      }
    });
  });
});
