import { Router } from "@solidjs/router";
import { lazy } from "solid-js";

const isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)

export const routes = [
  {
    name: "Home",
    title: "首页",
    path: "/",
    component: lazy(() => import("@/pages/Home")),
    showNav: true,
  },
  /* 删除跌倒检测实时监控相关 */
  // {
  //   name: 'Detect',
  //   title: '监控',
  //   path: '/detect',
  //   component: lazy(() => isMobile ? import('@/pages/Detect/mobile') : import('@/pages/Detect')),
  //   showNav: false,
  // },
  {
    name: "Login",
    title: "登录页",
    path: "/login",
    component: lazy(() => isMobile ? import("@/pages/Login/mobile") : import("@/pages/Login")),
    showNav: false,
  },
  {
    name: "FaceManage",
    title: "人脸管理",
    path: "/manage",
    component: lazy(() => import("@/pages/FaceManage")),
    showNav: true,
  },
  {
    name: "404",
    title: "404",
    path: "*404",
    component: lazy(() => import("@/pages/404")),
    showNav: false,
  }
];

const Routes = () => {
  return <Router>
    {routes}</Router>;
};

export default Routes;
