import React from "react";
import { GroupDetailModalProps } from "../../../types/types";
import { Button } from "../../Button/Button";
import { formattedDate } from "../../../utils/utils";

export const GroupDetailModal = ({
  onClose,
  userEmail,
  data,
}: GroupDetailModalProps) => {
  // to disable a button
  //   const isDisabled = groupName.trim() === "" || addedFriends.length === 0;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // let isValid = true;
    event.preventDefault();
    // validations
    // isValid = validateLength({
    //   target: groupName,
    //   fieldName: "User name",
    //   min: 1,
    //   max: 30,
    //   fieldError: setGroupNameError,
    // });

    // if (isValid) {
    //   const isGroupRegistered = await createGroup();
    //   if (isGroupRegistered) {
    //     setTimeout(() => {
    //       handleInputReset();
    //       onClose();
    //       fetchedGroupsData(userEmail);
    //     }, 1000);
    //   }
    // }
  };

  if (!data) {
    return null;
  }

  return (
    <div
      id="small-modal"
      className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] md:h-full flex items-center justify-center"
    >
      <div className="relative w-full h-full max-w-md md:h-auto">
        <div className={`border-2 relative bg-white rounded-lg shadow`}>
          <div className={`border-b-2`}>
            <div className="flex items-center justify-between px-5 pt-5 rounded-t">
              <h3 className="text-xl font-medium text-black">
                {data.group_name}
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
            <h5 className="text-sm px-5 py-1">
              <div>
                <span className="pr-3">
                  {formattedDate(data.registered_at, "time")}
                </span>
                <span className="pr-0.5">
                  created by{" "}
                  {userEmail === data.registered_name.email
                    ? "you"
                    : data.registered_name.email}
                </span>
              </div>
              <div>
                <span className="pr-3">
                  {formattedDate(data.updated_at, "time")}
                </span>
                <span className="pr-0.5">
                  updated by{" "}
                  {userEmail === data.updated_name.email
                    ? "you"
                    : data.updated_name.email}
                </span>
              </div>
            </h5>
          </div>
          <div className="p-6 space-y-6">
            <div className="text-base">
              <div className="">
                <h6 className="mb-2">MEMBERS:</h6>
                {data.members.map((member, index) => {
                  return (
                    <span
                      className="p-1 mr-1.5 border border-black rounded-xl"
                      key={index}
                    >
                      {member.name}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex items-center p-6 space-x-2 border-gray-200 rounded-b"></div>
        </div>
      </div>
    </div>
  );
};
