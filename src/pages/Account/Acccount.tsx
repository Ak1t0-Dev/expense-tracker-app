import { useEffect, useState } from "react";
import { MainContainer } from "../../components/MainContainer/MainContainer";
import { Header } from "../../components/Header/Header";

interface UserInfo {
  name: string;
  email: string;
}

export const Acccount = () => {
  // for assigning a user email from the local storage
  const userEmail = localStorage.getItem("expense-tracker") || "";
  const [user, setUser] = useState<UserInfo | null>(null);

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

  if (!user) {
    return null;
  }
  return (
    <>
      <Header />
      <MainContainer>
        <div>{user.name}</div>
        <div>{user.email}</div>
        <div></div>
      </MainContainer>
    </>
  );
};
