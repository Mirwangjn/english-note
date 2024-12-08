/*
  默认情况下: vitepress是监视不到新增删除文件的监听，需要手动重启vitepress
  通过这段代码可以监听文件的新增, 并告诉vitepress重启
*/
import path from "path"
import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import chokidar from 'chokidar'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const watchDir = path.join(__dirname);
const watchJsonFile = path.join(__dirname, `/watchJson.json`)

console.log(`实时监控目录[ ${watchDir} ]变化, 并重新生成导航数据`)


// Initialize watcher.
const watcher = chokidar.watch(watchDir, {
  // 忽略启动时的监听
  ignoreInitial: true,
  // 忽略代码文件和静态资源文件的变化监听
  ignored: (path, stats) => stats?.isFile() && !path.endsWith('.md'), // only watch md files
  persistent: true
});

watcher
.on('add', path => {
  console.log(`File ${path} has been added`)
  writeFileSync(watchJsonFile, `{"updateTime":${new Date().getTime()}}`)
})
.on('unlink', path => {
  console.log(`File ${path} has been removed`)
  writeFileSync(watchJsonFile, `{"updateTime":${new Date().getTime()}}`)
});

// const watcher = chokidar.watch(watchDir, {
//   // 忽略软连接文件的监听
//   followSymlinks: false,
//   // 忽略启动时的监听
//   ignoreInitial: true,
//   awaitWriteFinish: {
//     // 变动之后，只有在1分钟内没有再发生变化，才触发回调函数
//     stabilityThreshold: 60000,
//     // 轮询间隔1分钟
//     pollInterval: 60000,
//   },
//   // 忽略代码文件和静态资源文件的变化监听
//   ignored: [/.+\.(vue|js|ts|jsx|tsx|png|jpg|jpeg|gif|svg)/],
// })

// watcher.on('all', (event, path) => {
//   if (path.match(/.+\/(demo|asserts)\/.*$/)) {
//     // 所有资源路径中包含demo和asserts文件夹的都会手动触发vitepress更新
//     return
//   }
//   console.log(`检测到文件/文件夹变化: ${event}, ${path}, 正在手动触发vitepress重启...、\r\n`)
//   // 监听到变化，则将最新时间重写到watchJsonFile中，此时会触发vitepress重启
//   writeFileSync(watchJsonFile, `{"updateTime":${new Date().getTime()}}`)
// })

