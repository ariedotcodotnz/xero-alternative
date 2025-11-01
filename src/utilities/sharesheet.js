// Attach event listener to listen for Trigger clicks
$(document).on("click", ".share-trigger", function (event) {
  const { currentTarget } = event;
  shareContent(currentTarget);
});
/**
 * Utility function for adding Native Sharesheet triggering to a button element.
 *
 * Usage:
 * - The trigger:
 *   - Add an id as an identifier, this could be anything but something like "share-[whatever]" to avoid any conflicts.
 *   - Add the class "share-trigger".
 *   - Add the onclick attribute with "shareContent(this)" as the value. This will activate the share when the trigger is clicked.
 * - The content:
 *   - Add a "data-share-trigger" attribute to the content. The value to this attribute should be the id of the trigger.
 *   - Add the class "shareable"
 *
 * Notes:
 * - Native sharing is for the most part only supported on iOS and Safari on desktop. Use a device helper to conditionally apply this functionlity when required.
 *
 * @param {HTMLButtonElement} currentTrigger the trigger element
 */
const shareContent = function (currentTrigger) {
  currentTrigger = $(currentTrigger);
  const triggerName = currentTrigger.attr("id");
  const currentTargets = $(`[data-share-trigger="${triggerName}"]`);
  let shareContent = [];
  currentTargets.each(function (index, target) {
    const currentTarget = $(target);
    const currentTargetContent = currentTarget.text();
    shareContent = [...shareContent, currentTargetContent];
  });
  shareContent = shareContent[0];
  openShareSheet(shareContent);
};

/**
 * Opens the Native ShareSheet on the device if supported.
 * If web-share isn't supported natively then it will fail silently.
 *
 * @param {string} content content to be shared
 */
const openShareSheet = function (content) {
  if (navigator.share !== undefined) {
    navigator.share({
      text: content,
    })
      .catch((error) => content);
  }
};
