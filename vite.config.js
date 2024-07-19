import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import path from "path"; // 别名配置
// import { fileURLToPath } from "url";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [path.resolve(__dirname, "src/assets/icons")],
      // 指定symbolId格式
      symbolId: "icon-[name]",
      /**
       * custom dom id
       * @default: __svg__icons__dom__
       */
      customDomId: "__svg__icons__dom__",
    }),
  ],
  css: {
    devSourcemap: true, // 是否开启 css 的 sourcemap
  },
  resolve: {
    // 别名配置
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    assetsInlineLimit: 0, // 确保所有静态资源都被处理和打包
  },
});
