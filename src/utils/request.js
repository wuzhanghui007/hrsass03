import axios from 'axios'
import { Message } from 'element-ui'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 配置生产和开发环境
  timeout: 5000
})
service.interceptors.request() // 请求拦截器

// 响应拦截器
service.interceptors.response(response => {
  const { success, message, data } = response.data
  if (success) {
    return data
  } else {
    Message.error(message) // element-ui 提示错误消息
  }
}, error => {
  Message.error(error.message)
  return Promise.reject(new Error(error)) // 返回执行错误 进入cath
})

export default service
