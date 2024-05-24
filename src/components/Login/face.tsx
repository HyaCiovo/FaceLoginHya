import { createSignal, onCleanup, Show, splitProps } from "solid-js"
import toast from "solid-toast";
import "./index.less"
import { distinctFace } from "@/apis/baidu";
import { user_db } from "@/database/user";
import UserStore from "@/stores/userInfo"

const Face = (props: { onSuccess: () => void }) => {
  const [local, others] = splitProps(props, ["onSuccess"])

  const WIDTH = window.screen.width / 375 * 266;
  let URL, tracker, streamIns: any, canvas: HTMLCanvasElement, trackertask: any,
    context: CanvasRenderingContext2D | null, removePhoto: NodeJS.Timeout, video: HTMLVideoElement | null
  const [flag, setFlag] = createSignal(false)// 判断是否已经拍照
  const [tipFlag, setTipFlag] = createSignal(false)// 提示用户已经检测到
  const [loading, setLoading] = createSignal(false)
  const [imgUrl, setURL] = createSignal<string>("")
  const [scanTip, setTip] = createSignal<string>("请点击下方按钮开始识别")
  const [result, setResult] = createSignal<string>("NULL")
  const [checked, setChecked] = createSignal(false)


  const fetchMsg = async (image: string) => {
    const msg = await distinctFace(image)
    setLoading(false)
    if (msg.error_code != 0)
      return toast.error(msg.error_msg)
    if (msg.result.user_list[0].score <= 75)
      return toast.error("人脸识别失败，请重新识别")
    const id = msg.result.user_list[0].user_id
    if (!user_db.user_list()[id])
      return toast.error("未找到用户信息，请联系管理员添加")
    toast.success('欢迎回来，' + user_db.user_list()[msg.result.user_list[0].user_id].nickname)
    setResult(user_db.user_list()[msg.result.user_list[0].user_id].nickname)
    UserStore.setUserInfo(user_db.user_list()[msg.result.user_list[0].user_id])
    local.onSuccess()
  }

  // 成功回调
  const handleSuccess = (stream: any) => {
    streamIns = stream
    // webkit内核浏览器
    URL = window.URL || window.webkitURL
    video = document.getElementById("video") as HTMLVideoElement;
    if ('srcObject' in video)
      video.srcObject = stream
    else
      (video as HTMLVideoElement).src = URL.createObjectURL(stream);

    // 苹果手机的系统弹框会阻止js的线程的继续执行 手动0.1秒之后自动执行代码
    setTimeout(() => {
      video?.play()
      initTracker() // 人脸捕捉
    }, 100)
  };


  const close = () => {
    setFlag(false)
    setTipFlag(false)
    context = null;
    setTip("识别结束");
    clearTimeout(removePhoto);
    if (streamIns) {
      streamIns.enabled = false;
      streamIns.getTracks()[0].stop();
      streamIns.getVideoTracks()[0].stop();
    }
    streamIns = null;
    trackertask?.stop();
    tracker = null;
  };

  const initTracker = () => {
    setTip("人脸识别中...")
    tracker = new window.tracking.ObjectTracker("face")
    canvas = document.getElementById("refCanvas") as HTMLCanvasElement;
    context = canvas.getContext("2d") as CanvasRenderingContext2D
    tracker.setInitialScale(4);
    tracker.setStepSize(2); // 设置步长
    tracker.setEdgesDensity(0.1);
    try {
      // 开始追踪
      trackertask = window.tracking.track("#video", tracker)
    } catch (e) {
      setTip("访问用户媒体失败，请重试")
      toast.error("访问用户媒体失败，请重试")
    }
    //开始捕捉方法 一直不停的检测人脸直到检测到人脸
    tracker.on("track", (e: any) => {
      //画布描绘之前清空画布
      context?.clearRect(0, 0, canvas?.width, canvas?.height);
      if (e.data.length === 0) {
        if (flag())
          setTip("未检测到人脸")
      } else {
        e.data.forEach((rect: any) => {
          if (!context)
            return;
          //设置canvas 方框的颜色大小
          context.strokeStyle = "#42e365";
          context.strokeRect(rect.x, rect.y, rect.width, rect.height);
        });
        if (!tipFlag()) {
          setTip("检测成功，正在拍照，请保持不动1.5s")
        }
        // 0.8秒后拍照，仅拍一次 给用户一个准备时间
        // flag 限制一直捕捉人脸，只要拍照之后就停止检测
        if (!flag()) {
          removePhoto = setTimeout(() => {
            // console.log(context)
            video?.pause();
            takePhoto();
            setTipFlag(true)
            setFlag(true)
          }, 800)
        }
      }
    });
  };

  // 拍照
  const takePhoto = () => {
    if (!context)
      return;
    // 在画布上面绘制拍到的照片
    context.drawImage(
      document.getElementById("video") as CanvasImageSource,
      0,
      0,
      WIDTH,
      WIDTH
    );
    let image = saveAsPNG(document.getElementById("refCanvas"))
    //判断图片大小
    image = imgSize(image);
    // console.log(image)
    // 保存为base64格式
    setURL(image)
    // console.log("data.imgUrl", data().imgUrl);


    // 百度人脸识别API要求图片不需要包括头部信息，仅base64编码即可
    image = image.replace("data:image/png;base64,", "");
    fetchMsg(image)

    close();
  };

  const imgSize = (image: any) => {
    if (image) {
      // 获取base64图片byte大小
      const equalIndex = image.indexOf("="); // 获取=号下标
      let size;
      if (equalIndex > 0) {
        const str = image.substring(0, equalIndex); // 去除=号
        const strLength = str.length;
        const fileLength = strLength - (strLength / 8) * 2; // 真实的图片byte大小
        size = Math.floor(fileLength / 1024); // 向下取整
        console.log("size", size + "KB");
      } else {
        const strLength = image.length;
        const fileLength = strLength - (strLength / 8) * 2;
        size = Math.floor(fileLength / 1024); // 向下取整
        console.log("size", size + "KB");
      }
      if (size > 1024) {
        // 图片超过1M 按比例压缩
        image = (document as any)
          .getElementById("refCanvas")
          .toDataURL("image/png", 1024 / size)
      }
    }
    return image
  };

  // 保存为png,base64格式图片
  const saveAsPNG = (c: any) => {
    return c.toDataURL("image/png", 0.8);
  };

  // 失败回调
  const handleError = (err: any) => {
    console.log(err)
    setTip("访问用户媒体失败");
    toast.error("访问用户媒体失败")
    close()
  };

  const getUserMedia = (constrains: any) => {
    if (navigator.mediaDevices.getUserMedia) {
      //最新标准API
      navigator.mediaDevices
        .getUserMedia(constrains)
        .then((res) => {
          handleSuccess(res);
        })
        .catch((err) => {
          handleError(err);
        });
    } else if ((navigator as any).webkitGetUserMedia) {
      //webkit内核浏览器
      (navigator as any)
        .webkitGetUserMedia(constrains)
        .then((res: any) => {
          handleSuccess(res);
        })
        .catch((err: any) => {
          handleError(err);
        });
    } else if ((navigator as any).mozGetUserMedia) {
      //Firefox浏览器
      (navigator as any)
        .mozGetUserMedia(constrains)
        .then((res: any) => {
          handleSuccess(res);
        })
        .catch((err: any) => {
          handleError(err);
        });
    } else if ((navigator as any).getUserMedia) {
      //旧版API
      (navigator as any)
        .getUserMedia(constrains)
        .then((res: any) => {
          handleSuccess(res);
        })
        .catch((err: any) => {
          handleError(err);
        });
    } else {
      toast.error("你的浏览器不支持访问用户媒体设备");
    }
  };

  const playVideo = () => {
    if (!checked())
      return toast.error("请勾选协议")
    setLoading(true)
    setFlag(false);
    setTipFlag(false)
    getUserMedia({
      audio: false,
      //摄像头拍摄的区域
      video: {
        width: 500,
        height: 500,
        facingMode: "user",
      } /* 前置优先 */,
    });
  };

  onCleanup(() => {
    close();
  })

  const NotYet = () => {
    toast.error("功能暂未开放")
  }

  return (
    <div class="flex flex-col items-center">
      <div class="face-capture" id="face-capture">
        <p class="text-primary">请保持人像在取景框内</p>
        <div class="skeleton mt-4 w-[240px] h-[240px] rounded-full shrink-0 relative">
          <video id="video" width={WIDTH} height={WIDTH} playsinline webkit-playsinline />
          <canvas id="refCanvas" width={WIDTH} height={WIDTH} />
        </div>
      </div>
      <p class="mt-4 text-[14px] text-[#333]">{scanTip()}</p>
      <label class="cursor-pointer flex items-center mt-2 mb-4">
        <input type="checkbox" class="checkbox h-[12px] w-[12px]" style={{ "--chkbg": "#006AE8" }} checked={checked()} onInput={(e) => setChecked(e.target.checked)} />
        <span class="ml-2 text-xs text-label">已阅读并同意<a onClick={NotYet}>
          用户协议</a>和<a onClick={NotYet}>平台隐私政策</a></span>
      </label>

      <Show when={!loading()} fallback={<button class="btn btn-primary text-white" disabled>正在检测</button>}>
        <button onClick={playVideo} class="btn btn-primary text-white">{imgUrl() ? '重新识别' : '开始识别'}</button>
      </Show>
    </div >
  )
}

export default Face;
