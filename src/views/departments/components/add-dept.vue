<template>
  <el-dialog
    title="提示"
    :visible.sync="showDialog"
    width="45%"
    heigth="80%"
    @close="handleClose"
  >
    <el-form ref="deptForm" :model="formData" :rules="rules" label-width="100px" class="demo-ruleForm">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" placeholder="1-15个字符" style="width:80%" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" placeholder="1-30个字符" style="width:80%" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" placeholder="1-15个字符" style="width:50%" @focus="getEmployeeSimple()">
          <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" placeholder="1-300个字符" style="width:80%" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="btnOK">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getDepartments, getDepartDetail, addDepartments, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'

export default {
  props: {
    // 节点数据
    treeNode: {
      type: Object,
      default: null
    },
    // 弹层显示
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    // 检查部门名称
    const checkNameRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      this.depts = depts
      // var flage = false // this.formData.id
      if (this.formData.id) {
      // 编辑模式
        console.log('编辑模式')
        this.isRepeat = this.depts.filter(item => item.id === this.treeNode.pid && item.id === !this.treeNode.id).some(item => item.name === value)
      } else {
      // 新增模式
        // console.log('新增模式') // .some(item => item.name === value)
        this.isRepeat = this.depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
        // console.log(this.depts.filter(item => item.id === this.treeNode.id))
        // console.log(this.depts)
      }
      this.isRepeat ? callback(new Error(`同级部门下已经存在这个${value}部门了`)) : callback()
    }
    const checkCodeRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      let isRepeat = false
      // var flage = false // this.formData.id
      if (this.formData.id) {
        // 编辑模式下
        isRepeat = depts.filter(item => item.id !== this.treeNode.id).some(item => item.code === value && value)
      } else {
        // 新增模式
        // console.log('新增模式')
        // console.log(depts)
        isRepeat = depts.some(item => item.code === value && value)
        console.log(isRepeat)
      }
      isRepeat ? callback(new Error(`组织架构下已经存在这个${value}编码了`)) : callback()
    }
    return {
      peoples: [], // 员工简单数据

      dialogVisible: true, // 弹框显示控件
      // 表单数据
      formData: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      depts: '',
      isRepeat: false,
      // 表单规则
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1到 15 个字符', trigger: 'blur' },
          { validator: checkNameRepeat, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码长度为1-30个字符', trigger: 'blur' },
          { validator: checkCodeRepeat, trigger: 'blur' }],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 300, message: '部门介绍长度为1-300个字符', trigger: 'blur' }]
      }

    }
  },
  methods: {
    // 弹框关闭
    handleClose() {
      this.$emit('update:showDialog', false)
      this.$refs.deptForm.resetFields()
    },
    // 点击确认
    btnOK() {
      //  手动校验表单
      this.$refs.deptForm.validate(async isok => {
        if (isok) {
          if (this.formData.id) {
            // 编辑
            console.log('编辑')
            await updateDepartments(this.formData)
          } else {
            // 新增部门
            await addDepartments({ ...this.formData, pid: this.treeNode.id })
            // console.log('新增部门')
            // console.log(this.formData)
          }
          this.$emit('addDepts')
          this.$emit('update:showDialog', false)
          this.handleClose()
        }
      })
    },
    // 获取详情方法
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id)
      // 因为我们是父组件调用子组件的方法  先设置了node 数据 直接调用方法
      // props传值是异步的
    },
    /* 获取员工简单列表 */
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
    }
  }
}
</script>

<style lang="scss" scoped>
  /deep/ .el-dialog {
     margin-top: 10vh !important;
 }
</style>
