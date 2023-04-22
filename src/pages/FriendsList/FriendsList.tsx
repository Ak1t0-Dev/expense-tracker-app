import { useEffect, useState } from "react";
import { InputText } from "../../components/InputText/InputText";
import { Button } from "../../components/Button/Button";
import { MainContainer } from "../../components/MainContainer/MainContainer";
import { useNavigate } from "react-router-dom";
import { fetchedFriendsData, validateEmail } from "../../utils/utils";
import { Header } from "../../components/Header/Header";
import { EMAIL_INVALID } from "../../constants/message";
import { Snackbar } from "../../components/Snackbar/Snackbar";
import { STATUS } from "../../constants/constants";
import { Friends } from "../../types/types";

export const FriendsList = () => {
  const userEmail = localStorage.getItem("expense-tracker") || "";
  const navigate = useNavigate();

  const [friends, setFriends] = useState<Friends[]>([]);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [status, setStatus] = useState<STATUS>(STATUS.EMPTY);
  const [message, setMessage] = useState("");
  const isDisabled = email.trim() === "";
  let isValid = true;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // validations
    const isEmailValid = validateEmail(email);

    if (!isEmailValid) {
      setEmailError(EMAIL_INVALID);
      isValid = false;
    } else {
      setEmailError("");
    }

    if (isValid) {
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchedFriendsData({ email: userEmail, setFriends, setMessage, setStatus });
  }, [userEmail]);

  return (
    <>
      <Header />
      <MainContainer>
        <div className="flex flex-col min-h-full items-center justify-start py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-4">
            <h2>My Friends List</h2>
            <div className="h-56 overflow-auto">
              {friends.map((friend, index) => (
                <div
                  key={index}
                  className="mb-2 font-medium bg-white border-2 border-black px-4 py-2 flex flex-row justify-between cursor-pointer"
                >
                  <span className="inline-block">{friend.name}</span>
                  <span className="inline-block">{friend.email}</span>
                </div>
              ))}
            </div>
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

                <div>
                  <Button
                    name="SEND REQUEST"
                    textColor="text-yellow-50"
                    bgColor="bg-yellow-800"
                    hoverColor="hover:bg-yellow-700"
                    focusColor="focus:bg-yellow-800"
                    disabled={isDisabled}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
        {status !== "" && <Snackbar type={status} message={message} />}
      </MainContainer>
    </>
  );
};
