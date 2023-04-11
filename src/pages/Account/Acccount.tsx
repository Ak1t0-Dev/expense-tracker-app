import { useContext, useEffect, useState } from "react";
import { MainContainer } from "../../components/MainContainer/MainContainer";
import { Header } from "../../components/Header/Header";
import { Button } from "../../components/Button/Button";
import { AccountModal } from "../../components/Modal/AccountModal/AccountModal";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";

interface UserInfo {
  name: string;
  email: string;
}

export const Acccount = () => {
  // for assigning a user email from the local storage
  const userEmail = localStorage.getItem("expense-tracker") || "";
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const postUser = {
      email: userEmail,
    };
    fetch("http://localhost:3001/api/get/user", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postUser),
    })
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
      });
  }, [userEmail]);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Header />
      <MainContainer>
        <div className="flex flex-col min-h-full items-center justify-start py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-4">
            <h2>My Account</h2>
            <div className="h-64 bg-white border-2 border-black px-4 py-8 text-xl font-semibold">
              {user && (
                <>
                  <div className="mb-4">Name: {user.name}</div>
                  <div className="mb-4">Email Address: {user.email}</div>
                </>
              )}
            </div>
          </div>
          <div>
            <Button
              name="change account details"
              textColor="text-yellow-50"
              bgColor="bg-yellow-800"
              hoverColor="hover:bg-yellow-700"
              focusColor="focus:bg-yellow-800"
              onClick={handleModalOpen}
            />
          </div>
          {isModalOpen ? (
            <AccountModal onClose={handleModalClose} userEmail={userEmail} />
          ) : null}
        </div>
      </MainContainer>
    </>
  );
};
