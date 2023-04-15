import moment from "moment-timezone";
import {
  CATCHED_ERROR,
  EMAIL_EXISTS,
  REGISTER_ERROR,
  REGISTER_SUCCESSFUL,
} from "../constants/message";
import { STATUS } from "../constants/constants";
// import 'moment-timezone/builds/moment-timezone-with-data-2012-2022';

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

export const calculateExpense = (payment: number, members: number): number => {
  let result = 0;
  if (!isNaN(payment) && members > 0) {
    result = Math.floor((payment / (members + 1)) * 100) / 100;
  }
  return result;
};

export const formattedDate = (date: Date, format: string): string => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const localDate = moment.utc(date).tz(timezone).format();
  // substring a date (YYYY-MM-DD HH:MM)
  if (format === "time") {
    return (
      localDate.toLocaleString().substring(0, 10) +
      " at " +
      localDate.toLocaleString().substring(11, 16)
    );
    // substring a date (YYYY-MM-DD)
  } else {
    return localDate.toLocaleString().substring(0, 10);
  }
};

// ----------------------------------------------------------------
// check an email address if it has already existed in a collection
// ----------------------------------------------------------------
interface validateEmailProps {
  email: string;
  setEmailError: (value: string) => void;
  setMessage: (value: string) => void;
  setStatus: (value: STATUS) => void;
}
export const validateEmailExist = async ({
  email,
  setEmailError,
  setMessage,
  setStatus,
}: validateEmailProps): Promise<boolean> => {
  try {
    const response = await fetch("http://localhost:3001/api/exist/user", {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data > 0) {
        setEmailError(EMAIL_EXISTS);
        return false;
      } else {
        setMessage(REGISTER_SUCCESSFUL);
        setStatus(STATUS.SUCCESS);
        return true;
      }
    } else {
      setMessage(REGISTER_ERROR);
      setStatus(STATUS.ERROR);
      return false;
    }
  } catch (error) {
    console.log(error);
    setMessage(CATCHED_ERROR);
    setStatus(STATUS.ERROR);
    return false;
  }
};
