import { useEffect, useState } from "react";
import { InputText } from "../../components/InputText/InputText";
import { Button } from "../../components/Button/Button";
import { MainContainer } from "../../components/MainContainer/MainContainer";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/utils";
import { Header } from "../../components/Header/Header";

interface UserFriends {
  email: string;
  name: string;
}

export const Friends = () => {
  const userEmail = localStorage.getItem("expense-tracker" || null);
  const navigate = useNavigate();

  const [friends, setFriends] = useState<UserFriends[]>([]);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const isDisabled = email.trim() === "";
  let isValid = true;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // validations
    const isEmailValid = validateEmail(email);

    if (!isEmailValid) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (isValid) {
      navigate("/login");
    }
  };

  useEffect(() => {
    const postUser = {
      email: userEmail,
    };
    fetch("http://localhost:3001/api/friends", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postUser),
    })
      .then((response) => response.json())
      .then((data) => {
        setFriends(data);
      });
  }, [userEmail]);

  return (
    <>
      <Header />
      <MainContainer>
        <div className="flex flex-col min-h-full items-center justify-start py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-4">
            <h2>My Friends List</h2>
            {friends.map((friend, index) => (
              <div
                key={index}
                className="mb-2 border border-black px-4 py-2 flex flex-row justify-between"
              >
                <span className="inline-block">{friend.name}</span>
                <span className="inline-block">{friend.email}</span>
              </div>
            ))}
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
      </MainContainer>
    </>
  );
};
