document.addEventListener("submit", event => {
  // eslint-disable-next-line xss/no-mixed-html
  const form = event.target;

  if (form instanceof HTMLFormElement && form.matches("#page_list_search[data-search-event-name]")) {
    const input: HTMLInputElement = form.querySelector('input[type="search"]');

    if (input.value !== form.dataset.previousSearch && input.value !== "") {
      window.analytics.track(form.dataset.searchEventName, { search_query: input.value });
    }
  }
});
