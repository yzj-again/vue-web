<template>
  <Form ref="formCom" :validation-schema="mySchema" v-slot="{errors}" class="web-form" autocomplete="off">
    <div class="web-form-item">
      <div class="field">
        <i class="icon iconfont icon-user"></i>
        <Field :class="{err:errors.account}" name="account" v-model="form.account" class="input" type="text" placeholder="请输入用户名" />
      </div>
      <div v-if="errors.account" class="error">{{errors.account}}</div>
    </div>
    <div class="web-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field :class="{err:errors.mobile}" name="mobile" v-model="form.mobile" class="input" type="text" placeholder="请输入手机号" />
      </div>
      <div v-if="errors.mobile" class="error">{{errors.mobile}}</div>
    </div>
    <div class="web-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field :class="{err:errors.code}" name="code" v-model="form.code" class="input" type="text" placeholder="请输入验证码" />
        <span @click="send" class="code">{{ time === 0 ? '发送验证码' : `${time}秒后发送` }}</span>
      </div>
      <div v-if="errors.code" class="error">{{errors.code}}</div>
    </div>
    <div class="web-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field :class="{err:errors.password}" name="password" v-model="form.password" class="input" type="password" placeholder="请输入密码" />
      </div>
      <div v-if="errors.password" class="error">{{errors.password}}</div>
    </div>
    <div class="web-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field :class="{err:errors.rePassword}" name="rePassword" v-model="form.rePassword" class="input" type="password" placeholder="请确认密码" />
      </div>
      <div v-if="errors.rePassword" class="error">{{errors.rePassword}}</div>
    </div>
    <a @click="submit" href="javascript:;" class="submit">立即提交</a>
  </Form>
</template>

<script>
import { Form, Field } from 'vee-validate'
import schema from '@/utils/vee-validate-schema'
import { reactive, onUnmounted, ref } from 'vue'
import { userQQPatchCode, userQQPatchLogin } from '@/api/user'
import { useIntervalFn } from '@vueuse/core'
import Message from '@/components/library/Message'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
  name: 'CallbackPatch',
  components: {
    Form,
    Field
  },
  props: {
    unionId: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    // 1.表单校验(多了两个)
    // 2.发送短信验证码:接口不同
    // 3.完善信息
    // 表单数据对象
    const form = reactive({
      account: null,
      mobile: null,
      code: null,
      password: null,
      rePassword: null
    })
    // 表单校验规则
    const mySchema = {
      account: schema.accountApi,
      mobile: schema.mobile,
      code: schema.code,
      password: schema.password,
      rePassword: schema.rePassword
    }
    // 第二步,发短信
    // 发送验证码
    // pause 暂停 resume 开始
    // useIntervalFn(回调函数,执行间隔,是否立即开启)
    const time = ref(0)
    const formCom = ref(null)
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
          console.log(form.mobile)
          await userQQPatchCode(form.mobile)
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
    // 立即提交
    const store = useStore()
    const router = useRouter()
    // console.log(form) null
    const submit = async () => {
      const valid = formCom.value.validate()
      if (valid) {
        // userQQBindLogin 空的绑定操作
        await userQQPatchLogin({
          unionId: props.unionId,
          ...form
        }).then(data => {
          // 实现和之前登录一样的逻辑
          // 如果成功拿到用户信息,登录成功
          // 这里拿到的信息是固定的
          // 1.存储用户信息
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
          // 2.跳转到来源页或者首页
          router.push(store.state.user.redirectUrl)
          // 3.成功提示
          Message({
            type: 'success',
            text: 'QQ完善信息成功'
          })
        }).catch(e => {
          Message({
            type: 'error',
            text: 'QQ完善信息失败'
          })
        })
      }
    }
    return { form, mySchema, send, time, formCom, submit }
  }
}
</script>

<style scoped lang='less'>
.code {
  position: absolute;
  right: 0;
  top: 0;
  line-height: 50px;
  width: 80px;
  color: #999;
  &:hover {
    cursor: pointer;
  }
}
</style>
