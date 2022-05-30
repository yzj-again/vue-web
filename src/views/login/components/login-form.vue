<template>
  <div class="account-box">
    <div class="toggle">
      <!--第一行用什么登录-->
      <a @click="isMsgLogin=false" href="javascript:;" v-if="isMsgLogin">
        <i class="iconfont icon-user"></i> 使用账号登录
      </a>
      <a @click="isMsgLogin=true" href="javascript:;" v-else>
        <i class="iconfont icon-msg"></i> 使用短信登录
      </a>
    </div>
    <Form ref="formCom" class="form" :validation-schema="schema" autocomplete="off" v-slot="{errors}">
      <!--账号登录-->
      <template v-if="!isMsgLogin">
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field :class="{error:errors.account}" v-model="form.account" name="account" type="text"
                   placeholder="请输入用户名"/>
          </div>
          <div class="error" v-if="errors.account">
            <i class="iconfont icon-warning"/>
            {{ errors.account }}
          </div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-lock"></i>
            <Field :class="{error:errors.password}" v-model="form.password" name="password" type="password"
                   placeholder="请输入密码"/>
          </div>
          <div class="error" v-if="errors.password">
            <i class="iconfont icon-warning"/>
            {{ errors.password }}
          </div>
        </div>
      </template>
      <template v-else>
        <!--验证登录-->
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field :class="{error:errors.mobile}" v-model="form.mobile" name="mobile" type="text" placeholder="请输入手机号"/>
          </div>
          <div class="error" v-if="errors.mobile">
            <i class="iconfont icon-warning"/>
            {{ errors.mobile }}
          </div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-code"></i>
            <Field :class="{error:errors.code}" v-model="form.code" name="code" type="text" placeholder="请输入验证码"/>
            <span class="code">发送验证码</span>
          </div>
          <div class="error" v-if="errors.code">
            <i class="iconfont icon-warning"/>
            {{ errors.code }}
          </div>
        </div>
      </template>
      <div class="form-item">
        <div class="agree">
          <!--<WebCheckbox name="isAgree" value="form.isAgree"></WebCheckbox>-->
          <Field as="WebCheckbox" name="isAgree" v-model="form.isAgree"/>
          <span>我已同意</span>
          <a href="javascript:;">《隐私条款》</a>
          <span>和</span>
          <a href="javascript:;">《服务条款》</a>
        </div>
        <div class="error" v-if="errors.isAgree">
          <i class="iconfont icon-warning"/>
          {{ errors.isAgree }}
        </div>
      </div>
      <a @click="submit" href="javascript:;" class="btn">登录</a>
    </Form>
    <div class="action">
      <img src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png" alt="">
      <div class="url">
        <a href="javascript:;">忘记密码</a>
        <a href="javascript:;">免费注册</a>
      </div>
    </div>
  </div>
</template>
<script>
import { reactive, ref, watch } from 'vue'
import { Form, Field } from 'vee-validate'
import Message from '@/components/library/Message'
import schema from '@/utils/vee-validate-schema'

export default {
  name: 'LoginForm',
  components: {
    Form,
    Field
  },
  setup () {
    // 切换登录
    const isMsgLogin = ref(false)
    // 表单数据对象
    const form = reactive({
      isAgree: true,
      account: null,
      password: null,
      mobile: null,
      code: null
    })
    // vee-validate
    // 1.导入Form Field组件替换form和input,需要加上name指定将来要校验规则函数
    // 2.Field需要数据绑定,字段最好和后台数据保持一致
    // 3.定义name属性对应的校验规则,Form的validationSchema接受定义好的校验规则
    // 4.自定义组件校验必须先支持v-model,然后Field指定为组件
    // 5.清空之前的操作数据
    const mySchema = {
      // 校验函数有自己的规则,返回true就是校验成功
      account: schema.account,
      password: schema.password,
      mobile: schema.mobile,
      code: schema.code,
      isAgree: schema.isAgree
    }
    // 切换重置数据,监听isMsgLogin
    const formCom = ref(null)
    watch(isMsgLogin, () => {
      // 重置表单 有数据还有校验结果
      form.isAgree = true
      form.account = null
      form.password = null
      form.mobile = null
      form.code = null
      // 校验结果(如果是没有销毁Field组件,则不会销毁),需手动消除 v-show
      // Form组件提供了resetForm函数清除校验结果 怎么调? Form组件写ref="formCom"
      // const formCom = ref(null)  + return { formCom }
      formCom.value.resetForm()
    })
    // setup中获取组件实例
    // app应用实例  组件实例在应用实例里
    // const { proxy } = getCurrentInstance()

    // 整体表单的确认
    const submit = async () => {
      // Form提供一个validate函数作为整体表单的校验,返回的是Promise
      const valid = await formCom.value.validate()
      console.log(valid)
      Message({
        type: 'error',
        text: '用户名或密码错误'
      })
      // 调原型上的方法,不用选项api方法
      // proxy.$message({
      //   type: 'error',
      //   text: '用户名或密码错误'
      // })
    }
    return {
      isMsgLogin,
      form,
      schema: mySchema,
      formCom,
      submit
    }
  }

}
</script>
<style scoped lang="less">
// 账号容器
.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;

    a {
      color: @webColor;

      i {
        font-size: 14px;
      }
    }
  }

  .form {
    padding: 0 40px;

    &-item {
      margin-bottom: 28px;

      .input {
        position: relative;
        height: 36px;

        > i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }

        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;

          &.error {
            border-color: @priceColor;
          }

          &.active, &:focus {
            border-color: @webColor;
          }
        }

        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
      }

      > .error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: @priceColor;

        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }

    .agree {
      a {
        color: #069;
      }
    }

    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: @webColor;

      &.disabled {
        background: #cfcdcd;
      }
    }
  }

  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>
