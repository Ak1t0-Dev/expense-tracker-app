import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button/Button";
import { InputText } from "../../components/InputText/InputText";
import { MainContainer } from "../../components/MainContainer/MainContainer";
import { validateEmail, validatePassword } from "../../utils/utils";
import { Snackbar } from "../../components/Snackbar/Snackbar";
import {
  EMAIL_INVALID,
  EMPTY,
  LOGIN_SUCCESSFUL,
  LOGIN_ERROR,
  PASSWORD_INVALID,
  CATCHED_ERROR,
} from "../../constants/message";
import { STATUS } from "../../constants/constants";
import { useDispatch } from "react-redux";
import { login } from "../../redux/user/userSlice";

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [status, setStatus] = useState<STATUS>(STATUS.EMPTY);
  const [message, setMessage] = useState("");

  let isValid = true;
  // make a button activated or not
  const isDisabled = email.trim() === "" || password.trim() === "";

  // ----------------------------------------------------------------
  // a login function
  // ----------------------------------------------------------------
  const loginUser = async () => {
    return await fetch("http://localhost:3001/api/login", {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data) {
          setMessage(LOGIN_ERROR);
          setStatus(STATUS.ERROR);
        } else {
          dispatch(login(data));
          setMessage(LOGIN_SUCCESSFUL);
          setStatus(STATUS.SUCCESS);
          setTimeout(() => {
            navigate("/expense");
          }, 1500);
        }
      })
      .catch((error) => {
        console.log(error);
        setMessage(CATCHED_ERROR);
        setStatus(STATUS.ERROR);
      });
  };

  // ----------------------------------------------------------------
  // register a user data if it is valid
  // ----------------------------------------------------------------
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // validations
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

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

    if (isValid) {
      loginUser();
    }
  };

  const handleEmailChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    return setEmail(event.target.value);
  };

  const handlePasswordChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    return setPassword(event.target.value);
  };

  return (
    <>
      <MainContainer>
        <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <input type="hidden" name="remember" value="true" />
              <div className="-space-y-px rounded-md">
                {/* email input component */}
                <InputText
                  id="email-address"
                  title="Email address"
                  name="email"
                  value={email}
                  onChange={handleEmailChange}
                  type="email"
                  autoComplete="email"
                  placeholder="Email address"
                  error={emailError}
                />

                {/* password input component */}
                <InputText
                  id="password"
                  title="Password"
                  name="password"
                  value={password}
                  onChange={handlePasswordChange}
                  type="password"
                  autoComplete="current-password"
                  placeholder="Password"
                  error={passwordError}
                />
              </div>

              <div>
                <Button
                  name="LOGIN"
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
        {status !== "" && <Snackbar type={status} message={message} />}
      </MainContainer>
    </>
  );
};
