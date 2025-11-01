/**
 * Function to dynamically disable/enable any rails form button
 * @param disabled
 * @param btnElementId // don't include the #
 */

export const toggleNextBtnDisabled = (disabled: boolean, btnElementId: string) => {
  // eslint-disable-next-line xss/no-mixed-html
  const nextButton = document.getElementById(btnElementId) as HTMLButtonElement
  if(nextButton) {
    nextButton.disabled = disabled;
  }
};

export default toggleNextBtnDisabled;
