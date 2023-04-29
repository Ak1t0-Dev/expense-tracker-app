import { useContext, useEffect, useState } from "react";
import { MainContainer } from "../../components/MainContainer/MainContainer";
import { Header } from "../../components/Header/Header";
import { Button } from "../../components/Button/Button";
import { GroupModal } from "../../components/Modal/GroupModal/GroupModal";
import { fetchedGroupsData, formattedDate } from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import { STATUS } from "../../constants/constants";
import { Snackbar } from "../../components/Snackbar/Snackbar";
import { Groups } from "../../types/types";
import { GroupDetailModal } from "../../components/Modal/GroupDetailModal/GroupDetailModal";

export const MyGroupsList = () => {
  // for assigning a user email from the local storage
  const userEmail = localStorage.getItem("expense-tracker") || "";
  const [groups, setGroups] = useState<Groups[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Groups | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [status, setStatus] = useState<STATUS>(STATUS.EMPTY);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchedGroupsData({ email: userEmail, setGroups, setMessage, setStatus });
  }, [userEmail]);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleDetailModalOpen = (selected: Groups) => {
    setSelectedGroup(selected);
    setIsDetailModalOpen(true);
  };

  const handleDetailModalClose = () => {
    setIsDetailModalOpen(false);
  };

  return (
    <>
      <Header />
      <MainContainer>
        <div className="flex flex-col min-h-full items-center justify-start py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-4">
            <h2>My Groups List</h2>
            <div className="h-80 overflow-auto">
              {groups.map((group, index) => (
                <div
                  key={index}
                  className="mb-2 font-medium bg-white border-2 border-black px-4 py-2 flex flex-row justify-between cursor-pointer"
                  onClick={() => handleDetailModalOpen(group)}
                >
                  <span className="inline-block">{group.group_name}</span>
                  <span className="inline-block">
                    {formattedDate(group.registered_at, "")}
                  </span>
                </div>
              ))}
            </div>
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
          {isModalOpen && (
            <GroupModal
              onClose={handleModalClose}
              userEmail={userEmail}
              fetchedGroupsData={() =>
                fetchedGroupsData({
                  email: userEmail,
                  setGroups,
                  setMessage,
                  setStatus,
                })
              }
            />
          )}
          {isDetailModalOpen && (
            <GroupDetailModal
              onClose={handleDetailModalClose}
              userEmail={userEmail}
              data={selectedGroup}
            />
          )}
        </div>
        {status !== "" && <Snackbar type={status} message={message} />}
      </MainContainer>
    </>
  );
};
