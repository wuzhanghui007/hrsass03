<template>
  <el-row class="tree-card" type="flex" justify="space-between" align="middle">
    <el-col><span>{{ treeNode.name }}</span></el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <el-dropdown @command="operateDepts">
            <span>操作 <i class="el-icon-arrow-down" /> </span>
            <el-dropdown-menu slot="dropdown" default-active="0">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>
<script>
import { delDepartments } from '@/api/departments'
export default {
  props: {
    treeNode: {
      required: true,
      type: Object
    },
    /* 是否显示编辑和删除部门的下拉选框 */
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    }
  },
  methods: {
    // 点击编辑删除，新增时触发
    operateDepts(type) {
      if (type === 'add') {
        this.$emit('addDepts', this.treeNode)
      } else if (type === 'edit') {
        console.log('edit')
        this.$emit('editDepts', this.treeNode)
      } else { // 触发自定义事件 点击谁 删除谁)
        console.log('del')
        this.$confirm('您确认删除该组织部门吗').then(() => {
          return delDepartments(this.treeNode.id)
        }).then(() => {
          this.$emit('delDepts', this.treeNode.id)
          this.$message.success('删除部门成功')
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.el-row{
  width: 100%;
}
</style>
