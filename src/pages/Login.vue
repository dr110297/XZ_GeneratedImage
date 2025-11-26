<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { Phone, ShieldCheck } from 'lucide-vue-next'
import { ElMessage } from 'element-plus'
import { loginAndSaveToken, getCaptcha } from '@/api/login'

const router = useRouter()

// 表单数据
const loginForm = ref({
  username: '',
  password: '',
  code: '',
  uuid: ''
})

// 验证码相关
const captchaImage = ref('')
const captchaEnabled = ref(true)

// 加载状态
const loading = ref(false)
const captchaLoading = ref(false)

// 获取验证码
const refreshCaptcha = async () => {
  captchaLoading.value = true
  try {
    const res = await getCaptcha()
    if (res.code === 200) {
      captchaEnabled.value = res.captchaEnabled !== false
      if (captchaEnabled.value) {
        captchaImage.value = 'data:image/gif;base64,' + res.img
        loginForm.value.uuid = res.uuid
      }
    }
  } catch (error) {
    console.error('获取验证码失败:', error)
  } finally {
    captchaLoading.value = false
  }
}

// 登录方法
const handleLogin = async () => {
  if (!loginForm.value.username) {
    ElMessage.warning('请输入手机号或用户名')
    return
  }
  if (!loginForm.value.password) {
    ElMessage.warning('请输入密码')
    return
  }
  if (captchaEnabled.value && !loginForm.value.code) {
    ElMessage.warning('请输入验证码')
    return
  }

  loading.value = true

  try {
    const res = await loginAndSaveToken(
      loginForm.value.username,
      loginForm.value.password,
      loginForm.value.code,
      loginForm.value.uuid
    )

    if (res.code === 200) {
      ElMessage.success('登录成功')
      router.push('/')
    } else {
      // 登录失败，刷新验证码
      if (captchaEnabled.value) {
        refreshCaptcha()
      }
    }
  } catch (error: any) {
    console.error('登录失败:', error)
    // 登录失败，刷新验证码
    if (captchaEnabled.value) {
      refreshCaptcha()
    }
  } finally {
    loading.value = false
  }
}

// 忘记密码
const handleForgotPassword = () => {
  ElMessage.info('忘记密码功能开发中...')
}

// 组件挂载时获取验证码
onMounted(() => {
  refreshCaptcha()
})
</script>

<template>
  <div class="w-full">
    <div class="text-center mb-8">
      <h1 class="text-2xl font-bold text-text-primary mb-2">欢迎回来</h1>
      <p class="text-text-secondary">输入您的详细信息以访问您的帐户</p>
    </div>

    <form class="space-y-4" @submit.prevent="handleLogin">
      <div>
        <label class="block text-sm font-medium text-text-secondary mb-1">手机号 / 用户名</label>
        <el-input
          v-model="loginForm.username"
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
        <div class="flex items-center justify-between mb-1">
          <label class="block text-sm font-medium text-text-secondary">密码</label>
          <a
            href="javascript:void(0)"
            @click="handleForgotPassword"
            class="text-sm text-primary transition-colors"
            style="cursor: pointer;"
          >
            忘记密码？
          </a>
        </div>
        <el-input
          v-model="loginForm.password"
          type="password"
          placeholder="••••••••"
          size="large"
          show-password
        />
      </div>

      <!-- 验证码 -->
      <div v-if="captchaEnabled">
        <label class="block text-sm font-medium text-text-secondary mb-1">验证码</label>
        <div class="flex gap-3">
          <el-input
            v-model="loginForm.code"
            type="text"
            placeholder="请输入验证码"
            size="large"
            class="flex-1"
            @keyup.enter="handleLogin"
          >
            <template #prefix>
              <ShieldCheck class="w-5 h-5 text-text-placeholder" />
            </template>
          </el-input>
          <div
            class="flex items-center justify-center bg-white border border-border-base rounded-lg transition-colors overflow-hidden"
            style="width: 8rem; height: 40px; cursor: pointer;"
            @click="refreshCaptcha"
            title="点击刷新验证码"
          >
            <img
              v-if="captchaImage"
              :src="captchaImage"
              alt="验证码"
              class="h-full w-full object-cover"
            />
            <span v-else class="text-text-secondary text-sm">
              {{ captchaLoading ? '加载中...' : '点击获取' }}
            </span>
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
        {{ loading ? '登录中...' : '登录' }}
      </el-button>
    </form>

    <p class="mt-8 text-center text-sm text-text-secondary">
      还没有帐户？
      <RouterLink to="/register" class="text-primary font-medium transition-colors" style="margin-left: 0.25rem;">
        注册
      </RouterLink>
    </p>
  </div>
</template>

<style scoped>
a:hover {
  color: var(--color-primary-hover);
}
</style>
