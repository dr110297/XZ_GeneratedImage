<script setup lang="ts">
import { computed } from 'vue'
import { Heart, Play, Copy, Check } from 'lucide-vue-next'
import Dialog from '@/components/ui/Dialog.vue'
import { store } from '@/store/favorites'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  isOpen: boolean
  item: any
}>()

const emit = defineEmits(['close', 'use', 'edit'])

const isFavorite = computed(() => props.item && store.isFavorite(props.item.id))
const copied = ref(false)

const toggleFavorite = () => {
  if (props.item) {
    store.toggleFavorite(props.item)
    if (isFavorite.value) {
      ElMessage.success('收藏成功')
    } else {
      ElMessage.info('已取消收藏')
    }
  }
}

const copyPrompt = () => {
  if (props.item?.prompt) {
    navigator.clipboard.writeText(props.item.prompt)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  }
}
</script>

<template>
  <!-- 卡片弹窗内容 -->
  <Dialog
    :isOpen="isOpen"
    @close="$emit('close')"
    :title="item?.title || '作品详情'"
    width="60%"
  >
    <div class="flex flex-col md:flex-row gap-6" v-if="item">
      <div class="w-full md:w-1/2 space-y-4">
        <div class="aspect-[2/3] rounded-base overflow-hidden bg-bg-page border border-border-base relative group">
          <img 
            :src="item.src" 
            :alt="item.title" 
            class="w-full h-full object-cover"
          />
          <div v-if="item.type === 'video'" class="absolute inset-0 flex items-center justify-center bg-black/30">
            <Play class="w-12 h-12 text-white fill-white/50" />
          </div>
          
          <div class="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              @click="toggleFavorite"
              class="p-2 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-primary transition-colors"
              :class="{ 'bg-primary text-white': isFavorite }"
            >
              <Heart class="w-5 h-5" :class="{ 'fill-current': isFavorite }" />
            </button>
          </div>
        </div>
      </div>
      
      <div class="w-full md:w-1/2 space-y-6">
        <div v-if="item.user" class="flex items-center gap-3 pb-4 border-b border-border-base">
          <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
            <img v-if="item.user.avatar" :src="item.user.avatar" class="w-full h-full object-cover" />
            <span v-else class="text-primary font-bold">{{ item.user.name[0] }}</span>
          </div>
          <div>
            <h3 class="font-bold text-text-primary">{{ item.title || '未命名作品' }}</h3>
            <p class="text-sm text-text-secondary">by {{ item.user.name }}</p>
          </div>
        </div>

        <div v-if="item.style">
          <label class="text-sm font-medium text-text-secondary block mb-2">风格</label>
          <div class="px-3 py-2 bg-bg-page rounded-base text-primary border border-primary/30 inline-block">
            {{ item.style }}
          </div>
        </div>
        
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-sm font-medium text-text-secondary">提示词</label>
            <button 
              @click="copyPrompt"
              class="text-xs flex items-center gap-1 text-primary hover:text-primary-hover transition-colors"
            >
              <component :is="copied ? Check : Copy" class="w-3 h-3" />
              {{ copied ? '已复制' : '复制' }}
            </button>
          </div>
          <div class="p-3 bg-bg-page rounded-base text-text-primary border border-border-base text-sm leading-relaxed h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-border-base">
            {{ item.prompt }}
          </div>
        </div>

        <div v-if="item.likes !== undefined" class="grid grid-cols-2 gap-4">
          <div class="p-3 bg-bg-page rounded-base border border-border-base text-center">
            <div class="text-text-secondary text-xs mb-1">喜欢</div>
            <div class="text-text-primary font-bold">{{ item.likes }}</div>
          </div>
          <div class="p-3 bg-bg-page rounded-base border border-border-base text-center">
            <div class="text-text-secondary text-xs mb-1">使用</div>
            <div class="text-text-primary font-bold">{{ item.runs }}</div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex items-center justify-between w-full">
        <button 
          @click="toggleFavorite"
          class="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors md:hidden"
        >
          <Heart class="w-5 h-5" :class="{ 'fill-current text-primary': isFavorite }" />
          <span class="text-sm">{{ isFavorite ? '已收藏' : '收藏' }}</span>
        </button>
        
        <div class="flex gap-3 ml-auto">
          <!-- <button 
            @click="$emit('use', item)"
            class="el-button el-button-default px-4 py-2 rounded-base"
          >
            模板生成
          </button> -->
          <button 
            @click="$emit('edit', item)"
            class="el-button el-button-primary px-4 py-2 rounded-base"
          >
            使用此模板
          </button>
        </div>
      </div>
    </template>
  </Dialog>
</template>
