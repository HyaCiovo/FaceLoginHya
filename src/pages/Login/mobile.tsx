import { Component, Index, Match, Switch, createSignal } from 'solid-js';
import { useNavigate, useSearchParams } from "@solidjs/router";
import AccountLogin from '@/components/Login/account';
import Face from '@/components/Login/face';
import { TITLE } from '@/configs/constant';
import { formatImageUrl, initdataBase } from '@/utils';
import UserStore from "@/stores/userInfo";

const tabs = [
  {
    name: "账号登录",
  },
  {
    name: "人脸登录",
  }
]

const Login: Component = () => {
  const [tab, setTab] = createSignal<number>(0)
  const navigate = useNavigate()

  const userInfo = UserStore.current_user()
  const [searchParams] = useSearchParams()

  if (userInfo?.id) {
    navigate('/', { replace: true })
    return
  }

  const onSuccess = () => {
    navigate(searchParams.from || '/', { replace: true })
  }

  return (
    <div class="h-screen w-full overflow-hidden px-4 pt-[140px] bg-contentBg"
      style={{
        //此处背景图已无效，可自行替换
        "background-image": `url(${formatImageUrl("public", "login-bg", "webp")})`,
        "background-size": "100% 60%",
        "background-repeat": "no-repeat",
        "background-position": "top"
      }}
    >
      <p class="text-primary font-bold" onDblClick={initdataBase}>你好！欢迎来到{TITLE}</p>
      <div class="text-gray flex mt-4">
        <Index each={tabs}>
          {(item: any, index: number) => <div
            onClick={() => setTab(index)}
            class={`${tab() === index && "text-primary border-b-[2px] border-b-primary"} h-8 mr-4 cursor-pointer`}>{item().name}</div>}
        </Index>
      </div>

      <div class="mt-4">
        <Switch fallback={<>loading...</>}>
          <Match when={tab() === 0}>
            <AccountLogin onSuccess={onSuccess} />
          </Match>
          <Match when={tab() === 1}>
            <Face onSuccess={onSuccess} />
          </Match>
        </Switch>
      </div>
    </div >
  );
}
export default Login;