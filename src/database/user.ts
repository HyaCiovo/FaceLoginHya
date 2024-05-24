import { UserInfo } from "@/types/user";
import { createRoot } from "solid-js";
import { useStorage } from "solidjs-use";

export const user_db = createRoot(() => {
  const [user_list, setList] = useStorage<Obj<UserInfo>>(
    "user_list",
    {},
    localStorage
  );

  const setNewList = (new_list: Obj<UserInfo>) => {
    localStorage.setItem("user_list", JSON.stringify(new_list));
    setList(new_list);
  };

  const deleteUser = (id: string) => {
    let new_list = user_list();
    new_list = Object.fromEntries(
      Object.entries(new_list).filter(([key]) => key !== id)
    );
    setNewList(new_list);
  };

  const addNewUser = (newuser: UserInfo) => {
    setNewList({ [newuser.id]: newuser, ...user_list() });
  };

  return {
    user_list,
    setNewList,
    deleteUser,
    addNewUser,
  };
});
