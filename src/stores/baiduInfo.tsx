import { createRoot, createSignal } from "solid-js";

type BaiDuToken = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  session_key: string;
};
const BaiduStore = () => {
  const [baiduInfo, setInfo] = createSignal<BaiDuToken>();

  const removeBaiduInfo = () => {
    setInfo();
  }

  return {
    baiduInfo,
    setInfo,
    removeBaiduInfo
  }
}

export default createRoot(BaiduStore);
