import { useState } from "react";
import { InputText } from "../../InputText/InputText";
import { Button } from "../../Button/Button";
import { Snackbar } from "../../Snackbar/Snackbar";
import {
  EMAIL_INVALID,
  PASSWORD_INVALID,
  EMPTY,
  NAME_INVALID,
} from "../../../constants/message";
import { STATUS } from "../../../constants/constants";
import {
  isStringExist,
  validateEmail,
  validateMatchPassword,
  validatePassword,
} from "../../../utils/utils";

interface ModalProps {
  onClose: () => void;
  userEmail: string;
}

export const AccountModal = ({ onClose, userEmail }: ModalProps) => {
  const [userName, setUserName] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [status, setStatus] = useState<STATUS>(STATUS.EMPTY);
  const [message, setMessage] = useState("");

  // make a button activated or not
  const isDisabled =
    userName.trim() === "" ||
    email.trim() === "" ||
    password.trim() === "" ||
    confirmPassword.trim() === "";
  let isValid = true;

  // ----------------------------------------------------------------
  // check an email address if it has already existed in a collection
  // ----------------------------------------------------------------
  const validateEmailExist = async (): Promise<boolean> => {
    return await fetch("http://localhost:3001/api/user/exist", {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.count > 0) {
          console.log("The email address has already existed.");
          return false;
        } else {
          alert("Registration successful");
          return true;
        }
      })
      .catch((error) => {
        console.error(error);
        return false;
      });
  };

  // ----------------------------------------------------------------
  // register a user data if it is valid
  // ----------------------------------------------------------------
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // validations
    const isUserNameValid = isStringExist(userName);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isMatchPasswordValid = validateMatchPassword(
      password,
      confirmPassword
    );

    if (!isUserNameValid) {
      setEmailError(NAME_INVALID);
      isValid = false;
    } else {
      setEmailError(EMPTY);
    }

    if (!isEmailValid) {
      setEmailError(EMAIL_INVALID);
      isValid = false;
    } else {
      setEmailError(EMPTY);
    }

    if (!isPasswordValid) {
      setPasswordError(PASSWORD_INVALID);
      isValid = false;
    } else {
      setPasswordError(EMPTY);
    }

    if (!isMatchPasswordValid) {
      setPasswordMatchError("Please enter a valid email address.");
      isValid = false;
    } else {
      setPasswordMatchError(EMPTY);
    }

    if (isValid) {
      const isEmailExist = await validateEmailExist();
      if (isEmailExist) {
        // updateUserData();
      }
    }
  };

  const handleUserChange = (value: string) => {
    setUserName(value);
  };

  return (
    <>
      <div
        id="small-modal"
        className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] md:h-full"
      >
        <div className="relative w-full h-full max-w-md md:h-auto">
          <form onSubmit={handleSubmit} className="p-4">
            <div className="relative bg-white rounded-lg shadow">
              <div className="flex items-center justify-between p-5 border-b rounded-t">
                <InputText
                  id="user-name"
                  title="User name:"
                  name="user-name"
                  value={userName}
                  onChange={handleUserChange}
                  type="text"
                  autoComplete="off"
                  placeholder="Enter a group name"
                  error={userNameError}
                />
                {/* email input component */}
                <InputText
                  id="email-address"
                  title="Email address"
                  name="email-address"
                  value={email}
                  onChange={setEmail}
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email address"
                  error={emailError}
                />

                {/* password input component */}
                <InputText
                  id="password"
                  title="Password"
                  name="password"
                  value={password}
                  onChange={setPassword}
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  error={passwordError}
                />

                {/* confirm password input component */}
                <InputText
                  id="confirm-password"
                  title="Confirm Password"
                  name="confirm-password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  type="password"
                  autoComplete="off"
                  placeholder="Password"
                  error={passwordMatchError}
                />
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-hide="small-modal"
                  onClick={onClose}
                >
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                <Button
                  name="SAVE"
                  textColor="text-amber-50"
                  bgColor="bg-amber-800"
                  hoverColor="hover:bg-amber-700"
                  focusColor="focus:bg-amber-800"
                  disabled={isDisabled}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
      {status !== "" ? <Snackbar type={status} message={message} /> : null}
    </>
  );
};
