import qs from "qs";
import BaiduStore from "../stores/baiduInfo";
import { BAIDU_CLIENT_ID, BAIDU_CLIENT_SECRET, BAIDU_FACE_GROUPID } from "@/configs/constant";

const { baiduInfo, setInfo } = BaiduStore;

export const fetchBaiduToken = async () => {
  const params = qs.stringify({
    grant_type: "client_credentials",
    client_id: BAIDU_CLIENT_ID,
    client_secret: BAIDU_CLIENT_SECRET,
  });

  const res = await (await fetch("/baiduapi/oauth/2.0/token?" + params)).json();
  setInfo(res);
};

export const distinctFace = async (image: string) => {
  if (!baiduInfo()?.access_token) return;
  const params = {
    image,
    image_type: "BASE64",
    group_id_list: BAIDU_FACE_GROUPID,
  };
  const res = await (
    await fetch(
      "/baiduapi/rest/2.0/face/v3/search?access_token=" +
        baiduInfo()?.access_token,
      {
        method: "POST",
        body: JSON.stringify(params),
      }
    )
  ).json();
  return res;
};

export const getUserList = async () => {
  if (!baiduInfo()?.access_token) return;
  const res = await (
    await fetch(
      "/baiduapi/rest/2.0/face/v3/faceset/group/getusers?access_token=" +
        baiduInfo()?.access_token,
      {
        method: "POST",
        body: JSON.stringify({
          group_id: BAIDU_FACE_GROUPID,
        }),
      }
    )
  ).json();

  return res.result.user_id_list;
};

export const getUserDetail = async (user_id: string) => {
  if (!baiduInfo()?.access_token) return;
  const res = await (
    await fetch(
      "/baiduapi/rest/2.0/face/v3/faceset/face/getlist?access_token=" +
        baiduInfo()?.access_token,
      {
        method: "POST",
        body: JSON.stringify({
          group_id: BAIDU_FACE_GROUPID,
          user_id,
        }),
      }
    )
  ).json();

  return res.result.face_list;
};

export const addUserFace = async (params: {
  user_id: string;
  user_info: string;
  image: string;
}) => {
  if (!baiduInfo()?.access_token) return;
  const data = {
    ...params,
    group_id: BAIDU_FACE_GROUPID,
    image_type: "BASE64",
  };
  const res = await (
    await fetch(
      "/baiduapi/rest/2.0/face/v3/faceset/user/add?access_token=" +
        baiduInfo()?.access_token,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    )
  ).json();

  return res;
};

export const deleteUser = async (user_id: string) => {
  if (!baiduInfo()?.access_token) return;
  const res = await (
    await fetch(
      "/baiduapi/rest/2.0/face/v3/faceset/user/delete?access_token=" +
        baiduInfo()?.access_token,
      {
        method: "POST",
        body: JSON.stringify({
          group_id: BAIDU_FACE_GROUPID,
          user_id,
        }),
      }
    )
  ).json();

  return res;
};
