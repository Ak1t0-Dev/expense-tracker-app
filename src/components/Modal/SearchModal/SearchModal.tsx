import { useEffect, useState } from "react";
import { Friends } from "../../../pages/Expense/Expense";
import { PARTNER } from "../../../constants/constants";
import { Groups } from "../../../pages/GroupsList/GroupsList";
import { Button } from "../../Button/Button";
import { RxCross1 } from "react-icons/rx";

interface ModalProps {
  onClose: () => void;
  friends: Friends[];
  groups: Groups[];
  selectedFriends: Friends[];
  onSelectedFriendsChange: (checkedFriends: Friends[]) => void;
}

export const SearchModal = ({
  onClose,
  friends,
  groups,
  selectedFriends,
  onSelectedFriendsChange,
}: ModalProps) => {
  const [filteredGroups, setFilteredGroups] = useState<Groups[]>(groups);
  const [filteredFriends, setFilteredFriends] = useState<Friends[]>(friends);
  const [checkedFriends, setCheckedFriends] =
    useState<Friends[]>(selectedFriends);
  const [partner, setPartner] = useState<PARTNER>(PARTNER.FRIENDS);
  const [searchValue, setSearchValue] = useState("");

  const isDisabled = checkedFriends.length === 0;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const switchPartner = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPartner(event.target.value as PARTNER);
  };

  // ----------------------------------------------------------------
  // Check friends to add or not
  // ----------------------------------------------------------------
  const handleCheckedChange = (
    email: string,
    name: string,
    isChecked: boolean
  ): void => {
    if (isChecked) {
      const addFriend: Friends = { email: email, name: name };
      const updateFriends = [...checkedFriends, addFriend];
      setCheckedFriends(updateFriends);
      onSelectedFriendsChange(updateFriends);
    } else {
      const deleteFriends = checkedFriends.filter(
        (friend) => friend.email !== email
      );
      setCheckedFriends(deleteFriends);
      onSelectedFriendsChange(deleteFriends);
    }
  };

  // when a user search from the frends list it will be executed
  useEffect(() => {
    const valueLowerCase = searchValue.toLowerCase();

    const filteredList = friends.filter((friend) => {
      const nameLowerCase = friend.name.toLowerCase();
      const emailLowerCase = friend.email.toLowerCase();
      return (
        nameLowerCase.startsWith(valueLowerCase) ||
        emailLowerCase.startsWith(valueLowerCase)
      );
    });
    setFilteredFriends(filteredList);
  }, [searchValue, friends]);

  // when a user search from the groups list it will be executed
  useEffect(() => {
    const valueLowerCase = searchValue.toLowerCase();

    const filteredList = groups.filter((group) => {
      const nameLowerCase = group.group_name.toLowerCase();
      return nameLowerCase.startsWith(valueLowerCase);
    });
    setFilteredGroups(filteredList);
  }, [searchValue, groups]);

  return (
    <>
      <div
        id="small-modal"
        className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] md:h-full flex items-center justify-center"
      >
        <div className="relative w-full h-full max-w-md md:h-auto">
          <form onSubmit={handleSubmit} className="p-4">
            <div className="relative bg-white rounded-lg shadow border-2 border-black">
              <div className="flex items-center justify-between px-5 pt-5 rounded-t">
                <div className="flex items-center">
                  <label htmlFor="simple-search" className="sr-only">
                    Search
                  </label>
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg
                        aria-hidden="true"
                        className="w-5 h-5 text-gray-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="simple-search"
                      className="bg-gray-50 border border-black text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 placeholder:text-gray-800"
                      placeholder="Search"
                      onChange={(e) => {
                        setSearchValue(e.target.value);
                      }}
                      required
                    />
                  </div>
                </div>

                <fieldset className="flex flex-row items-center">
                  <legend className="sr-only">Partners</legend>
                  <div className="flex flex-row items-center">
                    <input
                      id="partner-option-1"
                      type="radio"
                      name="partner"
                      value={PARTNER.FRIENDS}
                      className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring:blue-300 hidden peer/partner-option-1"
                      onChange={switchPartner}
                      checked={partner === PARTNER.FRIENDS}
                    />
                    <label
                      htmlFor="partner-option-1"
                      className="block border border-black bg-gray-500 text-white px-2 py-2.5 ml-2 text-sm font-medium rounded-md text-center w-20 peer-checked/partner-option-1:bg-blue-800 hover:cursor-pointer"
                    >
                      {PARTNER.FRIENDS}
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="partner-option-2"
                      type="radio"
                      name="partner"
                      value={PARTNER.GROUP}
                      className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring:blue-300 hidden peer/partner-option-2"
                      onChange={switchPartner}
                      checked={partner === PARTNER.GROUP}
                    />
                    <label
                      htmlFor="partner-option-2"
                      className="block border border-black bg-gray-500 text-white px-2 py-2.5 ml-2 text-sm font-medium rounded-md text-center w-20 peer-checked/partner-option-2:bg-blue-800 hover:cursor-pointer"
                    >
                      {PARTNER.GROUP}
                    </label>
                  </div>
                </fieldset>

                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                  data-modal-hide="small-modal"
                  onClick={onClose}
                >
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <ul className="flex flex-col p-6 border-gray-200 rounded-b overflow-auto h-80">
                {partner === PARTNER.FRIENDS
                  ? filteredFriends.map((friend, index) => (
                      <li key={index}>
                        <input
                          className="hidden peer"
                          type="checkbox"
                          name="friends"
                          value={friend.email}
                          id={index.toString()}
                          checked={
                            selectedFriends.find(
                              (selectedFriend) =>
                                selectedFriend.email === friend.email
                            )
                              ? true
                              : false
                          }
                          onChange={(event) =>
                            handleCheckedChange(
                              friend.email,
                              friend.name,
                              event.target.checked
                            )
                          }
                        />
                        <label
                          className="mb-2 font-medium bg-yellow-200 border-2 border-black px-4 py-2 flex flex-row justify-between cursor-pointer peer-checked:bg-blue-600"
                          htmlFor={index.toString()}
                          key={index}
                        >
                          <span className="inline-block">{friend.name}</span>
                          <span className="inline-block">{friend.email}</span>
                        </label>
                      </li>
                    ))
                  : filteredGroups.map((group, index) => (
                      <li
                        key={index}
                        className="mb-2 font-medium bg-white border-2 border-black px-4 py-2 flex flex-row justify-between cursor-pointer"
                      >
                        <span className="inline-block">{group.group_name}</span>
                      </li>
                    ))}
              </ul>
              <div className="h-12 px-2 flex row flex-start flex-wrap items-start overflow-auto gap-1">
                {checkedFriends.map((friend, index) => {
                  return (
                    <span
                      className="inline-block flex-none px-2 py-1 border border-gray-400 rounded-xl"
                      key={index}
                      // onClick={() => handleDeleteFriends(friend.email)}
                    >
                      {friend.name}
                      <RxCross1 className="ml-1 inline text-xs" />
                    </span>
                  );
                })}
              </div>
            </div>
            <Button
              name="ADD"
              textColor="text-amber-50"
              bgColor="bg-amber-800"
              hoverColor="hover:bg-amber-700"
              focusColor="focus:bg-amber-800"
              // onClick={() => navigate("/expense")}
              disabled={isDisabled}
            />
          </form>
        </div>
      </div>
    </>
  );
};
