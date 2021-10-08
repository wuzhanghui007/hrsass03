import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'
const timeKey = 'hrsaas-timestamp-key'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
// 获取时间戳
export function getTimeStamp() {
  return Cookies.get(timeKey)
}
// 存时间戳
export function setTimeStamp() {
  var timeout = Date.now()
  return Cookies.set(timeKey, timeout)
}
