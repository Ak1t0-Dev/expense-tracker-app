import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/Header/Header";
import { InputText } from "../../components/InputText/InputText";
import { MainContainer } from "../../components/MainContainer/MainContainer";
import {
  validateLength,
  validatePayment,
  calculateExpense,
  fetchedFriendsData,
  fetchedGroupsData,
} from "../../utils/utils";
import { STATUS } from "../../constants/constants";
import { Button } from "../../components/Button/Button";
import { Snackbar } from "../../components/Snackbar/Snackbar";
import {
  EMPTY,
  PAYMENT_ERROR,
  CATCHED_ERROR,
  REGISTER_SUCCESSFUL,
  REGISTER_ERROR,
  RETRIEVED_ERROR,
} from "../../constants/message";
import "./Expense.css";
import { SearchModal } from "../../components/Modal/SearchModal/SearchModal";
import { SearchButton } from "../../components/SearchButton/SearchButton";
import {
  Categories,
  Friends,
  Group,
  Groups,
  PendingFriends,
} from "../../types/types";
import { useGetRequest } from "../../hooks/useGetRequest";
import {
  GET_CATEGORIES_API_URL,
  GET_FRIENDS_API_URL,
  GET_PENDINGFRIENDS_API_URL,
} from "../../constants/apiUrls";
import { usePostRequest } from "../../hooks/usePostRequest";

