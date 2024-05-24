import { UserInfo } from "@/types/user";
import { createRoot } from "solid-js";
import { useStorage } from "solidjs-use";

const UserStore = createRoot(() => {
  const [current_user, setUser] = useStorage<UserInfo>(
    "current_user",
    {} as UserInfo,
    localStorage
  );

  const setUserInfo = (userInfo: UserInfo) => {
    localStorage.setItem("current_user", JSON.stringify(userInfo))
    setUser(userInfo);
  }

  const removeUserInfo = () => {
    localStorage.removeItem("current_user");
    setUser({} as UserInfo);
  }

  return {
    current_user,
    setUserInfo,
    removeUserInfo
  }
})

export default UserStore
