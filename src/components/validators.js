export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone) {
  const frenchPhonePattern = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;

  // Remove any non-numeric characters from phone number
  const numericPhone = phone.replace(/\D/g, '');

  // Check that numeric phone number matches French phone number pattern
  if (!frenchPhonePattern.test(numericPhone)) {
    return false;
  }

  // All checks passed, phone number is valid
  return true;
}