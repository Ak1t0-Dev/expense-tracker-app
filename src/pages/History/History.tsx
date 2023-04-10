import { useEffect, useState } from "react";
import { Header } from "../../components/Header/Header";
import { MainContainer } from "../../components/MainContainer/MainContainer";
import { HistoryModal } from "../../components/Modal/HistoryModal/HistoryModal";
import { formattedDate } from "../../utils/utils";

interface User {
  email: string;
}

export interface UserHistory {
  id: string;
  payer: {
    email: string;
    name: string;
  };
  group_name: string;
  members: {
    email: string;
    name: string;
  }[];
  methods: {
    method_order: Number;
    method_name: string;
  };
  processes: {
    process_status: Number;
    process_name: string;
  };
  categories: {
    category_order: Number;
    category_name: string;
  };
  description: string;
  payment: Number;
  registered_name: {
    email: string;
    name: string;
  };
  registered_at: Date;
}

export const History = () => {
  // for assigning a user email from the local storage
  const userEmail = localStorage.getItem("expense-tracker") || "";
  const [history, setHistory] = useState<UserHistory[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<UserHistory | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const user: User = {
      email: userEmail,
    };
    fetch("http://localhost:3001/api/history", {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
      .then((response) => response.json())
      .then((data) => {
        setHistory(data);
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [userEmail]);

  const handleModalOpen = (selected: UserHistory) => {
    setSelectedHistory(selected);
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
            <h2>History</h2>
            {history.map((data, index) => {
              return (
                <div
                  key={index}
                  className="mb-2 border border-black px-4 py-2"
                  onClick={() => handleModalOpen(data)}
                >
                  <div>{data.description}</div>
                  <p>
                    {data.payer.name} paid {data.payment.toString()}{" "}
                    {data.group_name ? `at {data.group_name}` : null}
                  </p>
                  <div>
                    <span className="pr-0.5">
                      {formattedDate(data.registered_at)}
                    </span>
                    <span className="pr-0.5">
                      added by {data.registered_name.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          {isModalOpen ? (
            <HistoryModal onClose={handleModalClose} data={selectedHistory} />
          ) : null}
        </div>
      </MainContainer>
    </>
  );
};
