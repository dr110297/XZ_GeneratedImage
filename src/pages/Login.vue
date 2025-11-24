<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { Phone } from 'lucide-vue-next'
import { ElMessage } from 'element-plus'

const router = useRouter()

// 表单数据
const loginForm = ref({
  username: '',
  password: ''
})

// 加载状态
const loading = ref(false)

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

  loading.value = true

  try {
    // 后端接口登录验证
    // const response = await loginAPI(loginForm.value)

    // 模拟登录延迟
    await new Promise(resolve => setTimeout(resolve, 1000))

    ElMessage.success('登录成功')
    router.push('/')
  } catch (error) {
    ElMessage.error('登录失败，请检查用户名和密码')
  } finally {
    loading.value = false
  }
}

// 忘记密码
const handleForgotPassword = () => {
  ElMessage.info('忘记密码功能开发中...')
}
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
