import { user_db } from "@/database/user";
import { createSignal, splitProps } from "solid-js";
import toast from "solid-toast";
import UserStore from "@/stores/userInfo"

const AccountLogin = (props: { onSuccess: () => void }) => {
  const [local, others] = splitProps(props, ["onSuccess"])

  const [account, setAccount] = createSignal('991553708')
  const [password, setPassword] = createSignal('')
  const [checked, setChecked] = createSignal(false)

  const NotYet = () => {
    toast.error("功能暂未开放")
  }

  const logIn = () => {
    console.log(user_db.user_list()['991553708'])
    if (!checked())
      return toast.error('请勾选协议')
    if (!account() || !password())
      return toast.error('请输入账号和密码')

    toast.loading('正在登录...')
    setTimeout(() => {
      toast.dismiss()
      if (user_db.user_list()[account()] && user_db.user_list()[account()].password === password()) {
        toast.success('登录成功')
        UserStore.setUserInfo(user_db.user_list()[account()])
        local.onSuccess()
      }
      else
        toast.error('登录失败，请检查账号和密码是否正确')
    }, 1000)
  }

  return <>
    <label class="input input-bordered flex items-center gap-2 mt-6">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70">
        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
      </svg>
      <input type="text" class="grow" placeholder="账号" value={account()} onInput={(e) => { setAccount(e.target.value) }} />
    </label>
    <label class="input input-bordered flex items-center gap-2 mt-4">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70">
        <path fill-rule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clip-rule="evenodd" />
      </svg>
      <input type="password" class="grow" placeholder='密码' onInput={(e) => { setPassword(e.target.value) }} />
    </label>
    <label class="cursor-pointer flex items-center mt-2">
      <input type="checkbox" class="checkbox h-[12px] w-[12px]" style={{ "--chkbg": "#006AE8" }} checked={checked()} onInput={(e) => setChecked(e.target.checked)} />
      <span class="ml-2 text-xs text-label">已阅读并同意<a onClick={NotYet}>
        用户协议</a>和<a onClick={NotYet}>平台隐私政策</a></span>
    </label>

    <button class="btn btn-primary text-white w-full h-2 mt-10" onClick={logIn}>立即登录</button>
    <div class="flex justify-end text-xs mt-8 text-label">
      <div class="mr-4 cursor-pointer" onClick={NotYet}>忘记密码</div>
      <div class="text-primary cursor-pointer" onClick={NotYet}>立即注册</div>
    </div>
  </>
}

export default AccountLogin