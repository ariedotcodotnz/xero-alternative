import { post } from "../API/config/fetch.api";

const addHomeViewEventListeners = () => {
  document.addEventListener("turbolinks:load", () => {
    const bodyClasses = document.body.classList;
    if (bodyClasses.contains("home") && bodyClasses.contains("index") && !bodyClasses.contains("admin")) {
      post(Routes.page_loaded_event_home_index_path(), null);
    }
  })
};

document.addEventListener("turbolinks:load", () => {
  if (typeof Intercom !== "undefined") {
    const intercomHomeLink = document.getElementById("intercom-home");
    const intercomLinks = document.querySelectorAll("[data-intercom-article-id]");

    if (intercomHomeLink) {
      intercomHomeLink.addEventListener("click", (event) => {
        event.preventDefault();

        Intercom("showSpace", "help");
      });
    }

    intercomLinks.forEach(link => {
      if (link.getAttribute("data-intercom-article-id") !== "") {
        link.addEventListener("click", (event) => {
          event.preventDefault();

          Intercom("showArticle", parseInt(link.getAttribute("data-intercom-article-id"), 10));
        });
      }
    });
  }
})

export default addHomeViewEventListeners;
