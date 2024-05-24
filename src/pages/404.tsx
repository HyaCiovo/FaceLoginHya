import { A } from "@solidjs/router";
import { Component } from "solid-js";

const NotFound: Component = () => {
  return (
    <div class="flex flex-col items-center justify-center h-screen">
      <img src="src/assets/images/NotFound.png" class="scale-50" />
      <h1 class="text-4xl font-bold">404</h1>
      <p class="text-xl">Page not found</p>
      <A href="/" replace={true} class="btn mt-4" >前往首页</A>
    </div>
  );
};

export default NotFound;