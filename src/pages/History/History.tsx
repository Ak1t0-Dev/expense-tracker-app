import { useContext, useEffect, useState } from "react";
import { Header } from "../../components/Header/Header";
import { MainContainer } from "../../components/MainContainer/MainContainer";
import { HistoryModal } from "../../components/Modal/HistoryModal/HistoryModal";
import { formattedDate } from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";

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
    method_order: number;
    method_name: string;
  };
  processes: {
    process_status: number;
    process_name: string;
  };
  categories: {
    category_order: number;
    category_name: string;
  };
  description: string;
  payment: number;
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
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const user: User = {
      email: userEmail,
    };
    fetch("http://localhost:3001/api/get/history", {
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

  const getStyle = (email: string, payer: string) => {
    if (userEmail === email) {
      return {
        borderColor: "border-green-700",
        textColor: "text-green-700",
        payerName: "You",
      };
    } else {
      return {
        borderColor: "border-blue-700",
        textColor: "text-blue-700",
        payerName: payer,
      };
    }
  };

  return (
    <>
      <Header />
      <MainContainer>
        <div className="flex flex-col min-h-full items-center justify-start pt-12 pb-4 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-4">
            <h2>History</h2>
            <div className="h-96 overflow-auto">
              {history.map((data, index) => {
                const style = getStyle(data.payer.email, data.payer.name);
                return (
                  <div
                    key={index}
                    className={`mb-2 border-2 rounded-lg ${style.borderColor} px-4 py-2 bg-white cursor-pointer`}
                    onClick={() => handleModalOpen(data)}
                  >
                    <div className="font-medium text-lg">
                      {data.description}
                    </div>
                    <p className={`font-semibold ${style.textColor}`}>
                      {style.payerName} paid{" "}
                      {data.payment.toLocaleString().toString()}{" "}
                      {data.group_name && `at ${data.group_name}`}
                    </p>
                    <div className="text-sm">
                      <span className="pr-3">
                        {formattedDate(data.registered_at, "time")}
                      </span>
                      <span className="pr-0.5">
                        added by{" "}
                        {userEmail === data.registered_name.email
                          ? "you"
                          : data.registered_name.name}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {isModalOpen && (
            <HistoryModal onClose={handleModalClose} data={selectedHistory} />
          )}
        </div>
      </MainContainer>
    </>
  );
};
