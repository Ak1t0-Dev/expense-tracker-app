import { ObjectId } from "mongoose";
import { ReactNode } from "react";
import { PARTNER } from "../constants/constants";

export interface User {
  email: string;
}

export interface UserInfo {
  _id: string;
  email: string;
  name: string;
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

export interface MainContainerProps {
  children: ReactNode;
}

export interface SnackbarProps {
  type: "success" | "error" | "info";
  message: string;
}

export interface SeacrhProps {
  onClick: () => void;
}

export interface Categories {
  category_order: number;
  category_name: string;
}

export interface SearchModalProps {
  onClose: () => void;
  friends: Friends[];
  convertPendingFriends: Friends[];
  groups: Groups[];
  partner: string;
  onSelectedParnterChange: (partner: PARTNER) => void;
  selectedFriends: Friends[];
  onSelectedFriendsChange: (checkedFriends: Friends[]) => void;
  selectedGroup: Groups;
  onSelectedGroupChange: (checkedGroup: Groups) => void;
}

export interface HistoryModalProps {
  onClose: () => void;
  data: UserHistory | null;
}

export interface GroupModalProps {
  onClose: () => void;
  userEmail: string;
  fetchedGroupsData: (email: string) => Promise<boolean>;
}

export interface GroupDetailModalProps {
  onClose: () => void;
  userEmail: string;
  data: Groups | null;
}

export interface ExpenseGroup {
  group_name: string;
  email: string;
  members: Friends[];
}

// from accountModal
export interface ModalProps {
  onClose: () => void;
  user: {
    email: string;
    name: string;
  };
  currentEmail: string;
  fetchedUserData: (email: string) => void;
}

export interface InputTextProps {
  type: "email" | "password" | "confirmPassword" | "text";
  title: string;
  id: string;
  name: string;
  value: string;
  autoComplete: string;
  placeholder: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  error: string;
  confirmPasswordValue?: string;
}

export interface ButtonProps {
  name: string;
  textColor: string;
  bgColor: string;
  hoverColor: string;
  focusColor: string;
  onClick?: () => void;
  disabled?: boolean;
}

export interface UserInfo {
  name: string;
  email: string;
}

export interface Friends {
  _id: ObjectId;
  name: string;
  email: string;
}

export interface PendingFriends {
  _id: ObjectId;
  reciever: {
    reciever_id: ObjectId;
    reciever_email: string;
    reciever_name: string;
  };
  sender: ObjectId;
  status: string;
  registered_at: Date;
  updated_at: Date;
  name: string;
  email: string;
}

export interface Groups {
  uuid: string;
  _id: ObjectId | null;
  group_name: string;
  members: Friends[];
  registered_name: {
    email: string;
    name: string;
  };
  registered_at: Date;
  updated_name: {
    email: string;
    name: string;
  };
  updated_at: Date;
}

export interface Group {
  group_id: ObjectId | null;
  group_name: string;
  email: string; // to get user_id from a users collection
  members: Friends[]; // to get user_id from a users collection and to create group members
  method_order: number;
  process_status: number;
  category_order: number;
  description: string;
  payment: number;
  payer: string;
}
