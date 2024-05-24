import { UserInfo } from "@/types/user";

export const OSS_URL = "https://xxxxxx.oss-cn-hangzhou.aliyuncs.com/"; //阿里云oss url

export const TITLE = "人脸识别Demo";

export const BAIDU_CLIENT_ID = ""; //百度智能云应用id

export const BAIDU_CLIENT_SECRET = ""; //百度智能云应用secret

export const BAIDU_FACE_GROUPID = ""; //人脸库组id

export const DEFAULT_AVATAR =
  "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg";

// export const LIVE_FLV_URL = "http://localhost:8000/live/test/flv";

// export const MJPG_STREAMER_STREAM_URL = "http://localhost:8080/?action=stream";

// 默认用户数据库
export const USER_LIST: Obj<UserInfo> = {
  991553708: {
    id: "991553708",
    nickname: "张三",
    faceToken: "e0e9787df152d70a225315dca7340c3f",
    createdAt: "2024-05-11 20:59:10",
    password: "666666",
  },
  626483608: {
    id: "626483608",
    nickname: "李四",
    faceToken: "88b048ffbb087c29ea48f6990a2e5a6c",
    createdAt: "2024-05-11 20:42:32",
    password: "666666",
  },
};
