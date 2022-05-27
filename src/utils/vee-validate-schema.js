// 校验规则
export default {
  account (value) {
    if (!value) return '请输入用户名'
    // 字母开头,6-16字符之间
    if (!/^[a-zA-Z]\w{5,15}$/.test(value)) return '字母开头且6-16个字符'
    return true
  },
  // 密码校验
  password (value) {
    if (!value) return '请输入密码'
    // 6-24个字符
    if (!/^\w{6,24}$/.test(value)) return '密码是6-24个字符'
    return true
  },
  mobile (value) {
    if (!value) return '请输入手机号'
    // 规则1开头,3-9之间 11位
    if (!/^1[3-9]\d{9}$/.test(value)) return '手机号格式错误'
    return true
  },
  code (value) {
    if (!value) return '请输入验证码'
    // 6个数字
    if (!/^\d{6}$/.test(value)) return '验证码是6个数字'
    return true
  },
  isAgree (value) {
    if (!value) return '请勾选同意用户协议'
    return true
  }
}
