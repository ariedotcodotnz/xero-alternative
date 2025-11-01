/**
 * Utility for adding "copy-to-clipboard" functionality to a button
 *
 * For the content you want to copy:
 *  - Add the attribute "data-copy-trigger" to the content you want copied
 *  - "data-copy-trigger" should be the id of the element that will trigger the copy event (e.g.: copy-bank-details)
 *
 * For the trigger:
 *  - Add the class "copy-trigger" to the element
 *  - Also add an id to the element which should be the same as what you put for the "data-copy-trigger" on the copyable content
 *  - [optional] add "data-copy-success" message to trigger
 *
 * @param {HTMLButtonElement} currentTrigger the trigger element
 */

// eslint-disable-next-line xss/no-mixed-html
export const copyContent = async (currentTrigger: HTMLElement) => {
  const triggerName = currentTrigger.id;
  const sourceToCopy: HTMLElement = document.querySelector(
    `[data-copy-trigger="${triggerName}"]`,
  );

  let contentToCopy;
  if (sourceToCopy instanceof HTMLInputElement) {
    contentToCopy = sourceToCopy.value || "";
  } else {
    contentToCopy = sourceToCopy.innerText;
  }

  const contentToExclude = sourceToCopy.dataset.copyExclude;
  if (contentToExclude) {
    contentToExclude.split("|").forEach((item) => {
      contentToCopy = contentToCopy.replaceAll(item, "");
    });
  }

  contentToCopy = contentToCopy.trim();

  await navigator.clipboard.writeText(contentToCopy);

  const copySuccessMessage = currentTrigger.dataset.copySuccess;
  if (copySuccessMessage != null) {
    toastr.success(copySuccessMessage);
  } else {
    toastr.success("Copied!");
  }
};

// Attach event listener to listen for Trigger clicks
export const attachCopyContentListeners = () => {
  document.addEventListener("click", (event: MouseEvent) => {
    if (
      event.target instanceof HTMLElement &&
      event.target.className.match(/\bcopy-trigger\b/)
    ) {
      copyContent(event.target);
    }
  });
};

export default copyContent;
