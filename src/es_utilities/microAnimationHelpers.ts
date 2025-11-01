/**
 * Fades out an HTML element by adding a CSS animation class and removing it after the animation ends.
 * @param element - The HTML element to fade out.
 */
export const fadeOut = (element: HTMLElement) => {
  element.addEventListener("animationend", () => {
    element.remove();
  });
  element.classList.add("tw-animate-fadeOutUp");
};

const MicroAnimationHelpers = {
  fadeOut,
};

export default MicroAnimationHelpers;
