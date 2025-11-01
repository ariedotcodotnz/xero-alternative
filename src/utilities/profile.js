$(document).on("keyup", (e) => {
  const { id, value } = e.target;

  if (id === "user_home_office_percent") {
    const homeOfficePercent = value;
    const homeOfficePercentHighMessage = document.querySelector("#home-office-percent-over-message");

    if (homeOfficePercent > 25) {
      homeOfficePercentHighMessage.classList.remove("hidden");
    } else {
      homeOfficePercentHighMessage.classList.add("hidden");
    }
  }
});
