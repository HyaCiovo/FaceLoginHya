import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import { resolve } from "path";
import basicSsl from "@vitejs/plugin-basic-ssl";
// import devtools from 'solid-devtools/vite';

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve("src"),
    },
  },
  plugins: [
    /* 
    Uncomment the following line to enable solid-devtools.
    For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
    */
    // devtools(),
    solidPlugin(),
    // basicSsl() // 本地https调试
  ],
  server: {
    // https: true, // 本地https调试
    host: "0.0.0.0",
    open: true,
    port: 3000,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8085/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        secure: false,
      },
      "/baiduapi": {
        target: "https://aip.baidubce.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/baiduapi/, ""),
        secure: false,
      },
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  build: {
    target: "esnext",
  },
});
