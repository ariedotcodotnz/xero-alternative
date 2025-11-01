/**
 * Function to validate email(s) passed as a string
 * @return {boolean}
 */

const isValidEmail = (inputValue: string) => {
  const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const emails: string[] = inputValue.split(/;|,/);

  const emailsAreValid: boolean = emails
    .map((email) => EMAIL_REGEX.test(email.trim()))
    .every((email) => email);

  return emailsAreValid;
};

export default isValidEmail;
