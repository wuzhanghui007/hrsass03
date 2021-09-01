import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/sys/login',
    method: 'Post',
    data
  })
}

export function getInfo(token) {

}

export function logout() {

}
