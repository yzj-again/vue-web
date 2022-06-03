<template>
  <LoginHeader>联合登录</LoginHeader>
  <section class="container" v-if="isBind">
    <div class="unbind">
      <div class="loading"></div>
    </div>
  </section>
  <section class="container" v-else>
    <nav class="tab">
      <a @click="hasAccount=true" :class="{active:hasAccount}" href="javascript:;">
        <i class="iconfont icon-bind"/>
        <span>已有小兔鲜账号，请绑定手机</span>
      </a>
      <a @click="hasAccount=false" :class="{active:!hasAccount}" href="javascript:;">
        <i class="iconfont icon-edit"/>
        <span>没有小兔鲜账号，请完善资料</span>
      </a>
    </nav>
    <div class="tab-content" v-if="hasAccount">
      <CallbackBind :unionId="unionId"></CallbackBind>
    </div>
    <div class="tab-content" v-else>
      <CallbackPatch :unionId="unionId"></CallbackPatch>
    </div>
  </section>
  <LoginFooter></LoginFooter>
</template>
<script>
import LoginHeader from '@/views/login/components/login-header'
import LoginFooter from '@/views/login/components/login-footer'
import CallbackBind from '@/views/login/components/callback-bind'
import CallbackPatch from '@/views/login/components/callback-patch'
import QC from 'qc'
import { ref } from 'vue'
import { userQQLogin } from '@/api/user'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Message from '@/components/library/Message'

export default {
  name: 'LoginCallback',
  components: {
    LoginHeader,
    LoginFooter,
    CallbackBind,
    CallbackPatch
  },
  setup () {
    const hasAccount = ref(false)
    // 首先默认已经注册且已经绑定
    // 通过qq的api获取openId就是后台需要的unionId然后去进行登录
    // 如果成功:登录成功
    // 如果失败:改qq和web进行绑定(有账号未绑qq,没有账号未绑定qq)
    const isBind = ref(true)
    const store = useStore()
    const router = useRouter()
    const unionId = ref(null)
    // 确保qq已经登录(官网建议确保qq已登录,才能成功拿去数据)
    if (QC.Login.check()) {
      QC.Login.getMe((openId) => {
        // 第三方登录唯一标识
        unionId.value = openId
        // 请求后台
        // console.log(openId)
        userQQLogin(openId).then(data => {
          // 如果成功拿到用户信息,登录成功
          // 1.存储用户信息
          // console.log(data)
          // data还是老数据
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
          // 模拟已经绑定过,再次进行绑定的情况,这种情况直接跳转
          router.push(store.state.user.redirectUrl)
          // 3.成功提示
          Message({
            type: 'success',
            text: 'QQ登录成功'
          })
        }).catch(e => {
          // 登录失败,没有绑定信息
          isBind.value = false
        })
      })
    }
    return {
      hasAccount,
      isBind,
      unionId
    }
  }
}
</script>
<style scoped lang="less">
.container {
  padding: 25px 0;
  position: relative;
  height: 730px;

  .unbind {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 25px 0;
    z-index: 99;

    .loading {
      height: 100%;
      background: #fff url(../../assets/images/load.gif) no-repeat center / 100px 100px;
    }
  }
}

.tab {
  background: #fff;
  height: 80px;
  padding-top: 40px;
  font-size: 18px;
  text-align: center;

  a {
    color: #666;
    display: inline-block;
    width: 350px;
    line-height: 40px;
    border-bottom: 2px solid #e4e4e4;

    i {
      font-size: 22px;
      vertical-align: middle;
    }

    span {
      vertical-align: middle;
      margin-left: 4px;
    }

    &.active {
      color: @webColor;
      border-color: @webColor;
    }
  }
}

.tab-content {
  min-height: 600px;
  background: #fff;
}
</style>
