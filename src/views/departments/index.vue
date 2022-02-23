<template>
  <div class="dashboard-container">
    <div class="app-container">

      <el-card class="card">
        <el-row class="heard"><el-col class="heard-col"><span>组织架构</span></el-col></el-row>
        <!-- 公司标题 -->
        <div class="tree-box">
          <div class="tree-topic">
            <tree-tools :tree-node="company" :is-root="true" @addDepts="addDepts" />
          </div>
          <!--
        <el-row class="tree-card" type="flex" justify="space-between" align="middle" style="height: 40px">
          <el-col><span>江苏传智播客教育科技股份有限公司</span></el-col>
          <el-col :span="4">
            <el-row type="flex" justify="end">
              <el-col>负责人</el-col>
              <el-col>
                <el-dropdown>
                  <span>操作 <i class="el-icon-arrow-down" /> </span>
                  <el-dropdown-menu slot="dropdown" default-active="0">
                    <el-dropdown-item style="color:#6b9eff">添加子部门</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
         -->
          <!-- 树行数据 -->
          <!-- <el-tree :data="departs" :props="defaultProps" default-expand-all /> -->
          <el-tree :data="departs" :props="defaultProps" default-expand-all style=" width: 100%">
            <tree-tools slot-scope="{ data }" :tree-node="data" @editDepts="editDepts" @delDepts="getDepartments" @addDepts="addDepts" />
          </el-tree>
        </div>
      </el-card>
    </div>
    <add-dept ref="addDept" :tree-node="node" :show-dialog.sync="showDialog" @addDepts="getDepartments" />
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
import addDept from './components/add-dept.vue'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
export default {
  components: {
    TreeTools,
    addDept
  },
  data() {
    return {
      // 结构数据
      departs: [],
      // 结构数据配置
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // 公司名称数据
      company: {
        name: '',
        manager: '负责人',
        id: ''

      },
      // 点击节点
      node: {
        id: '',
        name: ''
      }, // 记录当前点击的node节点
      showDialog: false // 是否显示弹层
    }
  },
  created() {
    this.getDepartments() // 调用自身的方法
  },
  methods: {
    // 获取数据结构
    async getDepartments() {
      const result = await getDepartments()
      this.company.name = result.companyName
      this.departs = tranListToTreeData(result.depts, '')
      // console.log(result)
    },
    // 点击添加部门时，子组件回传调用的函数
    addDepts(node) {
      this.node = node
      this.showDialog = true
    },
    // 点击编辑部门时
    editDepts(node) {
      this.node = node
      this.showDialog = true
      this.$refs.addDept.getDepartDetail(this.node.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.heard{
  padding: 20px  20px;
  .heard-col{
  border-bottom: 2px solid #e4e7ed
  }
  span {
    color: #409eff;
    border-bottom: 2px solid #409eff;
    vertical-align: top;
  }
}
.tree-card {
  font-size:14px;
}
  .tree-box{
    padding: 0px 80px;
  }

  .tree-topic{
    height: 32px;
  }
</style>
