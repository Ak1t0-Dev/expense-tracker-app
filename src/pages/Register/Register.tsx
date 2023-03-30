import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button/Button";
import { InputText } from "../../components/InputText/InputText";
import { MainContainer } from "../../components/MainContainer/MainContainer";
import {
  validateEmail,
  validatePassword,
  validateMatchPassword,
} from "../../utils/utils";

export const Register = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");

  let isValid = true;

  // ----------------------------------------------------------------
  // check an email address if it has already existed in a collection
  // ----------------------------------------------------------------
  const validateEmailExist = async (): Promise<boolean> => {
    return await fetch("http://localhost:3001/api/friend/exist", {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.count > 0) {
          return true;
        } else {
          console.log("The email address has already existed.");
          return false;
        }
      })
      .catch((error) => {
        console.error(error);
        return false;
      });
  };

  // ----------------------------------------------------------------
  // register a user data to a database
  // ----------------------------------------------------------------
  const registerUserData = async () => {
    const userData = { email, password };
    try {
      const response = await fetch("http://localhost:3001/api/user", {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        console.log("Registration successful");
      } else {
        console.error("Registration failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ----------------------------------------------------------------
  // register a user data if it is valid
  // ----------------------------------------------------------------
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // validations
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isMatchPasswordValid = validateMatchPassword(
      password,
      confirmPassword
    );

    if (!isEmailValid) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!isPasswordValid) {
      setPasswordError("Please enter a valid password.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!isMatchPasswordValid) {
      setPasswordMatchError("Please enter a valid email address.");
      isValid = false;
    } else {
      setPasswordMatchError("");
    }

    if (isValid) {
      const isEmailExist = await validateEmailExist();
      if (isEmailExist) {
        registerUserData();
        navigate("/login");
      }
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
                />
              </div>
            </form>
          </div>
        </div>
      </MainContainer>
    </>
  );
};
