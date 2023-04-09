import { useEffect, useState } from "react";
import { MainContainer } from "../../components/MainContainer/MainContainer";
import { Header } from "../../components/Header/Header";
import { Button } from "../../components/Button/Button";
import { GroupModal } from "../../components/Modal/GroupModal/GroupModal";
import { formattedDate } from "../../utils/utils";

interface UserGroups {
  uuid: string;
  group_name: string;
  member_name: string[];
  registered_name: string;
  registered_at: Date;
}

export const Groups = () => {
  // for assigning a user email from the local storage
  const userEmail = localStorage.getItem("expense-tracker") || "";

  const [groups, setGroups] = useState<UserGroups[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const postUser = {
      email: userEmail,
    };
    fetch("http://localhost:3001/api/get/groups", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postUser),
    })
      .then((response) => response.json())
      .then((data) => {
        setGroups(data);
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
            <h2>your groups list</h2>
            {groups.map((group, index) => (
              <div
                key={index}
                className="mb-2 border border-black px-4 py-2 flex flex-row justify-between"
              >
                <span className="inline-block">{group.group_name}</span>
                <span className="inline-block">{group.registered_name}</span>
                <span className="inline-block">
                  {formattedDate(group.registered_at)}
                </span>
              </div>
            ))}
            <div>
              <Button
                name="CREATE A GROUP"
                textColor="text-yellow-50"
                bgColor="bg-yellow-800"
                hoverColor="hover:bg-yellow-700"
                focusColor="focus:bg-yellow-800"
                onClick={handleModalOpen}
              />
            </div>
          </div>
          {isModalOpen ? (
            <GroupModal onClose={handleModalClose} userEmail={userEmail} />
          ) : null}
        </div>
      </MainContainer>
    </>
  );
};
