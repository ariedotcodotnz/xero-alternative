const turboContainerClass = ".main-container";

const setLoadingMessage = () => {
  const body = document.body;
  const numbers = [...Array(6).keys()];
  // Remove existing loading ID
  numbers.forEach((number) => removeExistingLoadingMessage(number));

  // Add new random ID
  const newID = Math.floor(Math.random() * numbers.length);
  body.classList.add(`loading-style-${newID}`);
};

const removeExistingLoadingMessage = (id) => {
  if (document.body.classList.contains(`loading-style-${id}`)) {
    document.body.classList.remove(`loading-style-${id}`);
  }
};

// Slide out content when a link is clicked
document.addEventListener("turbolinks:request-start", () => {
  const page = document.querySelector(turboContainerClass);

  if (page == null) return;

  if (page.classList.contains("entering")) {
    page.classList.remove("entering");
  }
  page.classList.add("leaving");
  document.querySelector("html").classList.add("hide-scroll");
  setTimeout(() => {
    page.classList.remove("leaving");
    page.classList.add("loading");
    setLoadingMessage();
  }, 600);
});

document.addEventListener("turbolinks:before-cache", () => {
  // Remove any styles that might have been added to head by libraries such as react-remove-scroll-bar
  document.querySelectorAll("head style").forEach((el) => el.remove());
  document.body.style = "";
});

// Slide in content when it's loaded
let wasPageLoadedFromCache;
document.addEventListener("turbolinks:before-render", (event) => {
  const page = document.querySelector(turboContainerClass);

  if (page == null) return;
  ReactRailsUJS.unmountComponents(turboContainerClass);
  if (page.classList.contains("leaving")) {
    page.classList.remove("leaving");
  }
  if (page.classList.contains("loading")) {
    page.classList.remove("loading");
  }
  if (document.querySelector("html").hasAttribute("data-turbolinks-preview")) {
    wasPageLoadedFromCache = true;
    event.data.newBody
      .querySelector(turboContainerClass)
      .classList.add("entering");
    removeAnimationClass();
  } else if (wasPageLoadedFromCache) {
    wasPageLoadedFromCache = false;
  } else {
    event.data.newBody
      .querySelector(turboContainerClass)
      .classList.add("entering");
    removeAnimationClass();
  }
});

document.addEventListener("turbolinks:render", () => {
  document.dispatchEvent(new Event("hnry:turbolinks-render"));
  setTimeout(() => {
    const wholePage = document.querySelector("html");
    if (wholePage.classList.contains("hide-scroll")) {
      wholePage.classList.remove("hide-scroll");
    }
  }, 200);
  initializeComponents();
  ReactRailsUJS.mountComponents(turboContainerClass);
});

const removeAnimationClass = () => {
  setTimeout(() => {
    const currentMainContainer = document.querySelector(turboContainerClass);
    if (currentMainContainer.classList.contains("entering")) {
      currentMainContainer.classList.remove("entering");
    }
  }, 300);
};
