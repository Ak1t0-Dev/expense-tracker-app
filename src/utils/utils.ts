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
// string exist check
// ----------------------------------------------------------------
export const isStringExist = (description: string): boolean => {
  const regex = /^\w+$/;
  if (!regex.test(description)) {
    return false;
  } else {
    return true;
  }
};

// ----------------------------------------------------------------
// string length check
// ----------------------------------------------------------------
export const validateLength = (
  value: string,
  min: number,
  max: number
): boolean => {
  const minLength = min;
  const maxLength = max;
  if (value.length < minLength || value.length > maxLength) {
    return false;
  } else {
    // set the input value to the state variable
    return true;
  }
};

// ----------------------------------------------------------------
// substring a date (YYYY-MM-DD)
// ----------------------------------------------------------------
export const formattedDate = (date: Date): String => {
  return date.toLocaleString().substring(0, 10);
};

// ----------------------------------------------------------------
// substring a date (YYYY-MM-DD HH:MM)
// ----------------------------------------------------------------
export const formattedDateTime = (date: Date): String => {
  return (
    date.toLocaleString().substring(0, 10) +
    " at " +
    date.toLocaleString().substring(11, 16)
  );
};

export const calculateExpense = (payment: number, members: number): number => {
  let result = 0;
  if (!isNaN(payment) && members > 0) {
    result = Math.floor((payment / (members + 1)) * 100) / 100;
  }
  return result;
};
