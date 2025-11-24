<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { User, Heart, Camera, Mail, Star, Plus } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { store } from '@/store/favorites'
import GalleryCard from '@/components/ui/GalleryCard.vue'
import GalleryModal from '@/components/ui/GalleryModal.vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const activeTab = ref('profile')
const selectedFavorite = ref<any>(null)

// 个人资料表单数据
const profileForm = ref({
  displayName: 'John Doe',
  email: 'john@example.com',
  title: '',
  bio: '',
  website: '',
  github: ''
})

// 积分信息
const credits = ref(850)

// 直接使用所有收藏
const favorites = computed(() => store.favorites)

const handleUseTemplate = (item: any) => {
  if (item) {
    router.push({
      path: '/generate',
      state: {
        prompt: item.prompt,
        referenceImage: item.src,
        autoGenerate: true
      }
    })
  }
}

const handleEditTemplate = (item: any) => {
  if (item) {
    router.push({
      path: '/generate',
      state: {
        prompt: item.prompt,
        referenceImage: item.src,
        autoGenerate: false
      }
    })
  }
}

const navigateToGallery = () => {
  router.push('/gallery')
}

// 取消收藏
const handleUnfavorite = (item: any) => {
  if (item && confirm('确定要取消收藏这张图片吗？')) {
    store.removeFavorite(item.id)
    ElMessage.info('已取消收藏')
    // 如果当前正在查看这个收藏项，关闭弹窗
    if (selectedFavorite.value?.id === item.id) {
      selectedFavorite.value = null
    }
  }
}

// 保存个人资料
const handleSaveProfile = async () => {
  // 调用接口保存个人资料
  try {
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 500))
    ElMessage.success('个人资料保存成功')
  } catch (error) {
    ElMessage.error('保存失败，请稍后再试')
  }
}

// 处理充值
const handleRecharge = () => {
  ElMessage.info('充值功能开发中...')
}

// 处理头像上传
const handleAvatarUpload = () => {
  ElMessage.info('头像上传功能开发中...')
}
</script>

