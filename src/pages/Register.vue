<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { Phone, ShieldCheck } from 'lucide-vue-next'
import { ElMessage } from 'element-plus'

const router = useRouter()

// 表单数据
const registerForm = ref({
  username: '',
  password: '',
  confirmPassword: '',
  captcha: ''
})

// 验证码图片
const captchaImage = ref('A 7 X 9')

// 加载状态
const loading = ref(false)

// 验证密码是否一致
const passwordsMatch = computed(() => {
  if (!registerForm.value.confirmPassword) return true
  return registerForm.value.password === registerForm.value.confirmPassword
})

// 刷新验证码
const refreshCaptcha = () => {
  // 模拟生成新的验证码
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let newCaptcha = ''
  for (let i = 0; i < 4; i++) {
    newCaptcha += chars[Math.floor(Math.random() * chars.length)]
    if (i < 3) newCaptcha += ' '
  }
  captchaImage.value = newCaptcha
  ElMessage.info('验证码已刷新')
}

// 注册方法
const handleRegister = async () => {
  // 表单验证
  if (!registerForm.value.username) {
    ElMessage.warning('请输入手机号或用户名')
    return
  }
  if (!registerForm.value.password) {
    ElMessage.warning('请输入密码')
    return
  }
  if (!registerForm.value.confirmPassword) {
    ElMessage.warning('请确认密码')
    return
  }
  if (!passwordsMatch.value) {
    ElMessage.error('两次输入的密码不一致')
    return
  }
  if (!registerForm.value.captcha) {
    ElMessage.warning('请输入验证码')
    return
  }

  loading.value = true

  try {
    // 后端接口注册
    // const response = await registerAPI(registerForm.value)

    // 模拟注册延迟
    await new Promise(resolve => setTimeout(resolve, 1500))

    ElMessage.success('注册成功！')
    router.push('/login')
  } catch (error) {
    ElMessage.error('注册失败，请稍后再试')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="w-full">
    <div class="text-center mb-8">
      <h1 class="text-2xl font-bold text-text-primary mb-2">创建帐户</h1>
      <p class="text-text-secondary">立即开始生成令人惊叹的AI艺术</p>
    </div>

    <form class="space-y-4" @submit.prevent="handleRegister">
      <div>
        <label class="block text-sm font-medium text-text-secondary mb-1">手机号 / 用户名</label>
        <el-input
          v-model="registerForm.username"
          type="text"
          placeholder="请输入手机号或用户名"
          size="large"
        >
          <template #prefix>
            <Phone class="w-5 h-5 text-text-placeholder" />
          </template>
        </el-input>
      </div>

      <div>
        <label class="block text-sm font-medium text-text-secondary mb-1">密码</label>
        <el-input
          v-model="registerForm.password"
          type="password"
          placeholder="创建密码"
          size="large"
          show-password
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-text-secondary mb-1">确认密码</label>
        <el-input
          v-model="registerForm.confirmPassword"
          type="password"
          placeholder="请再次输入密码"
          size="large"
          show-password
          :class="{ 'is-error': !passwordsMatch }"
        />
        <p v-if="!passwordsMatch" class="text-xs mt-1" style="color: var(--color-danger);">两次输入的密码不一致</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-text-secondary mb-1">验证码</label>
        <div class="flex gap-3">
          <el-input
            v-model="registerForm.captcha"
            type="text"
            placeholder="请输入验证码"
            size="large"
            class="flex-1"
          >
            <template #prefix>
              <ShieldCheck class="w-5 h-5 text-text-placeholder" />
            </template>
          </el-input>
          <div
            class="flex items-center justify-center bg-white border border-border-base rounded-lg transition-colors overflow-hidden"
            style="width: 8rem; height: 40px; cursor: pointer;"
            @click="refreshCaptcha"
          >
            <div
              class="text-lg font-bold text-text-secondary select-none flex items-center justify-center bg-white"
              style="width: 100%; height: 100%; letter-spacing: 0.1em; font-style: italic;"
            >
              {{ captchaImage }}
            </div>
          </div>
        </div>
      </div>

      <el-button
        type="primary"
        class="w-full"
        size="large"
        :loading="loading"
        :disabled="loading"
        native-type="submit"
      >
        {{ loading ? '创建中...' : '创建帐户' }}
      </el-button>
    </form>

    <p class="mt-8 text-center text-sm text-text-secondary">
      已有帐户？
      <RouterLink to="/login" class="text-primary font-medium transition-colors" style="margin-left: 0.25rem;">
        登录
      </RouterLink>
    </p>
  </div>
</template>

<style scoped>
.is-error :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--color-danger) inset !important;
}
</style>
