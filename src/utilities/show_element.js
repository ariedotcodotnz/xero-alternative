$(document).on("click", "[data-show]", function (event) {
  const selector = event.currentTarget.getAttribute("data-show");
  const targetElement = document.querySelector(selector);
  if (targetElement.classList.contains("hidden")) {
    targetElement.classList.remove("hidden");
  }

  const targetElements = document.querySelectorAll(".hide-me");
  targetElements.forEach(function (item, index) {
    if (item != targetElement) {
      item.classList.add("hidden");
    }
  });
});
