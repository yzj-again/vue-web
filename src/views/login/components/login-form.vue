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
            <span @click="send()" class="code">
              {{ time === 0 ? '发送验证码' : `${time}秒后发送` }}
            </span>
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
      <a href="https://graph.qq.com/oauth2.0/authorize?client_id=100556005&response_type=token&scope=all&redirect_uri=http%3A%2F%2Fwww.corho.com%3A8080%2F%23%2Flogin%2Fcallback">
        <img src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png" alt="">
      </a>
      <div class="url">
        <a href="javascript:;">忘记密码</a>
        <a href="javascript:;">免费注册</a>
      </div>
    </div>
  </div>
</template>
<script>
import { onUnmounted, reactive, ref, watch } from 'vue'
import { Form, Field } from 'vee-validate'
import Message from '@/components/library/Message'
import schema from '@/utils/vee-validate-schema'
import { userAccountLogin, userMobileLogin, userMobileLoginMsg } from '@/api/user'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { useIntervalFn } from '@vueuse/core'

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
    const store = useStore()
    // api方法
    const router = useRouter()
    // 路由信息
    const route = useRoute()
    const submit = async () => {
      // Form提供一个validate函数作为整体表单的校验,返回的是Promise
      const valid = await formCom.value.validate()
      // console.log(valid)
      // Message({
      //   type: 'error',
      //   text: '用户名或密码错误'
      // })
      // 调原型上的方法,不用选项api方法
      // proxy.$message({
      //   type: 'error',
      //   text: '用户名或密码错误'
      // })
      if (valid) {
        try {
          let data = null
          if (isMsgLogin.value) {
            const {
              mobile,
              code
            } = form
            data = await userMobileLogin({
              mobile,
              code
            })
          } else {
            const {
              account,
              password
            } = form
            data = await userAccountLogin({
              account,
              password
            })
          }
          const {
            id,
            account,
            avatar,
            mobile,
            nickname,
            token
          } = data.result
          store.commit('user/setUser', {
            id,
            account,
            avatar,
            mobile,
            nickname,
            token
          })
          // 实现返回跳转
          router.push(route.query.redirectUrl || '/')
          // 消息提示
          Message({
            type: 'success',
            text: '登录成功'
          })
        } catch (e) {
          if (e.response.data) {
            Message({
              type: 'error',
              text: e.response.data.message || '登录失败'
            })
          }
        }
      }
    }

    // pause 暂停 resume 开始
    // useIntervalFn(回调函数,执行间隔,是否立即开启)
    const time = ref(0)
    const {
      pause,
      resume
    } = useIntervalFn(() => {
      if (time.value <= 0) {
        pause()
      } else {
        time.value--
      }
    }, 1000, {
      // 默认不开启定时任务
      immediate: false
    })
    // console.log(time.value)
    onUnmounted(() => {
      pause()
    })

    // 1. 发送验证码
    // 1.1 绑定发送验证码按钮点击事件
    // 1.2 校验手机号，如果成功才去发送短信（定义API），请求成功开启60s的倒计时，不能再次点击，倒计时结束恢复
    // 1.3 如果失败，失败的校验样式显示出来
    const send = async () => {
      const valid = mySchema.mobile(form.mobile)
      if (valid === true) {
        // 通过
        if (time.value === 0) {
          // 没有倒计时才可以发送
          await userMobileLoginMsg(form.mobile)
          Message({
            type: 'success',
            text: '发送成功'
          })
          time.value = 60
          resume()
        }
      } else {
        // 失败，使用vee的错误函数显示错误信息 setFieldError(字段,错误信息)
        formCom.value.setFieldError('mobile', valid)
      }
    }
    // 初始化qq登录按钮
    // 1.准备span有id = qqLoginBtn
    // 2.QC.login({btnId="qqLoginBtn"})
    // 有js文件,但没有'qc'这个包,忽略打包qc
    // onMounted(() => {
    //   // 组件渲染完毕，使用QC生成QQ登录按钮
    //   QC.Login({
    //     btnId: 'qqLoginBtn'
    //   })
    // })
    return {
      isMsgLogin,
      form,
      schema: mySchema,
      formCom,
      submit,
      send,
      time
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
