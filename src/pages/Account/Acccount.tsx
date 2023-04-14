import { useContext, useEffect, useState } from "react";
import { MainContainer } from "../../components/MainContainer/MainContainer";
import { Header } from "../../components/Header/Header";
import { Button } from "../../components/Button/Button";
import { AccountModal } from "../../components/Modal/AccountModal/AccountModal";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import { CATCHED_ERROR, RETRIEVED_ERROR } from "../../constants/message";
import { STATUS } from "../../constants/constants";
import { Snackbar } from "../../components/Snackbar/Snackbar";

interface UserInfo {
  name: string;
  email: string;
}

export const Acccount = () => {
  // for assigning a user email from the local storage
  const userEmail = localStorage.getItem("expense-tracker") || "";
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState<STATUS>(STATUS.EMPTY);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);

  const fetchedUserData = async (email: string) => {
    try {
      const response = await fetch("http://localhost:3001/api/get/user", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
        return true;
      } else {
        setMessage(RETRIEVED_ERROR);
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

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    fetchedUserData(userEmail);
  }, [userEmail]);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  if (!user) {
    return null; // if userEmail is null or undefined, don't render the modal
  }

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
            <AccountModal
              onClose={handleModalClose}
              user={user}
              currentEmail={userEmail}
              fetchedUserData={fetchedUserData}
            />
          ) : null}
          {status !== "" ? <Snackbar type={status} message={message} /> : null}
        </div>
      </MainContainer>
    </>
  );
};
