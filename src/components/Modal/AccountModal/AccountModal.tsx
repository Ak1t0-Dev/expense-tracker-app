import { useState } from "react";
import { InputText } from "../../InputText/InputText";
import { Button } from "../../Button/Button";
import { Snackbar } from "../../Snackbar/Snackbar";
import {
  EMAIL_INVALID,
  PASSWORD_INVALID,
  EMPTY,
  REGISTER_ERROR,
  REGISTER_SUCCESSFUL,
  CATCHED_ERROR,
  ENTER_NEW_PASSWORD,
} from "../../../constants/message";
import { STATUS } from "../../../constants/constants";
import {
  validateEmail,
  validatePassword,
  validateEmailExist,
  validateLength,
} from "../../../utils/utils";
import { ModalProps } from "../../../types/types";

export const AccountModal = ({
  onClose,
  user,
  currentEmail,
  fetchedUserData,
}: ModalProps) => {
  const [userName, setUserName] = useState(user.name);
  const [userNameError, setUserNameError] = useState("");
  const [email, setEmail] = useState(user.email);
  const [emailError, setEmailError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [status, setStatus] = useState<STATUS>(STATUS.EMPTY);
  const [message, setMessage] = useState("");

  // make a button activated or not
  const isDisabled =
    userName.trim() === "" || email.trim() === "" || newPassword.trim() === "";
  let isValid = true;

  // ----------------------------------------------------------------
  // register a user data if it is valid
  // ----------------------------------------------------------------
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // validations
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(newPassword);

    isValid = validateLength({
      target: userName,
      fieldName: "User name",
      min: 1,
      max: 20,
      fieldError: setUserNameError,
    });

    if (!isEmailValid) {
      setEmailError(EMAIL_INVALID);
      isValid = false;
    } else {
      setEmailError(EMPTY);
    }

    if (!isPasswordValid) {
      setNewPasswordError(PASSWORD_INVALID);
      isValid = false;
    } else {
      setNewPasswordError(EMPTY);
    }

    if (isValid) {
      const isEmailExist = await validateEmailExist({
        email,
        setEmailError,
        setMessage,
        setStatus,
      });
      if (isEmailExist) {
        updateUserData();
      }
    }
  };

  const handleUserChange = (value: string) => {
    setUserName(value);
  };

  const updateUserData = async () => {
    const userData = {
      currentEmail: currentEmail,
      name: userName,
      email: email,
      password: newPassword,
    };
    try {
      const response = await fetch("http://localhost:3001/api/update/user", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setEmail(data.email);
        setUserName(data.name);
        localStorage.setItem("expense-tracker", data.email);
        onClose();
        fetchedUserData(data.email);
        setMessage(REGISTER_SUCCESSFUL);
        setStatus(STATUS.SUCCESS);
        return true;
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

  return (
    <>
      <div
        id="small-modal"
        className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] md:h-full flex items-center justify-center"
      >
        <div className="relative w-full h-full max-w-md md:h-auto">
          <form onSubmit={handleSubmit} className="p-4">
            <div className="relative bg-white rounded-lg shadow border-2 border-black">
              <div className="flex items-center justify-between px-5 pt-5 rounded-t">
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
              <div className="flex flex-col p-6 border-gray-200 rounded-b">
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
                  title="New Password"
                  name="password"
                  value={newPassword}
                  onChange={setNewPassword}
                  type="password"
                  autoComplete="current-password"
                  placeholder={ENTER_NEW_PASSWORD}
                  error={newPasswordError}
                />
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
      {status !== "" && <Snackbar type={status} message={message} />}
    </>
  );
};
