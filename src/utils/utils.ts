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
export const validatePayment = (payment: string): boolean => {
  const regex = /^\d+$/;
  if (!regex.test(payment)) {
    return false;
  } else {
    return true;
  }
};
