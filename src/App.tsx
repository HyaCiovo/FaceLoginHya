import {
  onMount,
  Show,
  type Component,
} from "solid-js";
import { routes } from "./configs/routes";
import UserStore from "./stores/userInfo";
import toast, { Toaster } from "solid-toast";
import { fetchBaiduToken } from "./apis/baidu";
import { TITLE } from "./configs/constant";
import Header from "./layouts/header";
import { useLocation, useNavigate } from "@solidjs/router";

const App: Component = (props: any) => {
  const location = useLocation()
  const navigate = useNavigate()
  const userInfo = UserStore.current_user()
  const isLogin = location.pathname === '/login'

  const checkInfo = () => {
    if (!userInfo.id) {
      toast('请先登录', {
        duration: 1500,
        icon: '👋',
        position: 'top-center'
      })
      if (!isLogin)
        navigate(`/login?from=${location.pathname}`, { replace: true })
    }
    else {
      toast('欢迎回来', {
        duration: 1500,
        icon: '👋',
        position: 'top-center'
      })
      if (isLogin)
        navigate('/', { replace: true })
    }
  }

  onMount(async () => {
    document.title = TITLE;
    fetchBaiduToken();
    checkInfo();
  });

  return (
    <>
      <Toaster position="top-center" />
      <Show when={routes.find((i) => i.path === location.pathname)?.showNav}>
        <Header />
      </Show>
      {props.children}
    </>
  );
};

export default App;
