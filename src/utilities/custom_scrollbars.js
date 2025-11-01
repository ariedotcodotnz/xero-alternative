document.addEventListener("turbolinks:load", () => {
  // Scrollbars are set to always show (ie. Windows and with the "always" setting on Mac)
  const windowHasScrollbars = window.innerWidth > document.documentElement.clientWidth;
  const anyElementHasScrollbars = checkIfAnyElementsAreScrollable();
  if (anyElementHasScrollbars && windowHasScrollbars) {
    document.querySelector("html").classList.add("custom-scrollers");
  }
});

const checkIfAnyElementsAreScrollable = () => {
  const allElements = Array.from(document.body.querySelectorAll("*"));
  return allElements.some((element) => element.offsetWidth < element.scrollWidth);
};
