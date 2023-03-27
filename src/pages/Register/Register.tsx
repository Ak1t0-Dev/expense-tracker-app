import { useState } from "react";
import { Button } from "../../components/Button/Button";
import { InputText } from "../../components/InputText/InputText";
import { MainContainer } from "../../components/MainContainer/MainContainer";

export const Register = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");

  // validations
  const validateValues = () => {
    validateEmail(email);
    validatePassword(password);
    validateMatchPassword(password, confirmPassword);
  };

  // email address validation
  const validateEmail = (email: string) => {
    let regex = /\S+@\S+\.\S+/;
    if (!regex.test(email)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  // password validation
  const validatePassword = (password: string) => {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    if (!regex.test(password)) {
      setPasswordError("Please enter a valid password.");
    } else {
      setPasswordError("");
    }
  };

  // password match validation
  const validateMatchPassword = (password: string, confirmPassword: string) => {
    if (password !== confirmPassword) {
      setPasswordMatchError("Passwords do not match.");
    } else {
      setPasswordMatchError("");
    }
  };

  return (
    <>
      <MainContainer>
        <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            <form className="mt-8 space-y-6" action="#" method="POST">
              <input type="hidden" name="remember" value="true" />
              <div className="-space-y-px rounded-md">
                {/* email input component */}
                <InputText
                  id="email-address"
                  title="Email address"
                  name="email"
                  value={email}
                  onChange={setEmail}
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
                  onChange={setPassword}
                  type="password"
                  autoComplete="current-password"
                  placeholder="Password"
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
                  autoComplete="current-password"
                  placeholder="Password"
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
                  onClick={validateValues}
                />
              </div>
            </form>
          </div>
        </div>
      </MainContainer>
    </>
  );
};