<template>
  <div class="p-4 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="bg-bg-base rounded-base border border-border-base p-4 shadow-lg mb-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-6" style="backdrop-filter: blur(12px); background-color: rgba(255, 255, 255, 0.5);">
      <div class="flex items-center gap-6">
        <div class="relative cursor-pointer" style="width: 6rem; height: 6rem;">
          <div class="w-full h-full rounded-full bg-primary flex items-center justify-center text-3xl font-bold text-white overflow-hidden shadow-glow" style="background-color: rgba(37, 99, 235, 0.1); border: 2px solid var(--color-primary);" @click="handleAvatarUpload">
            <span style="color: var(--color-primary);">JD</span>
          </div>
          <div class="absolute inset-0 bg-black rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity" style="background-color: rgba(0, 0, 0, 0.4);" @click="handleAvatarUpload">
            <Camera class="w-8 h-8 text-white" />
          </div>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-text-primary mb-1" style="text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);">{{ profileForm.displayName }}</h1>
          <p class="text-text-secondary flex items-center gap-2">
            <Mail class="w-4 h-4" /> {{ profileForm.email }}
          </p>
        </div>
      </div>
      <div class="flex items-center gap-4 bg-bg-card p-4 rounded-base border border-border-base" style="box-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);">
        <div class="text-right">
          <p class="text-xs text-text-secondary font-semibold" style="text-transform: uppercase;">剩余积分</p>
          <p class="text-2xl font-bold text-primary" style="text-shadow: 0 0 5px rgba(59, 130, 246, 0.8);">{{ credits }}</p>
        </div>
        <el-button type="primary" @click="handleRecharge" class="rounded-base text-sm shadow-glow px-4 py-2">
          充值
        </el-button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="bg-bg-base rounded-base border border-border-base shadow-lg overflow-hidden" style="min-height: 600px; backdrop-filter: blur(12px); background-color: rgba(255, 255, 255, 0.5);">
      <div class="flex items-center border-b border-border-base px-6">
        <button
          v-for="tab in [
            { id: 'profile', label: '个人资料', icon: User },
            { id: 'favorites', label: '我的收藏', icon: Star },
          ]"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="cn(
            'flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2',
            activeTab === tab.id
              ? 'border-primary text-primary bg-primary shadow-glow'
              : 'border-transparent text-text-secondary hover:text-primary hover:bg-white'
          )"
          :style="activeTab === tab.id ? 'background-color: rgba(37, 99, 235, 0.1); box-shadow: inset 0 -2px 4px rgba(59, 130, 246, 0.2); margin-bottom: -1px;' : 'margin-bottom: -1px;'"
        >
          <component :is="tab.icon" class="w-4 h-4" />
          {{ tab.label }}
        </button>
      </div>

      <div class="p-4">
        <!-- Profile Tab -->
        <div v-if="activeTab === 'profile'" class="max-w-3xl" style="animation: fadeIn 0.3s ease-out;">
          <h2 class="text-lg font-bold text-text-primary mb-3 pb-2 border-b border-border-base">基本信息</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-3">
            <div class="space-y-2">
              <label class="text-sm font-medium text-text-secondary">显示名称</label>
              <el-input v-model="profileForm.displayName" placeholder="请输入显示名称" />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-text-secondary">职业 / 头衔</label>
              <el-input v-model="profileForm.title" placeholder="请输入" />
            </div>
            <div class="space-y-2" style="grid-column: 1 / -1;">
              <label class="text-sm font-medium text-text-secondary">个人简介</label>
              <el-input
                v-model="profileForm.bio"
                type="textarea"
                :rows="4"
                placeholder="介绍一下你自己..."
              />
            </div>
          </div>

          <h2 class="text-lg font-bold text-text-primary mb-3 pb-2 border-b border-border-base">社交链接</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-3">
            <div class="space-y-2">
              <label class="text-sm font-medium text-text-secondary flex items-center gap-2">
                邮箱
              </label>
              <el-input v-model="profileForm.website" placeholder="https://" />
            </div>
          </div>

          <div class="flex justify-end pt-4">
            <el-button type="primary" @click="handleSaveProfile" class="shadow-glow px-6 py-2 rounded-base">
              保存更改
            </el-button>
          </div>
        </div>

        <!-- Favorites Tab -->
        <div v-if="activeTab === 'favorites'" class="h-full" style="animation: fadeIn 0.3s ease-out;">
          <!-- 收藏统计头部 -->
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <h2 class="text-xl font-bold text-text-primary">
                我的收藏
              </h2>
              <div class="text-primary">({{ favorites.length }})</div>
            </div>
            <el-button
              type="primary"
              @click="navigateToGallery"
              class="flex items-center gap-2 px-4 py-2 rounded-base"
            >
              <Plus class="w-4 h-4" />
              浏览更多
            </el-button>
          </div>

          <!-- 收藏图片区域 - 添加滚动容器 -->
          <div class="favorites-scroll-container">
            <!-- 收藏图片网格 -->
            <div v-if="favorites.length > 0" class="grid grid-cols-4 xl:grid-cols-5 gap-2">
              <GalleryCard
                v-for="item in favorites"
                :key="item.id"
                :item="item"
                aspect-ratio="aspect-square"
                @click="selectedFavorite = item"
                @unfavorite="handleUnfavorite"
              />
            </div>

            <!-- 收藏为空 -->
            <div v-else class="flex flex-col items-center justify-center text-text-secondary" style="padding-top: 5rem; padding-bottom: 5rem;">
              <div class="w-16 h-16 rounded-full bg-bg-card border border-border-base flex items-center justify-center mb-4">
                <Heart class="w-8 h-8" style="color: rgba(75, 85, 99, 0.5);" />
              </div>
              <p class="mb-4 text-lg">暂无收藏内容</p>
              <p class="text-sm mb-3" style="color: rgba(75, 85, 99, 0.7);">去画廊发现并收藏你喜欢的作品吧</p>
              <el-button
                type="primary"
                @click="navigateToGallery"
                class="px-6 py-3 rounded-base flex items-center gap-2"
              >
                <Plus class="w-4 h-4" />
                去画廊看看
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 卡片内容弹窗 -->
    <GalleryModal
      :isOpen="!!selectedFavorite"
      :item="selectedFavorite"
      @close="selectedFavorite = null"
      @use="handleUseTemplate"
      @edit="handleEditTemplate"
      @unfavorite="handleUnfavorite"
    />
  </div>
</template>

<style scoped>
/* 收藏区域滚动容器样式 */
.favorites-scroll-container {
  max-height: calc(100vh - 19rem);
  overflow-y: auto;
  padding-right: 8px;
}

/* 收藏区域图片卡片固定尺寸 */
.favorites-scroll-container :deep(.group) {
  max-width: 250px;
  font-size: 0.875rem;
}

/* 图片容器固定高度 */
.favorites-scroll-container :deep(.aspect-square) {
  width: 250px;
  height: 240px;
}

/* 收藏区域的图片卡片内边距优化 */
.favorites-scroll-container :deep(.p-3) {
  padding: 0.5rem;
}

.favorites-scroll-container :deep(.p-4) {
  padding: 0.5rem;
}

/* 自定义滚动条样式 */
.favorites-scroll-container::-webkit-scrollbar {
  width: 6px;
}

.favorites-scroll-container::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.favorites-scroll-container::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.3);
  border-radius: 3px;
  transition: background 0.2s ease;
}

.favorites-scroll-container::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.5);
}

/* Firefox 滚动条样式 */
.favorites-scroll-container {
  scrollbar-width: thin;
  scrollbar-color: rgba(59, 130, 246, 0.3) rgba(0, 0, 0, 0.05);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(1rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
