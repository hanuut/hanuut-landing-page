export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone) {
  const algerianPhonePattern = /^(00213|\+213|0)(5|6|7)[0-9]{8}$/

  // Remove any non-numeric characters from phone number
  const numericPhone = phone.replace(/\D/g, '');

  // Check that numeric phone number matches Algerian phone number pattern
  if (!algerianPhonePattern.test(numericPhone)) {
    return false;
  }

  // All checks passed, phone number is valid
  return true;
}