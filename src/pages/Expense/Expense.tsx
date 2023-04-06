import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/Header/Header";
import { InputText } from "../../components/InputText/InputText";
import { MainContainer } from "../../components/MainContainer/MainContainer";
import { validatePayment, validateDescription } from "../../utils/utils";
import { RxCross1 } from "react-icons/rx";
import Autosuggest from "react-autosuggest";
import "./Expense.css";
import { Button } from "../../components/Button/Button";

// ----------------------------------------------------------------
// interfaces
// ----------------------------------------------------------------
interface Friends {
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
  // use for autosuggest
  const [suggestionItem, setsuggestionItem] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3001/api/friends")
      .then((response) => response.json())
      .then((data) => {
        setFriends(data);
      });
  }, []);

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

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const getSuggestions = (value: string): string[] => {
    // change Friends[] to string[]
    const changeTypeFriends = friends.map((friend) => friend.email);

    return changeTypeFriends.filter((friend) => {
      const lowerCasedFriend = friend.toLowerCase();
      return lowerCasedFriend.startsWith(value.trim().toLowerCase());
    });
  };

  const renderSuggestion = (suggestion: string) => {
    return <span>{suggestion}</span>;
  };

  const getSuggestionValue = (suggestion: string) => {
    setAddedFriends([...addedFriends, suggestion]);
    return suggestion;
  };

  const deleteFriends = (value: string) => {
    const index = addedFriends.indexOf(value);
    if (index > -1) {
      const newAddedFriends = [...addedFriends];
      newAddedFriends.splice(index, 1);
      setAddedFriends(newAddedFriends);
    }
  };

  const calculatePayment = (value: string) => {
    const newPayment = parseInt(value);
    setPayment(newPayment);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    let isValid = true;
    event.preventDefault();
    // validations
    const isPaymentValid = validatePayment(payment);
    const isDescriptionValid = validateDescription(description);

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
      createGroup();
      // saveUserExpense();
      navigate("/expense");
    }
  };

  // ----------------------------------------------------------------
  // create a group and members and save an expense to a collection
  // ----------------------------------------------------------------
  const createGroup = async () => {
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
      const response = await fetch("http://localhost:3001/api/register/group", {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(group),
      });

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

  return (
    <>
      <Header />
      <MainContainer>
        <form onSubmit={handleSubmit} className="p-4">
          <div>
            <h3>Choose your expense-sharing partner:</h3>
            <Autosuggest // ■ 古いため、エラー
              suggestions={suggestions}
              alwaysRenderSuggestions
              onSuggestionsClearRequested={onSuggestionsClearRequested}
              onSuggestionsFetchRequested={({ value }) => {
                setsuggestionItem(value);
                setSuggestions(getSuggestions(value));
              }}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              inputProps={{
                placeholder: "Type Email address",
                value: suggestionItem,
                onChange: (_, { newValue }) => {
                  setsuggestionItem(newValue);
                },
              }}
              highlightFirstSuggestion={true}
            />
            {/* <div className="h-28 px-2 flex row flex-start flex-wrap items-start overflow-auto gap-1"> */}
            <div className="h-10 px-2 flex row flex-start flex-wrap items-start overflow-auto gap-1">
              {addedFriends.map((friend, index) => {
                return (
                  <span
                    className="inline-block flex-none px-2 py-1 border border-gray-400 rounded-xl"
                    key={index}
                    onClick={() => deleteFriends(friend)}
                  >
                    {friend}
                    <RxCross1 className="ml-1 inline text-xs" />
                  </span>
                );
              })}
            </div>
          </div>
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
