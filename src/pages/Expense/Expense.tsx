import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/Header/Header";
import { InputText } from "../../components/InputText/InputText";
import { MainContainer } from "../../components/MainContainer/MainContainer";
import {
  validatePayment,
  isStringExist,
  calculateExpense,
} from "../../utils/utils";
import { AutoSuggest } from "../../components/AutoSugggest/AutoSuggest";
import { Button } from "../../components/Button/Button";
import { Snackbar } from "../../components/Snackbar/Snackbar";
import {
  EMPTY,
  PAYMENT_ERROR,
  DESCRIPTION_ERROR,
  CATCHED_ERROR,
  REGISTER_SUCCESSFUL,
  REGISTER_ERROR,
} from "../../constants/message";
import { STATUS } from "../../constants/constants";
import "./Expense.css";
import AuthContext from "../../contexts/AuthContext";

// ----------------------------------------------------------------
// interfaces
// ----------------------------------------------------------------
export interface Friends {
  email: string;
}

interface Categories {
  category_order: number;
  category_name: string;
}

interface Group {
  group_name: string;
  email: string; // to get user_id from a users collection
  members: string[]; // to get user_id from a users collection and to create group members
  method_order: number;
  process_status: number;
  category_order: number;
  description: string;
  payment: number;
  payer: string;
}

export const Expense = () => {
  // for assigning a user email from the local storage
  const userEmail = localStorage.getItem("expense-tracker") || "";

  const [friends, setFriends] = useState<Friends[]>([]);
  const [addedFriends, setAddedFriends] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [payer, setPayer] = useState(userEmail);
  const [payment, setPayment] = useState(0);
  const [paymentError, setPaymentError] = useState("");
  const [calcPayment, setCalcPayment] = useState(0);
  const [categories, setCategories] = useState<Categories[]>([]);
  const [category, setCategory] = useState(0);
  const [status, setStatus] = useState<STATUS>(STATUS.EMPTY);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const isDisabled =
    addedFriends.length === 0 ||
    description.trim() === "" ||
    payment === 0 ||
    isNaN(payment);

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

  useEffect(() => {
    fetch("http://localhost:3001/api/get/categories")
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
        setCategory(data[0].category_order);
      });
  }, []);

  useEffect(() => {
    setCalcPayment(calculateExpense(payment, addedFriends.length));
  }, [payment, addedFriends]);

  const calculatePayment = (value: string) => {
    const newPayment = parseInt(value);
    setPayment(newPayment);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    let isValid = true;
    event.preventDefault();
    // validations
    const isPaymentValid = validatePayment(payment);
    const isDescriptionValid = isStringExist(description);

    if (!isPaymentValid) {
      setPaymentError(PAYMENT_ERROR);
      isValid = false;
    } else {
      setPaymentError(EMPTY);
    }

    if (!isDescriptionValid) {
      setDescriptionError(DESCRIPTION_ERROR);
      isValid = false;
    } else {
      setDescriptionError(EMPTY);
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
      members: addedFriends,
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

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
  };

  // for AutoSuggest
  const handleGetFriends = (value: string) => {
    setAddedFriends([...addedFriends, value]);
    return value;
  };
  // for AutoSuggest
  const handleDeleteFriends = (value: string) => {
    const index = addedFriends.indexOf(value);
    if (index > -1) {
      const newAddedFriends = [...addedFriends];
      newAddedFriends.splice(index, 1);
      setAddedFriends(newAddedFriends);
    }
  };

  const handleInputReset = () => {
    setAddedFriends([]);
    setDescription("");
    setPayer(userEmail);
    setPayment(0);
    setCalcPayment(0);
    setCategory(0);
  };

  return (
    <>
      <Header />
      <MainContainer>
        <form onSubmit={handleSubmit} className="p-4">
          <AutoSuggest
            friends={friends}
            addedFriends={addedFriends}
            handleGetFriends={handleGetFriends}
            handleDeleteFriends={handleDeleteFriends}
          />
          <div>
            <h3>Categories:</h3>
            <select
              id="categories"
              className="bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1.5"
              onChange={handleCategoriesChange}
            >
              {categories.map((category) => {
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
            onChange={calculatePayment}
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
              {addedFriends.map((friend, index) => {
                return (
                  <option key={index} value={friend}>
                    {friend}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <h3>Divided expense:</h3>
            <h4>
              {calcPayment.toLocaleString()}/person ({addedFriends.length + 1}{" "}
              people)
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
        {status !== "" ? <Snackbar type={status} message={message} /> : null}
      </MainContainer>
    </>
  );
};
