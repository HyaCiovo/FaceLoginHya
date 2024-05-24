import { addUserFace, deleteUser, getUserDetail } from "@/apis/baidu";
import Modal from "@/components/Normal/modal";
import Table from "@/components/Normal/table";
import { client, fileToBase64, formatImageUrl } from "@/utils";
import { createSignal, onMount, Ref, Component } from "solid-js";
import toast from "solid-toast";
import dayjs from "dayjs";
import { user_db } from "@/database/user"

const FaceManager: Component = () => {
  const [params, setParams] = createSignal<any>({});
  const [faceFile, setFile] = createSignal<File>();
  let modal: Ref<any>;
  let upload: Ref<any>;

  const columns = (item?: string, index?: number) => [
    {
      title: "序号",
      key: "index",
      value: index
    },
    {
      title: "账号",
      key: "id",
      value: item
    },
    {
      title: "名称",
      key: "nickname",
      value: !!item && user_db.user_list()[item]?.nickname
    },
    {
      title: "人脸",
      key: "face",
      value: <img src={formatImageUrl("baidu-face-list", user_db.user_list()[item || "0"]?.faceToken)} class='w-[64px]' />
    },
    {
      title: "创建时间",
      key: "createTime",
      value: !!item && user_db.user_list()[item]?.createdAt
    },
    {
      title: "操作",
      key: "action",
      value: <><button class="btn btn-ghost" onClick={() => toast.error("功能暂未开放")}>详情</button>
        <button class="btn btn-ghost" onClick={() => removeUser(item)}>删除</button>
      </>
    }
  ]

  // const getDetail = (item: any) => {
  //   getUserDetail(item).then((res) => {
  //     console.log(res);
  //   })
  // }

  const removeUser = (item: any) => {
    deleteUser(item).then(
      (res) => {
        if (res.error_code != 0)
          return toast.error('删除失败，' + res.error_msg)
        toast.success('删除成功')
        user_db.deleteUser(item)
      }
    )
  }

  const addUser = () => {
    document.getElementById('my_modal_2')?.showModal()
  }

  const handleFile = async (file: any) => {
    if (!file) return;
    await fileToBase64(file).then((res) => {
      setFile(file)
      setParams({ ...params(), face: res })
    })
  }

  const onSubmit = () => {
    // 生成随机纯数字账号
    const user_id = Math.random().toString().substr(2, 9);

    // 调用百度智能云人脸库的添加人脸api
    addUserFace({
      user_id,
      user_info: params()?.nickname || '',
      image: params()?.face
    }).then((res: any) => {
      if (res.error_code !== 0)
        return toast.error('新增失败，' + res.error_msg)
      toast.success('新增成功')
      // 以百度智能云返回的人脸照片的faceToken拼接文件名，并上传到阿里云oss
      client.put('baidu-face-list/' + res.result.face_token + '.jpg', faceFile())

      // 新增用户数据
      user_db.addNewUser({
        id: user_id,
        nickname: params()?.nickname || '',
        faceToken: res.result.face_token,
        createdAt: dayjs(res.timestamp * 1000).format('YYYY-MM-DD HH:mm:ss'),
        password: params()?.password || ''
      })
    }).finally(() => { modal.click() })
  }


  onMount(() => {
    // setInterval(() => {
    //   console.log(user_db.user_list())
    // }, 3000)
  })
  return <div class="min-h-full">
    <Modal onClose={() => { setParams({}); upload.value = ''; setFile() }} ref={modal}>
      <p>新增用户</p>
      <div class="mt-4">
        <label class="form-control w-full max-w-xs">
          <div class="label">
            <span class="label-text">姓名</span>
          </div>
          <input type="text" placeholder="请输入"
            class="input input-bordered w-full max-w-xs"
            value={params()?.nickname || ''}
            onInput={(e) => { setParams({ ...params(), nickname: e.target.value }) }}
          />
        </label>
        <label class="form-control w-full max-w-xs">
          <div class="label">
            <span class="label-text">密码</span>
          </div>
          <input type="password" placeholder="请输入"
            class="input input-bordered w-full max-w-xs"
            value={params()?.password || ''}
            onInput={(e) => { setParams({ ...params(), password: e.target.value }) }}
          />
        </label>
        <label class="form-control w-full max-w-xs">
          <div class="label">
            <span class="label-text">照片</span>
          </div>
          <input type="file" class="file-input file-input-bordered w-full max-w-xs" ref={upload}
            onChange={(e) => { handleFile(e.target.files?.[0]) }} />
        </label>
        <label class="form-control w-full flex justify-center mt-6">
          <button class="btn" onClick={onSubmit}>提交</button>
        </label>
      </div>
    </Modal>
    <div class="navbar px-4 flex justify-between">
      <div class="text-xl">用户管理</div>
      <button class="btn btn-ghost" onclick={addUser}>新增用户</button>
    </div>
    <Table list={Object.keys(user_db.user_list())} columns={columns} />
  </div>;
};

export default FaceManager;