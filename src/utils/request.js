import axios from 'axios'
const service = axios.create()
service.interceptors.request() // 请求拦截器
service.interceptors.response() // 响应拦截器
export default service
