import request from '@/utils/request'

// 登录
export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}
// 获取用户基本资料
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'post'

  })
}
// 获取个人头像
export function getUserVetailById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}
export function logout() {

}
