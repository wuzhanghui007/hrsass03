import { getToken, setToken, removeToken } from '@/utils/auth'
import { login, getUserInfo, getUserVetailById } from '@/api/user'

const state = {
  token: getToken(),
  userInfo: {}
}
const mutations = {
  setToken(state, token) {
    state.token = token
    setToken(token)
  },
  removeToken(state) {
    state.token = null
    removeToken()
  },
  // 更新userInfo
  setUserInfo(state, result) {
    state.userInfo = { ...result }
  },
  // 定义删除userInfo 信息方法
  removeUserInfo(state) {
    state.userInfo = {}
  }

}
const actions = {
  // 登录接口
  async login(context, data) {
    const result = await login(data)
    context.commit('setToken', result) // 返回数据经过响应拦截器处理
  },
  // 获取用户信息接口
  async getUserInfo(context) {
    const result = await getUserInfo()
    // 获取用户详情/头像
    const baseInfo = await getUserVetailById(result.userId)
    context.commit('setUserInfo', { ...result, ...baseInfo })
    return result // 后面权限使用
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
