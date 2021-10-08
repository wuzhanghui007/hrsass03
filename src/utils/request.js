import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getTimeStamp } from '@/utils/auth'
import router from '@/router'

const TimeOut = 7200 // 定义超时时间
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 配置生产和开发环境
  timeout: 10000
})
// 请求拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    // console.log(IsCheckTimeOut())
    if (IsCheckTimeOut()) {
      store.dispatch('user/logout') // 登出操作删除token
      router.push('/login')
      return Promise.reject(new Error('登录超时，请重新登录'))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})
// 响应拦截器
service.interceptors.response.use(response => {
  const { success, message, data } = response.data
  if (success) {
    return data
  } else {
    Message.error(message) // element-ui 提示错误消息
    return Promise.reject(new Error(message))
  }
}, error => {
  if (error.response && error.response.data && error.response.data.code === 10002) {
    store.dispatch('user/logout') // 登出操作
    router.push('/login')
  } else {
    Message.error(error.message)
  }
  return Promise.reject(error) // 返回执行错误 进入cath
})

// 超时逻辑
function IsCheckTimeOut() {
  var currentTime = Date.now() // 当前时间
  var timeStamp = getTimeStamp() // 存入token时间
  return (currentTime - timeStamp) / 1000 > TimeOut
}
export default service
