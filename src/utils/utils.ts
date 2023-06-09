import moment from "moment-timezone";
import {
  CATCHED_ERROR,
  EMAIL_EXISTS,
  EMPTY,
  REGISTER_ERROR,
  REGISTER_SUCCESSFUL,
  RETRIEVED_ERROR,
  getInputLengthMessage,
} from "../constants/message";
import { STATUS } from "../constants/constants";
import { Friends, Groups } from "../types/types";

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
// string length check
// ----------------------------------------------------------------
export interface validateLengthProps {
  target: string;
  fieldName: string;
  min: number;
  max: number;
  fieldError: (value: string) => void;
}
export const validateLength = ({
  target,
  fieldName,
  min,
  max,
  fieldError,
}: validateLengthProps): boolean => {
  const minLength = min;
  const maxLength = max;
  if (target.length < minLength || target.length > maxLength) {
    fieldError(getInputLengthMessage(fieldName, min, max));
    return false;
  } else {
    fieldError(EMPTY);
    return true;
  }
};

// ----------------------------------------------------------------
// dived an expense equally
// ----------------------------------------------------------------
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

// ----------------------------------------------------------------
// get a user's friends data
// ----------------------------------------------------------------
interface friendsProps {
  email: string;
  setFriends: (value: Friends[]) => void;
  setMessage: (value: string) => void;
  setStatus: (value: STATUS) => void;
}
export const fetchedFriendsData = async ({
  // ここの処理はデータの整型まででいい
  email,
  setFriends,
  setMessage,
  setStatus,
}: friendsProps): Promise<boolean> => {
  try {
    const response = await fetch("http://localhost:3001/api/get/friends", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      const data = await response.json();
      setFriends(data);
      return true;
    } else {
      setMessage(RETRIEVED_ERROR);
      setStatus(STATUS.ERROR);
      return false;
    }
  } catch (error) {
    console.error(error);
    setMessage(CATCHED_ERROR);
    setStatus(STATUS.ERROR);
    return false;
  }
};

// ----------------------------------------------------------------
// get a user's groups data
// ----------------------------------------------------------------
interface groupsProps {
  email: string;
  setGroups: (value: Groups[]) => void;
  setMessage: (value: string) => void;
  setStatus: (value: STATUS) => void;
}
export const fetchedGroupsData = async ({
  email,
  setGroups,
  setMessage,
  setStatus,
}: groupsProps): Promise<boolean> => {
  try {
    const response = await fetch("http://localhost:3001/api/get/groups", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      const data = await response.json();
      setGroups(data);
      return true;
    } else {
      setMessage(RETRIEVED_ERROR);
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