export const Expense = () => {
  // for assigning a user email from the local storage
  console.log("rerender");
  const userEmail = localStorage.getItem("expense-tracker") || "";

  const [groups, setGroups] = useState<Groups[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<Friends[]>([]);
  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [payer, setPayer] = useState(userEmail);
  const [payment, setPayment] = useState(0);
  const [paymentError, setPaymentError] = useState("");
  const [calcPayment, setCalcPayment] = useState(0);
  const [category, setCategory] = useState(0);
  const [status, setStatus] = useState<STATUS>(STATUS.EMPTY);
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const isDisabled =
    selectedFriends.length === 0 ||
    description.trim() === "" ||
    payment === 0 ||
    isNaN(payment);

  interface UserInfo {
    email: string;
  }

  // ----------------------------------------------------------------
  // fetch categories
  // ----------------------------------------------------------------
  const { data: categories, error: categoriesError } = useGetRequest<
    Categories[]
  >(GET_CATEGORIES_API_URL, RETRIEVED_ERROR);

  // ----------------------------------------------------------------
  // fetch pending friends
  // --------------------------------------------------------------
  // { email: userEmail }
  const {
    data: pendingFriends,
    error: pendingFriendsError,
    isLoading,
  } = usePostRequest<PendingFriends[], UserInfo>(
    GET_PENDINGFRIENDS_API_URL,
    RETRIEVED_ERROR,
    { email: userEmail }
  );

  // ----------------------------------------------------------------
  // fetch friends
  // ----------------------------------------------------------------
  // const {
  //   data: friends,
  //   error: friendsError,
  //   isLoading,
  // } = usePostRequest<Friends[], UserInfo>(
  //   GET_FRIENDS_API_URL,
  //   RETRIEVED_ERROR,
  //   { email: userEmail }
  // );

  useEffect(() => {
    fetchedGroupsData({ email: userEmail, setGroups, setMessage, setStatus });
  }, [userEmail]);

  useEffect(() => {
    setCalcPayment(calculateExpense(payment, selectedFriends.length));
  }, [payment, selectedFriends]);

  const convertPendingFriends: Friends[] =
    pendingFriends?.map((pendingFriend) => {
      const { reciever_id, reciever_name, reciever_email } =
        pendingFriend.reciever;

      return {
        _id: reciever_id,
        name: reciever_name ? reciever_name : "-",
        email: reciever_email,
      };
    }) || [];

  // commonize later
  // const fetchPendingFriends = async () => {
  //   return await fetch("http://localhost:3001/api/get/pendingFriends", {
  //     method: "POST",
  //     mode: "cors",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       email: userEmail,
  //     }),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (!data) {
  //         setMessage(RETRIEVED_ERROR);
  //         setStatus(STATUS.ERROR);
  //       } else {
  //         setPendingFriends(data);
  //         console.log("data", data);
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       setMessage(CATCHED_ERROR);
  //       setStatus(STATUS.ERROR);
  //     });
  // };

  const handlePaymentChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const newPayment = parseInt(event.target.value);
    setPayment(newPayment);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    let isValid = true;
    event.preventDefault();
    // validations
    const isPaymentValid = validatePayment(payment);

    isValid = validateLength({
      target: description,
      fieldName: "Desicription",
      min: 1,
      max: 50,
      fieldError: setDescriptionError,
    });

    if (!isPaymentValid) {
      setPaymentError(PAYMENT_ERROR);
      isValid = false;
    } else {
      setPaymentError(EMPTY);
    }

    if (isValid) {
      const isRegisterSucceed = await createExpense();
      if (isRegisterSucceed) {
        handleInputReset();
      }
    }
  };

  // ----------------------------------------------------------------
  // create a group and members and save an expense to a collection
  // ----------------------------------------------------------------
  const createExpense = async (): Promise<boolean> => {
    const group: Group = {
      group_name: "",
      email: userEmail,
      members: selectedFriends,
      category_order: category,
      method_order: 1,
      process_status: 1,
      description: description,
      payment: payment,
      payer: payer,
    };

    try {
      const response = await fetch(
        "http://localhost:3001/api/register/expense",
        {
          method: "POST",
          mode: "cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(group),
        }
      );

      if (response.ok) {
        setMessage(REGISTER_SUCCESSFUL);
        setStatus(STATUS.SUCCESS);
        setTimeout(() => {
          navigate("/expense");
        }, 1000);
        return true;
      } else {
        setMessage(REGISTER_ERROR);
        setStatus(STATUS.ERROR);
        return false;
      }
    } catch (error) {
      console.error(error);
      setMessage(CATCHED_ERROR);
      setStatus(STATUS.ERROR);
      return false;
    }
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPayer(event.target.value);
  };

  const handleCategoriesChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCategory(parseInt(event.target.value));
  };

  const handleDescriptionChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setDescription(event.target.value);
  };

  // for a search modal
  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSelectedFriendsChange = (checkedFriends: Friends[]) => {
    setSelectedFriends(checkedFriends);
  };

  const handleInputReset = () => {
    setSelectedFriends([]);
    setDescription("");
    setPayer(userEmail);
    setPayment(0);
    setCalcPayment(0);
    setCategory(0);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (pendingFriendsError) {
    return <div>Error: {pendingFriendsError}</div>;
  }

  return (
    <>
      <Header />
      <MainContainer>
        <form onSubmit={handleSubmit} className="p-4">
          <div>
            <h3>Expense-sharing partners:</h3>
            <SearchButton onClick={handleModalOpen} />
          </div>
          <div>
            <h3>Categories:</h3>
            <select
              id="categories"
              className="bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1.5"
              onChange={handleCategoriesChange}
            >
              {categories?.map((category) => {
                return (
                  <option
                    key={category.category_order}
                    value={category.category_order}
                  >
                    {category.category_name}
                  </option>
                );
              })}
            </select>
          </div>
          <InputText
            id="description"
            title="Description:"
            name="description"
            value={description}
            onChange={handleDescriptionChange}
            type="text"
            autoComplete="off"
            placeholder="Had a dinner at a Japanese restuarant"
            error={descriptionError}
          />
          <InputText
            id="payment"
            title="Payment:"
            name="payment"
            value={isNaN(payment) ? "" : payment.toString()}
            onChange={handlePaymentChange}
            type="text"
            autoComplete="off"
            placeholder="100"
            error={paymentError}
          />
          <div>
            <h3>Payer:</h3>
            <select
              id="payers"
              className="bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1.5"
              onChange={handleSelectChange}
            >
              <option value={userEmail}>you</option>
              {selectedFriends.map((friend, index) => {
                return (
                  <option key={index} value={friend.email}>
                    {friend.email}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <h3>Divided expense:</h3>
            <h4>
              {calcPayment.toLocaleString()}/person (
              {selectedFriends.length + 1} people)
            </h4>
          </div>
          <Button
            name="SAVE"
            textColor="text-amber-50"
            bgColor="bg-amber-800"
            hoverColor="hover:bg-amber-700"
            focusColor="focus:bg-amber-800"
            onClick={() => navigate("/expense")}
            disabled={isDisabled}
          />
        </form>
        {isModalOpen && (
          <SearchModal
            onClose={handleModalClose}
            // friends={friends!}
            friends={[]}
            convertPendingFriends={convertPendingFriends}
            groups={groups}
            selectedFriends={selectedFriends}
            onSelectedFriendsChange={handleSelectedFriendsChange}
          />
        )}
        {status !== "" && <Snackbar type={status} message={message} />}
      </MainContainer>
    </>
  );
};
