import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/Header/Header";
import { InputText } from "../../components/InputText/InputText";
import { MainContainer } from "../../components/MainContainer/MainContainer";
import { validatePayment } from "../../utils/utils";
import { RxCross1 } from "react-icons/rx";
import Autosuggest from "react-autosuggest";
import "./Expense.css";

interface Friends {
  email: string;
}

export const Expense = () => {
  const [friends, setFriends] = useState<Friends[]>([]);
  // const [suggestedFriends, setSuggestedFriends] = useState<string[]>([]);
  const [addedFriends, setAddedFriends] = useState<string[]>([]);
  const [payment, setPayment] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [calcPayment, setCalcPayment] = useState(0);
  // use for autosuggest
  const [suggestionItem, setsuggestionItem] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const lowerCasedFriends = friends.map((friend) => friend.email.toLowerCase());

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3001/api/friend")
      .then((response) => response.json())
      .then((data) => {
        setFriends(data);
      });
  }, []);

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const getSuggestions = (value: string): string[] => {
    return lowerCasedFriends.filter((friend) =>
      friend.startsWith(value.trim().toLowerCase())
    );
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
    setPayment(value);
    const parsedValue = parseInt(value);
    if (!isNaN(parsedValue) && addedFriends.length > 0) {
      setCalcPayment(
        Math.floor((parsedValue / (addedFriends.length + 1)) * 100) / 100
      );
    } else {
      setCalcPayment(0);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    let isValid = true;
    event.preventDefault();
    // validations
    const isPaymentValid = validatePayment(payment);

    if (!isPaymentValid) {
      setPaymentError("Payment should be a number");
      isValid = false;
    } else {
      setPaymentError("");
    }

    if (isValid) {
      navigate("/login");
    }
  };

  return (
    <>
      <Header />
      <MainContainer>
        <form onSubmit={handleSubmit}>
          <div>
            <h3>Choose your expense-sharing partner:</h3>
            <Autosuggest
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
            <div className="h-28 px-2 flex row flex-start flex-wrap items-start overflow-auto gap-1">
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
            <h3>Discription:</h3>
          </div>
          <InputText
            id="payment"
            title="Payment:"
            name="payment"
            value={payment}
            onChange={calculatePayment}
            type="text"
            autoComplete="email"
            placeholder="100"
            error={paymentError}
          />
          <div>
            <h3>Payer:</h3>
            <select
              id="countries"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="YOU">you</option>
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
        </form>
      </MainContainer>
    </>
  );
};
