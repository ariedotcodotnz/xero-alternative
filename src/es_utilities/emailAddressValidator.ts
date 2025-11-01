const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const containsInvalidEmail = (text) => {
  if (text.length > 0) {
    // split multiple email addresses
    const split = text.split(",");
    const result = split.map(email => {
      if (!email.trim().match(emailRegex)) {
        return true;
      }

      return false;
    });

    return result.includes(true)
  }

  return false;
}

export default containsInvalidEmail;
