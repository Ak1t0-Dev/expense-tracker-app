import React, { useEffect, useState } from "react";
import { InputText } from "../../components/InputText/InputText";
import { Button } from "../../components/Button/Button";
import { MainContainer } from "../../components/MainContainer/MainContainer";
import { useNavigate } from "react-router-dom";
import { fetchedFriendsData, validateEmail } from "../../utils/utils";
import { Header } from "../../components/Header/Header";
import {
  CATCHED_ERROR,
  EMAIL_INVALID,
  RETRIEVED_ERROR,
  SEND_ERROR,
  SEND_SUCCESSFUL,
} from "../../constants/message";
import { Snackbar } from "../../components/Snackbar/Snackbar";
import { STATUS } from "../../constants/constants";
import { Friends, PendingFriends } from "../../types/types";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export const MyFriendsList = () => {
  const userEmail = localStorage.getItem("expense-tracker") || "";
  const navigate = useNavigate();

  const [friends, setFriends] = useState<Friends[]>([]);
  const [pendingFriends, setPendingFriends] = useState<PendingFriends[]>([]);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [status, setStatus] = useState<STATUS>(STATUS.EMPTY);
  const [message, setMessage] = useState("");
  const isDisabled = email.trim() === "";
  let isValid = true;

  const userName = useSelector(
    (state: RootState) => state.userStatus.user?.name
  );

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
      fetchSendRequest(email, userName as string);
      setEmail("");
    }
  };

  useEffect(() => {
    fetchedFriendsData({ email: userEmail, setFriends, setMessage, setStatus });
  }, [userEmail]);

  useEffect(() => {
    fetchPendingFriends();
    console.log(pendingFriends);
  }, []);

  const handleEmailChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    return setEmail(event.target.value);
  };

  const fetchSendRequest = async (requestEmail: string, userName: string) => {
    return await fetch("http://localhost:3001/api/send/request", {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requestEmail: requestEmail,
        email: userEmail,
        userName: userName,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data) {
          setMessage(SEND_ERROR);
          setStatus(STATUS.ERROR);
        } else {
          setMessage(SEND_SUCCESSFUL);
          setStatus(STATUS.SUCCESS);
        }
      })
      .catch((error) => {
        console.log(error);
        setMessage(CATCHED_ERROR);
        setStatus(STATUS.ERROR);
      });
  };

  const fetchPendingFriends = async () => {
    return await fetch("http://localhost:3001/api/get/pendingFriends", {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: userEmail,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data) {
          setMessage(RETRIEVED_ERROR);
          setStatus(STATUS.ERROR);
        } else {
          setPendingFriends(data);
        }
      })
      .catch((error) => {
        console.log(error);
        setMessage(CATCHED_ERROR);
        setStatus(STATUS.ERROR);
      });
  };

  return (
    <>
      <Header />
      <MainContainer>
        <div className="flex flex-col min-h-full items-center justify-start py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-4">
            <h2>My Friends List</h2>
            <div className="h-24 overflow-auto">
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
            <h5>Pending</h5>
            <div className="h-24 mt-1 overflow-auto">
              {pendingFriends.map((friend, index) => (
                <div
                  key={index}
                  className="mb-2 font-medium bg-white border-2 border-black px-4 py-2 flex flex-row justify-between cursor-pointer"
                >
                  <span className="inline-block">
                    {friend.reciever.reciever_name
                      ? friend.reciever.reciever_name
                      : "-"}
                  </span>
                  <span className="inline-block">
                    {friend.reciever.reciever_email}
                  </span>
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
                  onChange={handleEmailChange}
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
                    // onClick={handleFriendRequest}
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
