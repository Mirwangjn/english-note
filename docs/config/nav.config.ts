import { DefaultTheme } from "vitepress";

export const navConfig: DefaultTheme.NavItem[] = [
    {
        text: '📗首页',
        link: '/'
    },
    {
        text: "新概念英语",
        items: [
            { text: "新概念英语2", link: "/新概念英语2/01.介绍" }
        ]
    }
]