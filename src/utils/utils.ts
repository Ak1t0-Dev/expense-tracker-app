// ----------------------------------------------------------------
// an email address validation
// ----------------------------------------------------------------
export const validateEmail = (email: string): boolean => {
  let regex = /\S+@\S+\.\S+/;
  if (!regex.test(email)) {
    return false;
  } else {
    return true;
  }
};

// ----------------------------------------------------------------
// a password validation
// ----------------------------------------------------------------
export const validatePassword = (password: string): boolean => {
  const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  if (!regex.test(password)) {
    return false;
  } else {
    return true;
  }
};

// ----------------------------------------------------------------
// password match validation
// ----------------------------------------------------------------
export const validateMatchPassword = (
  password: string,
  confirmPassword: string
): boolean => {
  if (password !== confirmPassword) {
    return false;
  } else {
    return true;
  }
};

// ----------------------------------------------------------------
// a payment validation
// ----------------------------------------------------------------
export const validatePayment = (payment: number): boolean => {
  const regex = /^\d+$/;
  if (!regex.test(payment.toString())) {
    return false;
  } else {
    return true;
  }
};

// ----------------------------------------------------------------
// a description validation
// ----------------------------------------------------------------
export const validateDescription = (description: string): boolean => {
  const regex = /^\w+$/;
  if (!regex.test(description)) {
    return false;
  } else {
    return true;
  }
};

// ----------------------------------------------------------------
// substring a date (YYYY-MM-DD)
// ----------------------------------------------------------------
export const formattedDate = (date: Date): String => {
  return date.toLocaleString().substring(0, 10);
};
