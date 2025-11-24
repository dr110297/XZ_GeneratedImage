<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { Menu, X } from 'lucide-vue-next'
import logo from '@/assets/logo.png'

const isMenuOpen = ref(false)
</script>

<template>
  <div class="min-h-screen bg-bg-page text-text-primary font-sans">
    <!-- Navbar -->
    <nav class="fixed top-0 w-full z-50 border-b border-border-base bg-bg-base/80 backdrop-blur-md shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <RouterLink to="/" class="flex items-center gap-2 group">
            <img :src="logo" alt="Logo" class="w-8 h-8 object-contain" />
            <span class="text-xl font-bold text-primary">
              xzTimes
            </span>
          </RouterLink>

          <!-- Desktop Nav -->
          <div class="hidden md:flex items-center gap-8">
            <RouterLink to="/" class="text-sm font-medium text-text-secondary hover:text-primary transition-all">
              首页
            </RouterLink>
            <RouterLink to="/gallery" class="text-sm font-medium text-text-secondary hover:text-primary transition-all">
              浏览画廊
            </RouterLink>
            <RouterLink to="/generate" class="text-sm font-medium text-text-secondary hover:text-primary transition-all">
              AI生成
            </RouterLink>
            <RouterLink to="/profile" class="text-sm font-medium text-text-secondary hover:text-primary transition-all">
              个人资料
            </RouterLink>
          </div>

          <!-- Auth Buttons -->
          <div class="hidden md:flex items-center gap-4">
            <RouterLink
              to="/login"
              class="text-sm font-medium text-text-secondary hover:text-primary transition-colors"
            >
              登录
            </RouterLink>
            <el-button
              type="primary"
              class="rounded-full px-4 py-2"
              @click="$router.push('/register')"
            >
              注册
            </el-button>
          </div>

          <!-- Mobile Menu Button -->
          <button 
            class="md:hidden p-2 text-text-secondary hover:text-primary"
            @click="isMenuOpen = !isMenuOpen"
          >
            <X v-if="isMenuOpen" class="w-6 h-6" />
            <Menu v-else class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="isMenuOpen" class="md:hidden border-t border-border-base bg-bg-base">
        <div class="px-4 pt-2 pb-6 space-y-1">
          <RouterLink 
            to="/" 
            class="block px-3 py-2 text-base font-medium text-text-secondary hover:text-primary hover:bg-bg-page rounded-md"
            @click="isMenuOpen = false"
          >
            首页
          </RouterLink>
          <RouterLink 
            to="/gallery" 
            class="block px-3 py-2 text-base font-medium text-text-secondary hover:text-primary hover:bg-bg-page rounded-md"
            @click="isMenuOpen = false"
          >
            浏览画廊
          </RouterLink>
          <RouterLink 
            to="/generate" 
            class="block px-3 py-2 text-base font-medium text-text-secondary hover:text-primary hover:bg-bg-page rounded-md"
            @click="isMenuOpen = false"
          >
            AI生成
          </RouterLink>
          <RouterLink 
            to="/profile" 
            class="block px-3 py-2 text-base font-medium text-text-secondary hover:text-primary hover:bg-bg-page rounded-md"
            @click="isMenuOpen = false"
          >
            个人资料
          </RouterLink>
          <div class="pt-4 flex flex-col gap-2">
            <RouterLink 
              to="/login" 
              class="block w-full px-3 py-2 text-center text-base font-medium text-text-secondary hover:text-primary hover:bg-bg-page rounded-md"
              @click="isMenuOpen = false"
            >
              登录
            </RouterLink>
            <RouterLink 
              to="/register" 
              class="block w-full px-3 py-2 text-center text-base font-medium bg-primary text-white rounded-md hover:bg-primary-hover shadow-sm"
              @click="isMenuOpen = false"
            >
              注册
            </RouterLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="pt-16">
      <RouterView />
    </main>

    <!-- Footer -->
    <footer class="border-t border-border-base bg-bg-base py-12 mt-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="space-y-4">
            <div class="flex items-center gap-2">
              <img :src="logo" alt="Logo" class="w-6 h-6 object-contain" />
              <span class="text-lg font-bold text-text-primary">xzTimes</span>
            </div>
            <p class="text-sm text-text-secondary">
              小智时代专为跨境而生。
            </p>
          </div>
          
          <div>
            <h3 class="text-sm font-semibold text-text-primary mb-4">产品</h3>
            <ul class="space-y-2 text-sm text-text-secondary">
              <li><RouterLink to="/generate" class="hover:text-primary transition-colors">生成器</RouterLink></li>
              <li><RouterLink to="/gallery" class="hover:text-primary transition-colors">画廊</RouterLink></li>
            </ul>
          </div>

          <div>
            <h3 class="text-sm font-semibold text-text-primary mb-4">公司</h3>
            <ul class="space-y-2 text-sm text-text-secondary">
              <li><RouterLink to="#" class="hover:text-primary transition-colors">关于我们</RouterLink></li>
              <li><RouterLink to="#" class="hover:text-primary transition-colors">博客</RouterLink></li>
              <li><RouterLink to="#" class="hover:text-primary transition-colors">招聘</RouterLink></li>
            </ul>
          </div>

          <div>
            <h3 class="text-sm font-semibold text-text-primary mb-4">法律</h3>
            <ul class="space-y-2 text-sm text-text-secondary">
              <li><RouterLink to="#" class="hover:text-primary transition-colors">隐私政策</RouterLink></li>
              <li><RouterLink to="#" class="hover:text-primary transition-colors">服务条款</RouterLink></li>
            </ul>
          </div>
        </div>
        <div class="mt-12 pt-8 border-t border-border-base text-center text-sm text-text-secondary">
          © {{ new Date().getFullYear() }} xzTimes. 保留所有权利。
        </div>
      </div>
    </footer>
  </div>
</template>
