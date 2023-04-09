import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/Header/Header";
import { InputText } from "../../components/InputText/InputText";
import { MainContainer } from "../../components/MainContainer/MainContainer";
import { validatePayment, isStringExist } from "../../utils/utils";
import { AutoSuggest } from "../../components/AutoSugggest/AutoSuggest";
import { Button } from "../../components/Button/Button";
import "./Expense.css";

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

  const navigate = useNavigate();

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

  // for caluculation
  useEffect(() => {
    if (!isNaN(payment) && addedFriends.length > 0) {
      setCalcPayment(
        Math.floor((payment / (addedFriends.length + 1)) * 100) / 100
      );
    } else {
      setCalcPayment(0);
    }
  }, [payment, addedFriends]);

  const calculatePayment = (value: string) => {
    const newPayment = parseInt(value);
    setPayment(newPayment);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    let isValid = true;
    event.preventDefault();
    // validations
    const isPaymentValid = validatePayment(payment);
    const isDescriptionValid = isStringExist(description);

    if (!isPaymentValid) {
      setPaymentError("Payment should be a number");
      isValid = false;
    } else {
      setPaymentError("");
    }

    if (!isDescriptionValid) {
      setDescriptionError("Description should be one or more characters");
      isValid = false;
    } else {
      setDescriptionError("");
    }

    if (isValid) {
      createExpense();
      navigate("/expense");
    }
  };

  // ----------------------------------------------------------------
  // create a group and members and save an expense to a collection
  // ----------------------------------------------------------------
  const createExpense = async () => {
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
        alert("Registration successful");
      } else {
        alert("Registration failed");
      }
    } catch (err) {
      console.error(err);
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

  const handleGetFriends = (value: string) => {
    setAddedFriends([...addedFriends, value]);
    return value;
  };

  const handleDeleteFriends = (value: string) => {
    const index = addedFriends.indexOf(value);
    if (index > -1) {
      const newAddedFriends = [...addedFriends];
      newAddedFriends.splice(index, 1);
      setAddedFriends(newAddedFriends);
    }
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
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
              {calcPayment}/person ({addedFriends.length + 1} people)
            </h4>
          </div>
          <Button
            name="SAVE"
            textColor="text-amber-50"
            bgColor="bg-amber-800"
            hoverColor="hover:bg-amber-700"
            focusColor="focus:bg-amber-800"
            onClick={() => navigate("/expense")}
          />
        </form>
      </MainContainer>
    </>
  );
};
