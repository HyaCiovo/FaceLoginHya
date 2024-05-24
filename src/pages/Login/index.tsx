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
    <div class="h-screen w-screen overflow-hidden px-4 py-5 flex items-center justify-center sin-backgroundImage" style={{
      'background-image': `url(${'src/assets/images/home-bg.jpg'})`,
    }} >
      <div class="card glass card-side bg-base-100 shadow-xl w-[800px] h-[520px] overflow-hidden">
        <div class="w-[360px] h-full"
          style={{
            //此处背景图已无效，可自行替换
            "background-image": `url(${formatImageUrl("public", "dataTransaction")})`,
            "background-size": "2400px 100%",
            "background-repeat": "no-repeat",
            "background-position": "-1400px 0",
          }}
        >
          <div class="bg-[#FFF6] text-[28px] font-bold p-4 mr-16 mt-20 text-primary rounded-sm"
            style="backdrop-filter:blur(2px)" onDblClick={initdataBase}
          >
            <p class="">你好！</p>
            <p class="">欢迎来到</p>
            <p class="">{TITLE}</p>
          </div>
        </div>
        <div class="card-body pt-[15px]">
          <div class="text-gray flex mt-4">
            <Index each={tabs}>
              {(item: any, index: number) => <div
                onClick={() => setTab(index)}
                class={`${tab() === index && "text-primary border-b-[2px] border-b-primary"} h-8 mr-4 cursor-pointer`}>{item().name}</div>}
            </Index>
          </div>
          <Switch fallback={<>loading...</>}>
            <Match when={tab() === 0}>
              <div class="mt-8">
                <AccountLogin onSuccess={onSuccess} />
              </div>
            </Match>
            <Match when={tab() === 1}>
              <div class="mt-4">
                <Face onSuccess={onSuccess} />
              </div>
            </Match>
          </Switch>
        </div>
      </div>
    </div >
  );
}
export default Login;