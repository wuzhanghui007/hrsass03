const Koa  = require('koa')
const serve = require('koa-static')
const proxy = require('koa2-proxy-middleware')

const app = new Koa();
app.use(proxy({
     targets: {
       // (.*) means anything
       '/prod-api/(.*)': {
           target: 'http://ihrm-java.itheima.net/api', //后端服务器地址
           changeOrigin: true,
           pathRewrite: {
               '/prod-api': ""
           }
       }
     }
   }))
app.use(serve(__dirname + "/public"))//将public下的代码静态化
app.listen(3333, () => {
     console.log('人资项目启动,http://localhost:3333/')
})