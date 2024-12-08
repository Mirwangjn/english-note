import { defineConfig } from 'vitepress'
import { autoSidebar } from "../auto-sidebar"
import watchJson from "../watchJson.json";
import { navConfig } from '../config/nav.config'
//监视数据变化
console.log("updateInfo", watchJson);

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/english-note/',
  title: "My English Project",
  description: "A VitePress Site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: navConfig,

    sidebar: autoSidebar(),
    //右侧目录深度化
    outline: {
      level: "deep"
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],
    search: {
      provider: 'local'
    }
  }
})
