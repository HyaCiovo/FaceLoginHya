import toast from "solid-toast";
import { OSS_URL, USER_LIST } from "./configs/constant";
import AliOSS from "ali-oss";
import { user_db } from "./database/user";

export const formatImageUrl = (lib: string, name: string, suffix?: string) => {
  return `${OSS_URL}${lib}/${name}.${suffix || "jpg"}`;
};

export async function fileToBase64(file: any) {
  return new Promise((resolve, reject) => {
    // 创建一个新的 FileReader 对象
    const reader = new FileReader();
    // 读取 File 对象
    reader.readAsDataURL(file);
    // 加载完成后
    reader.onload = function () {
      // 将读取的数据转换为 base64 编码的字符串
      const base64String = (reader.result as string)?.split(",")[1];
      // 解析为 Promise 对象，并返回 base64 编码的字符串
      resolve(base64String);
    };

    // 加载失败时
    reader.onerror = function () {
      reject(new Error("Failed to load file"));
    };
  });
}

export const client = new AliOSS({
  // yourregion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
  region: "oss-cn-hangzhou",
  // 从环境变量中获取访问凭证
  // 当然，以下两个也可以直接写死
  accessKeyId: "xxxxxxxxxxxxxxxxx",
  accessKeySecret: "xxxxxxxxxxxxxxxxx",
  // 填写Bucket名称。
  bucket: "xxxxxxxxxxxxxx",
});

export const initdataBase = () => {
  toast.success("人脸库初始化");
  user_db.setNewList(USER_LIST);
};

export const isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)