// messages
export const EMPTY = "";
export const NAME_INVALID = "Please enter a valid name.";
export const EMAIL_INVALID = "Please enter a valid email address.";
export const EMAIL_EXISTS =
  "The email address has already existed. Try another email address.";
export const PASSWORD_INVALID = "Please enter a valid password.";
export const PASSWORD_UNMATCHED = "Passwords do not match.";
export const REGISTER_SUCCESSFUL = "Registration is successful.";
export const REGISTER_ERROR = "Registration failed.";
export const LOGIN_SUCCESSFUL = "Login is successful";
export const LOGIN_ERROR = "Login failed. Invalid email or password.";
export const CHANGE_SUCCESSFUL = "The change is successful.";
export const CHANGE_ERROR = "The change failed.";
export const CATCHED_ERROR = "Something went wrong.";
export const PAYMENT_ERROR = "Payment should be a number.";
export const DESCRIPTION_ERROR =
  "Description should be one or more characters.";
export const RETRIEVED_ERROR = "Failed to retrieve data from the server.";
export const SEND_SUCCESSFUL = "The request has been successfully sent.";
export const SEND_ERROR = "The request failed.";
// placeholders
export const ENTER_USERNAME = "Enter your user name";
export const ENTER_EMAIL = "Enter your email address";
export const ENTER_PASSWORD = "Enter your password";
export const ENTER_NEW_PASSWORD = "Enter a new password";
export const ENTER_FRIENDS_EMAIL = "Search your friends";

// dynamic messages
export const getInputLengthMessage = (
  fieldName: string,
  min: number,
  max: number
) => {
  return `${fieldName} must be between ${min} and ${max} characters long.`;
};
