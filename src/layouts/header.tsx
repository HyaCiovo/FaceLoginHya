import { DEFAULT_AVATAR, TITLE } from "@/configs/constant";
import { routes } from "@/configs/routes";
import { user_db } from "@/database/user";
import UserStore from "@/stores/userInfo";
import { formatImageUrl, initdataBase, isMobile } from "@/utils";
import { useNavigate } from "@solidjs/router";
import { createSignal, For, Show } from "solid-js";
import toast from "solid-toast";

const Header = () => {
  const [show, setShow] = createSignal(false)
  const navigate = useNavigate()

  const logout = () => {
    toast.loading("退出登录中...")
    setTimeout(() => {
      UserStore.removeUserInfo()
      toast.dismiss()
      toast.success("退出成功")
      navigate('/login', { replace: true })
    }, 1000)
  }

  const FilterRoutes = ["404", "Login", isMobile ? "FaceManage" : ""]

  return <div class="navbar bg-primary z-50 px-4" style="backdrop-filter:blur(2px)">
    <div class="navbar-start">
      <div class="dropdown" onClick={() => setShow(true)}>
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
        </div>
        <Show when={show()}>
          <ul
            tabindex="0"
            class="menu menu-sm dropdown-content mt-3 z-[100] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <For each={routes.filter((route) => !FilterRoutes.includes(route.name))}>
              {(route) => (
                <li onClick={() => setShow(false)}>
                  <a href={route.path}>{route.title}</a>
                </li>
              )}
            </For>
          </ul>
        </Show>
      </div>
    </div>
    <div class="navbar-center">
      <a class="text-xl text-white">{TITLE}</a>
    </div>
    <div class="navbar-end">
      <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
          <div class="w-10 rounded-full">
            <img alt="Avatar"
              src={formatImageUrl("baidu-face-list", user_db.user_list()[UserStore.current_user().id]?.faceToken) || DEFAULT_AVATAR} />
          </div>
        </div>
        <ul tabindex="0" class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
          <li>
            <a onClick={() => {
              toast.error("功能暂未开放");
            }} class="justify-between">
              消息
              <span class="badge">New</span>
            </a>
          </li>
          <li><a onClick={() => {
            toast.error("功能暂未开放");
          }}
            onDblClick={initdataBase}>设置</a></li>
          <li><a onClick={logout}>退出登录</a></li>
        </ul>
      </div>
    </div>
  </div>
}

export default Header;