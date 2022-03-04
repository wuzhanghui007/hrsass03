<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="box-card">
        <el-tabs v-model="activeName">
          <!-- 角色管理 -->
          <el-tab-pane label="角色管理" name="first">
            <el-row>
              <el-button type="primary" size="small" icon="el-icon-plus" @click="showDialog = true">添加角色</el-button>
            </el-row>
            <el-table
              :data="list"
              border
              style="width: 100%"
              :default-sort="{prop: 'list', order: 'descending'}"
            >
              <el-table-column label="序号" type="index" width="80" align="center" />
              <el-table-column label="角色名称" property="name" width="180" sortable />
              <el-table-column label="描述" property="description" sortable />
              <el-table-column label="操作" width="220" align="center">
                <template slot-scope="{ row }">
                  <el-button
                    type="text"
                    size="small"
                  >
                    分配权限
                  </el-button>
                  <el-button
                    type="text"
                    size="small"
                    @click="editRole(row.id)"
                  >
                    修改
                  </el-button>
                  <el-button
                    type="text"
                    size="small"
                    @click="deleteRole(row.id)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-row>
              <!--
                @size-change="size-change"
                @current-change="current-change"
                  :current-page="current-page"
                -->
              <el-pagination
                layout="total, sizes, prev, pager, next, jumper"
                :page-sizes="[5, 7, 9]"
                :page-size="page.pagesize"
                :total="page.total"
                :current-page="page.page"
                @current-change="currentChange"
                @size-change="sizeChange"
              />
            </el-row>
          </el-tab-pane>
          <!-- 公司信息 -->
          <el-tab-pane label="公司信息" name="second">
            <el-form label-width="150px" style="margin-top:20px">
              <el-form-item label="企业名称">
                <el-input v-model="formData.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司电话">
                <el-input v-model="formData.companyPhone" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" type="textarea" :rows="3" disabled style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!--  编辑部门弹框-->
    <el-dialog title="编辑部门" :visible="showDialog" @close="btnCancel">
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
        <el-form-item prop="name" label="角色名称">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 放置footer插槽 -->
      <el-row type="flex" justify="center">
        <el-col :span="8">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRole } from '@/api/setting'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      activeName: 'first', // tabs导航栏默认打开选择第一个
      page: {
        // 放置页码及相关数据
        page: 1,
        pagesize: 5, // 每页数量
        total: 0 // 记录总数
      },
      list: [], // 数据
      form: {
        name: 'xxx'
      },
      formData: {
        // 公司信息
      },
      roleForm: {
        name: '',
        description: ''
      },
      showDialog: false, // 控制弹层显示
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['companyId'])

  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    async getRoleList() {
      const { rows, total } = await getRoleList(this.page)
      this.list = rows
      this.page.total = total
    },
    currentChange(newPage) {
      this.page.page = newPage
      this.getRoleList()
    },
    sizeChange(newSize) {
      this.page.pagesize = newSize
      this.getRoleList()
    },
    /* 获取公司信息 */
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
      console.log(this.formData)
    },
    async deleteRole(id) {
      try {
        await this.$confirm('确认删除该角色吗')
        await deleteRole(id)
        this.getRoleList()
        this.$message.success('删除角色成功')
      } catch (error) {
        console.log(error)
      }
    },
    async editRole(id) {
      this.roleForm = await getRoleDetail(id) // 实现数据回写
      this.showDialog = true // 显示弹层
    },
    btnCancel() {
      this.roleForm = {
        name: '',
        description: ''
      }
      // 移除校验
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    },
    async btnOK() {
      try {
        await this.$refs.roleForm.validate()
        // 只有校验通过的情况下 才会执行await的下方内容
        // roleForm这个对象有id就是编辑 没有id就是新增
        if (this.roleForm.id) {
          await updateRole(this.roleForm)
        } else {
          // 新增业务
          await addRole(this.roleForm)
        }
        // 重新拉取数据
        this.getRoleList()
        this.$message.success('操作成功')
        this.showDialog = false // 关闭弹层  =>  触发el-dialog的事件close事件
      } catch (error) {
        console.log(error)
      }
    }
  }

}
</script>

<style lang="scss" scoped>
.el-tab-pane {
  padding: 10px 40px 0 40px;
}
.el-table, .el-pagination{
  margin-top: 20px;
}

</style>
