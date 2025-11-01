export const processClickableRows = () => {
  document.querySelectorAll(".clickable-row").forEach((row) => {
    if (!row.parentElement || !row.parentElement.dataset.url) return;
    const { remote, url, trackWith } = row.parentElement.dataset;
    if (url) {
      const link = document.createElement("a");
      link.href = url;
      link.className = "clickable-link";
      if (remote) link.setAttribute("data-remote", "true");
      if (trackWith) link.setAttribute("data-track-click", trackWith);
      link.innerHTML = row.innerHTML;
      row.innerHTML = "";
      row.appendChild(link);
    }
  });
};

const bindClickableRows = () => {
  document.addEventListener("turbolinks:load", processClickableRows);
};

export default bindClickableRows;
