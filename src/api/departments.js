import request from '@/utils/request'
// 获取组织架构数据
export function getDepartments() {
  return request({
    url: '/company/department',
    method: 'get'
  })
}
// 删除部门接口
export function delDepartments(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}

// 获取某个部门的详情

export function getDepartDetail(id) {
  return request({
    url: `/company/department/${id}`
  })
}
/* 新增部门 */
export function addDepartments(data) {
  return request({
    url: '/company/department', // restful接口规范
    method: 'post',
    data // axios的body参数 data
  })
}

export function updateDepartments(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}

