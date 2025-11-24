<script setup lang="ts">
import { computed } from 'vue'
import { Heart, Download, Play } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { store } from '@/store/favorites'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  item: {
    id: string | number
    src: string
    title?: string
    prompt?: string
    type: 'image' | 'video'
    style?: string
    user?: { name: string; avatar?: string }
    likes?: number
    runs?: number
  }
  aspectRatio?: string
}>()

const emit = defineEmits(['click', 'download'])

const isFavorite = computed(() => store.isFavorite(props.item.id))

const toggleFavorite = (e: Event) => {
  e.stopPropagation()
  store.toggleFavorite(props.item)
  if (isFavorite.value) {
    ElMessage.success('收藏成功')
  } else {
    ElMessage.info('已取消收藏')
  }
}

const handleDownload = (e: Event) => {
  e.stopPropagation()
  emit('download', props.item)
  
  // 在新窗口中打开下载
  window.open(props.item.src, '_blank')
}
</script>

<template>
  <div 
    class="group relative rounded-base overflow-hidden bg-bg-card border border-border-base shadow-sm hover:shadow-glow transition-all duration-300 cursor-pointer"
    @click="$emit('click', item)"
  >
    <!-- Image/Video -->
    <div :class="cn('w-full relative overflow-hidden', aspectRatio || 'aspect-square')">
      <img 
        :src="item.src" 
        :alt="item.title || 'Gallery Item'" 
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />
      
      <!-- Video Indicator -->
      <div v-if="item.type === 'video'" class="absolute top-2 right-2 bg-black/50 backdrop-blur-sm p-1.5 rounded-full z-10">
        <Play class="w-4 h-4 text-white fill-white" />
      </div>

      <!-- Overlay Actions -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <div class="flex items-center justify-between transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <div class="flex gap-2">
            <button 
              @click="toggleFavorite"
              :class="cn(
                'p-2 rounded-full backdrop-blur-md transition-colors',
                isFavorite ? 'bg-primary text-white' : 'bg-white/20 text-white hover:bg-primary'
              )" 
              title="收藏"
            >
              <Heart :class="cn('w-4 h-4', isFavorite && 'fill-current')" />
            </button>
            <button 
              v-if="item.type === 'video'"
              class="p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-primary hover:text-white transition-colors" 
              title="播放"
            >
              <Play class="w-4 h-4 fill-current" />
            </button>
          </div>
          <button 
            @click="handleDownload"
            class="p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-primary hover:text-white transition-colors"
            title="下载"
          >
            <Download class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Info (Optional slot or default) -->
    <div v-if="$slots.info || item.title || item.prompt" class="p-3 bg-bg-card border-t border-border-base">
      <slot name="info">
        <h4 v-if="item.title" class="text-sm font-medium text-text-primary truncate mb-1">{{ item.title }}</h4>
        <p v-if="item.prompt" class="text-xs text-text-secondary truncate">{{ item.prompt }}</p>
      </slot>
    </div>
  </div>
</template>
