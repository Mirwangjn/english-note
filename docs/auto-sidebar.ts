//根据目录生成侧边栏
import fs from "node:fs";
import { type DefaultTheme } from "vitepress";

export const autoSidebar = () => {
  //设置基础路径
  const basePath = __dirname;
  //设置白名单
  const whiteList = [".vitepress", "components", "config", "public", "img", 'assets']
  //lstatSync函数的作用是同步地获取文件或目录的状态信息, isDirectory判断当前文件是否为文件夹
  const isDirectory = (path: string) => fs.lstatSync(path).isDirectory();
  //__dirname获取当前文件所在目录的绝对路径
  //获取当前目录信息
  const root = fs.readdirSync(__dirname);
  //过滤白名单函数
  const filter = (arr: string[]) => {
    return arr.filter(val => !whiteList.includes(val));
  }
  //最终的目录结构
  const config: DefaultTheme.Sidebar = {};

  /**
   * 
   * @param arr 目录文件信息
   * @param deep 目录深度
   * @param curArr 当前信息需要添加的数组
   * @param prefixPath 前缀路径
   */
  const setDir2 = (arr: string[], deep: number, curArr: DefaultTheme.SidebarItem[], prefixPath: string) => {
    //例外处理
    if (deep === 1) {
      //第一层不是文件夹的部分都会存放在'/'路径下
      config['/'] = [{
        text: 'other',
        collapsed: false,
        items: curArr
      }]
    }
    //单层逻辑
    //过滤白名单
    arr = filter(arr);
    //遍历数组
    for (let i = 0; i < arr.length; i++) {
      //获取当前文件名, 可能是文件夹, 可能是文件
      const item = arr[i];
      //例外处理, 如果是'/' ==> ''; 反之着不管
      const prefix = prefixPath === '/' ? "" : prefixPath;
      //完整路径 /java/xxx
      const finalPrefixPath = prefix + '/' + item;
      //完整路径的绝对路径
      const path = basePath + finalPrefixPath;
      //对路径前缀的一些处理
      //判断是否是文件夹 
      if (isDirectory(path)) {
        const tempArr: DefaultTheme.SidebarItem[] = [];
        //是 ==> 继续递归
        //例外: 第一层的文件夹不需要存放在 curArr中; 而其他层需要
        if (deep === 1) {
          //第一层处理数据为: 创建一个数组, 其中的items递归传递给curArr
          //需保证路径格式为: '/xxx/'
          config['/' + item + '/'] = [{
            text: item,
            collapsed: false,
            items: tempArr,
          }]
          //隐藏回溯递归下去
          setDir2(fs.readdirSync(path), deep + 1, tempArr, finalPrefixPath);
        } else {
          //第二层: 创建一个对象, 将此对象添加到curArr中 将其中的items递归传递给curArr
          const tempObj: DefaultTheme.SidebarItem = {
            text: item.replace(".md", ""),
            collapsed: false,
            items: tempArr
          }
          curArr.push(tempObj);
          //回溯递归
          setDir2(fs.readdirSync(path), deep + 1, tempArr, finalPrefixPath);
        }
      } else {
        ////不是md文件, 跳过
        if (item.indexOf(".md") === -1) continue;
        //否 ==> 添加curArr数组中
        curArr.push({ text: item.replace(".md", ""), link: prefix + '/' + item.replace(".md", "") });
      }
    }


  }

  setDir2(root, 1, [], "/");
  return config;
}



//生成目录结构

/*
 {
      // 当用户位于 `Java` 目录时，会显示此侧边栏
      '/Java/': [
        {
          text: 'Java',
          collapsed: false,
          items: javaConfig,
        }
      ],
      'vue': [
        {
          text: 'vue',
          collapsed: false,
          items: vueConfig
        }
      ],
      'vitepress': [
        {
          text: 'vitepress',
          collapsed: false,
          items: [
            { text: '开始', link: "/vitepress/addIcon" },
            {
              text: 'test',
              items: [
                { text: '测试', link: "/vitepress/code/index" }
              ]
            }
          ]
        }
      ],
    }
*/



