import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button/Button";
import { InputText } from "../../components/InputText/InputText";
import { MainContainer } from "../../components/MainContainer/MainContainer";
import {
  validateEmail,
  validatePassword,
  validateMatchPassword,
  isStringExist,
} from "../../utils/utils";
import {
  CATCHED_ERROR,
  EMAIL_EXISTS,
  EMAIL_INVALID,
  EMPTY,
  ENTER_EMAIL,
  ENTER_PASSWORD,
  NAME_INVALID,
  PASSWORD_INVALID,
  PASSWORD_UNMATCHED,
  REGISTER_ERROR,
  REGISTER_SUCCESSFUL,
} from "../../constants/message";
import { STATUS } from "../../constants/constants";
import { Snackbar } from "../../components/Snackbar/Snackbar";

export const Register = () => {
  const navigate = useNavigate();

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

  let isDisabled =
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
        if (data === 0) {
          return true;
        } else if (data > 0) {
          setEmailError(EMAIL_EXISTS);
          return false;
        } else {
          setMessage(REGISTER_ERROR);
          setStatus(STATUS.ERROR);
          return false;
        }
      })
      .catch((error) => {
        console.error(error);
        setMessage(CATCHED_ERROR);
        setStatus(STATUS.ERROR);
        return false;
      });
  };

  // ----------------------------------------------------------------
  // register a user data to a database
  // ----------------------------------------------------------------
  const registerUserData = async (): Promise<boolean> => {
    const userData = { userName, email, password };
    try {
      const response = await fetch("http://localhost:3001/api/register/user", {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        setMessage(REGISTER_SUCCESSFUL);
        setStatus(STATUS.SUCCESS);
        setTimeout(() => {
          navigate("/login");
        }, 1500);
        return true;
      } else {
        setMessage(REGISTER_ERROR);
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
      setUserNameError(NAME_INVALID);
      isValid = false;
    } else {
      setUserNameError(EMPTY);
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
      setPasswordMatchError(PASSWORD_UNMATCHED);
      isValid = false;
    } else {
      setPasswordMatchError(EMPTY);
    }

    if (isValid) {
      const isEmailExist = await validateEmailExist();
      if (isEmailExist) await registerUserData();
    }
  };

  return (
    <>
      <MainContainer>
        <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <input type="hidden" name="remember" value="true" />
              <div className="-space-y-px rounded-md">
                {/* user name input component */}
                <InputText
                  id="user-name"
                  title="User name"
                  name="user-name"
                  value={userName}
                  onChange={setUserName}
                  type="text"
                  autoComplete="off"
                  placeholder="Enter your user name"
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
                  placeholder={ENTER_EMAIL}
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
                  placeholder={ENTER_PASSWORD}
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
                  placeholder={ENTER_PASSWORD}
                  error={passwordMatchError}
                />
              </div>

              <div>
                <Button
                  name="REGISTER"
                  textColor="text-yellow-50"
                  bgColor="bg-yellow-800"
                  hoverColor="hover:bg-yellow-700"
                  focusColor="focus:bg-yellow-800"
                  disabled={isDisabled}
                />
              </div>
            </form>
          </div>
        </div>
        {status !== "" ? <Snackbar type={status} message={message} /> : null}
      </MainContainer>
    </>
  );
};
