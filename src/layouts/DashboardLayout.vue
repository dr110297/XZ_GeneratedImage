<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { Image as ImageIcon, User, LogOut, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { ElMessage, ElMessageBox } from 'element-plus'
import { cn } from '@/lib/utils'
import { logoutAndClear } from '@/api/login'
import logo from '@/assets/logo.png'

const route = useRoute()
const router = useRouter()
const isCollapsed = ref(true)

const navItems = [
  { icon: ImageIcon, label: '生成', href: '/generate' },
  { icon: User, label: '个人资料', href: '/profile' },
]

// 退出登录
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await logoutAndClear()
    ElMessage.success('退出登录成功')
    router.push('/login')
  } catch (error) {
    // 用户点击取消或退出登录失败
    if (error !== 'cancel') {
      console.error('退出登录失败:', error)
    }
  }
}
</script>

<template>
  <div class="min-h-screen bg-bg-page text-text-primary flex">
    <!-- Sidebar -->
    <aside 
      :class="cn(
        'border-r border-border-base bg-bg-base hidden md:flex flex-col shadow-lg z-10 transition-all duration-300 relative',
        isCollapsed ? 'w-20' : 'w-64'
      )"
    >
      <!-- Collapse Toggle -->
      <button
        @click="isCollapsed = !isCollapsed"
        class="absolute -right-3 top-8 bg-bg-base border border-border-base rounded-full p-1 text-text-secondary hover:text-primary shadow-sm z-20"
      >
        <ChevronRight v-if="isCollapsed" class="w-4 h-4" />
        <ChevronLeft v-else class="w-4 h-4" />
      </button>

      <div :class="cn('p-6 border-b border-border-base flex items-center', isCollapsed ? 'justify-center' : 'gap-2')">
        <RouterLink to="/" class="flex items-center gap-2 group">
          <img :src="logo" alt="Logo" class="w-8 h-8 object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
          <span v-if="!isCollapsed" class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 whitespace-nowrap">
            xzTimes
          </span>
        </RouterLink>
      </div>

      <nav class="flex-1 px-4 py-6 space-y-1">
        <RouterLink
          v-for="item in navItems"
          :key="item.label"
          :to="item.href"
          :class="cn(
            'flex items-center gap-3 px-3 py-3 rounded-base text-sm font-medium transition-all duration-200',
            route.path === item.href
              ? 'bg-primary/10 text-primary border border-primary/20 shadow-glow'
              : 'text-text-secondary hover:text-primary hover:bg-white/5',
            isCollapsed && 'justify-center px-2'
          )"
          :title="isCollapsed ? item.label : undefined"
        >
          <component :is="item.icon" class="w-5 h-5 shrink-0" />
          <span v-if="!isCollapsed" class="whitespace-nowrap">{{ item.label }}</span>
        </RouterLink>
      </nav>

      <div class="p-4 border-t border-border-base">
        <button
          @click="handleLogout"
          :class="cn(
            'flex items-center gap-3 px-3 py-2 w-full rounded-base text-sm font-medium text-text-secondary hover:text-danger hover:bg-danger/10 transition-colors',
            isCollapsed && 'justify-center px-2'
          )"
          :title="isCollapsed ? '退出登录' : undefined"
        >
          <LogOut class="w-5 h-5 shrink-0" />
          <span v-if="!isCollapsed" class="whitespace-nowrap">退出登录</span>
        </button>
      </div>
    </aside>

    <!-- Mobile Header -->
    <div class="md:hidden fixed top-0 w-full z-50 bg-bg-base border-b border-border-base px-4 h-16 flex items-center justify-between shadow-md">
      <RouterLink to="/" class="flex items-center gap-2">
        <img :src="logo" alt="Logo" class="w-8 h-8 object-contain" />
        <span class="text-xl font-bold text-primary">xzTimes</span>
      </RouterLink>
      <!-- Mobile menu trigger would go here -->
    </div>

    <!-- Main Content -->
    <main class="flex-1 md:pt-0 overflow-auto bg-bg-page relative">
      <!-- Ambient Background -->
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
      <div class="relative z-10 h-full">
        <RouterView />
      </div>
    </main>
  </div>
</template>
