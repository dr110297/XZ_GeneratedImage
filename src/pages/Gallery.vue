<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Search, SlidersHorizontal, ImageOff } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import GalleryCard from '@/components/ui/GalleryCard.vue'
import GalleryModal from '@/components/ui/GalleryModal.vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const activeFilter = ref('全部模型')
const activeStyle = ref('')
const sortBy = ref('hot')
const selectedItem = ref<any>(null)
const gallerySearch = ref('')
const loading = ref(false)

// 图库模拟数据
const GALLERY_ITEMS = Array.from({ length: 24 }).map((_, i) => ({
  id: `gallery_${i}`,
  src: [
    "https://public.youware.com/users-website-assets/prod/faf7c4ec-0acf-42c0-b174-678e35ae8c70/93629169d5504c54b49b89961ff3a71d",
    "https://public.youware.com/users-website-assets/prod/faf7c4ec-0acf-42c0-b174-678e35ae8c70/2dd2239d444142d3afc0fb2db153df7b",
    "https://public.youware.com/users-website-assets/prod/faf7c4ec-0acf-42c0-b174-678e35ae8c70/00bdd1645172419eb35df7fa3dd99321",
    "https://public.youware.com/users-website-assets/prod/faf7c4ec-0acf-42c0-b174-678e35ae8c70/c19331b743f442838b6dd7026c17ae0f"
  ][i % 4],
  title: i % 2 === 0 ? "赛博朋克 2077 风格人物" : "梦幻森林场景",
  prompt: i % 2 === 0 ? "Cyberpunk character, neon lights, high detail, 8k" : "Dreamy forest, magical atmosphere, soft lighting, 8k",
  user: {
    name: `User_${i + 100}`,
    avatar: "https://public.youware.com/users-website-assets/prod/faf7c4ec-0acf-42c0-b174-678e35ae8c70/93629169d5504c54b49b89961ff3a71d"
  },
  likes: Math.floor(Math.random() * 1000),
  runs: Math.floor(Math.random() * 5000),
  height: i % 3 === 0 ? 'aspect-[2/3]' : i % 3 === 1 ? 'aspect-square' : 'aspect-[3/4]',
  type: (i % 4 === 2 ? 'video' : 'image') as 'image' | 'video',
  style: ['Cyberpunk', 'Fantasy', 'Abstract', 'Portrait'][i % 4],
  category: ['Checkpoint', 'LoRA', 'Embedding', 'VAE'][i % 4],
  tags: ['二次元', '写实', '3D', '插画', '风景', '人物', '科幻'].slice(i % 3, i % 3 + 2)
}))

const filteredItems = computed(() => {
  let items = [...GALLERY_ITEMS]

  // 搜索过滤
  if (gallerySearch.value) {
    const searchLower = gallerySearch.value.toLowerCase()
    items = items.filter(item =>
      item.title.toLowerCase().includes(searchLower) ||
      item.prompt.toLowerCase().includes(searchLower) ||
      item.style.toLowerCase().includes(searchLower)
    )
  }

  // 模型类型过滤
  if (activeFilter.value !== '全部模型') {
    items = items.filter(item => item.category === activeFilter.value)
  }

  // 风格标签过滤
  if (activeStyle.value) {
    items = items.filter(item => item.tags.includes(activeStyle.value))
  }

  // 排序
  switch (sortBy.value) {
    case 'hot':
      // 热门推荐
      items.sort((a, b) => (b.likes + b.runs / 10) - (a.likes + a.runs / 10))
      break
    case 'new':
      // 最新发布
      items.reverse()
      break
    case 'likes':
      // 最多喜欢
      items.sort((a, b) => b.likes - a.likes)
      break
    case 'runs':
      // 最多使用
      items.sort((a, b) => b.runs - a.runs)
      break
  }

  return items
})

// 模拟API调用获取图库数据
const fetchGalleryData = async () => {
  loading.value = true
  try {
    // 后端API调用
    // const response = await fetch('/api/gallery', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     search: gallerySearch.value,
    //     filter: activeFilter.value,
    //     style: activeStyle.value,
    //     sortBy: sortBy.value
    //   })
    // })
    // const data = await response.json()

    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 300))

    console.log('正在获取图库数据...', {
      search: gallerySearch.value,
      filter: activeFilter.value,
      style: activeStyle.value,
      sortBy: sortBy.value,
      resultCount: filteredItems.value.length
    })
  } catch (error) {
    ElMessage.error('加载数据失败，请稍后重试')
    console.error('fetchGalleryData error:', error)
  } finally {
    loading.value = false
  }
}

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

// 模型类型筛选点击
const handleFilterChange = async (filter: string) => {
  activeFilter.value = filter
  ElMessage.success(`已切换筛选: ${filter}`)
  await fetchGalleryData()
}

// 热门搜索点击
const handleHotSearchClick = async (tag: string) => {
  gallerySearch.value = tag
  ElMessage.success(`正在搜索 "${tag}"`)
  await fetchGalleryData()
}

// 风格标签点击
const handleStyleClick = async (tag: string) => {
  if (activeStyle.value === tag) {
    activeStyle.value = ''
    ElMessage.info('已取消风格筛选')
  } else {
    activeStyle.value = tag
    ElMessage.success(`已选择风格: ${tag}`)
  }
  await fetchGalleryData()
}

// 排序变化
const handleSortChange = async (value: string) => {
  const sortLabels: Record<string, string> = {
    hot: '热门推荐',
    new: '最新发布',
    likes: '最多喜欢',
    runs: '最多使用'
  }
  ElMessage.success(`已切换排序: ${sortLabels[value]}`)
  await fetchGalleryData()
}

// 加载更多
const handleLoadMore = async () => {
  loading.value = true
  try {
    // 后端API调用
    // const response = await fetch('/api/gallery/more', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ offset: GALLERY_ITEMS.length })
    // })
    // const data = await response.json()

    await new Promise(resolve => setTimeout(resolve, 500))
    ElMessage.success('已加载更多内容')
    console.log('加载更多...')
  } catch (error) {
    ElMessage.error('加载失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-bg-page pt-20 pb-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-8" style="max-width: 1600px;">

      <!-- 浏览画廊页面=>侧边栏筛选 -->
      <aside class="w-64 hidden lg:block flex-shrink-0 space-y-8 sticky overflow-y-auto scrollbar-thin scrollbar-thumb-border-base" style="top: 6rem; height: calc(100vh - 6rem); padding-right: 0.5rem;">
        <div>
          <h3 class="font-bold text-text-primary mb-4 flex items-center gap-2">
            <SlidersHorizontal class="w-4 h-4" /> 筛选
          </h3>
          <div class="space-y-2">
            <button
              v-for="item in ['全部模型', 'Checkpoint', 'LoRA', 'Embedding', 'VAE']"
              :key="item"
              :class="cn(
                'w-full text-left px-3 py-2 rounded-base text-sm transition-colors',
                activeFilter === item
                  ? 'bg-primary text-white font-medium'
                  : 'text-text-secondary hover:bg-bg-card hover:text-text-primary'
              )"
              @click="handleFilterChange(item)"
            >
              {{ item }}
            </button>
          </div>
        </div>

        <div>
          <h3 class="font-bold text-text-primary mb-4">风格</h3>
          <div class="flex flex-wrap gap-2">
            <button @click="handleStyleClick(tag)" v-for="tag in ['二次元', '写实', '3D', '插画', '风景', '人物', '科幻']" :key="tag" class="px-3 py-1 rounded-full bg-bg-card border border-border-base text-xs text-text-secondary hover:border-primary hover:text-primary transition-colors">
              {{ tag }}
            </button>
          </div>
        </div>

        <div>
          <h3 class="font-bold text-text-primary mb-4">排序</h3>
          <el-select v-model="activeFilter" placeholder="选择排序方式" @change="handleSortChange" style="width: 100%;">
            <el-option label="热门推荐" value="hot" />
            <el-option label="最新发布" value="new" />
            <el-option label="最多喜欢" value="likes" />
            <el-option label="最多使用" value="runs" />
          </el-select>
        </div>
      </aside>

      <!-- 浏览画廊页面=>内容区域 -->
      <div class="flex-1">
        <!-- 搜索tag -->
        <div class="mb-8 space-y-4">
          <div class="max-w-2xl">
            <el-input
              v-model="gallerySearch"
              placeholder="搜索模型、图片、灵感..."
              size="large"
              class="w-full search-input-round"
            >
              <template #prefix>
                <Search class="w-5 h-5 text-text-secondary" />
              </template>
            </el-input>
          </div>
          <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <span class="text-sm text-text-secondary whitespace-nowrap">热门搜索:</span>
            <button @click="handleHotSearchClick(tag)" v-for="tag in ['Cyberpunk', 'Ghibli', 'Portrait', 'Landscape', 'Mecha', 'Watercolor']" :key="tag" class="px-4 py-1.5 rounded-full bg-bg-card border border-border-base text-sm text-text-secondary hover:bg-primary hover:text-white hover:border-primary transition-all whitespace-nowrap" style="flex-shrink: 0;">
              {{ tag }}
            </button>
          </div>
        </div>

        <!-- 卡片信息 -->
        <div v-if="filteredItems.length > 0" class="columns-2 md:columns-3 xl:columns-4 gap-6 space-y-6">
          <GalleryCard
            v-for="item in filteredItems"
            :key="item.id"
            :item="item"
            :aspect-ratio="item.height"
            class="break-inside-avoid"
            @click="selectedItem = item"
          />
        </div>

        <!-- 空状态 -->
        <div v-else class="flex flex-col items-center justify-center py-20 px-4">
          <div class="w-24 h-24 rounded-full bg-bg-card border-2 border-border-base flex items-center justify-center mb-6 shadow-sm">
            <ImageOff class="w-12 h-12 text-text-secondary" style="opacity: 0.5;" />
          </div>
          <h3 class="text-xl font-bold text-text-primary mb-2">暂无图片</h3>
          <p class="text-text-secondary mb-6 text-center max-w-md">
            {{ gallerySearch ? `未找到与 "${gallerySearch}" 相关的内容` : '当前筛选条件下没有找到图片' }}
          </p>
          <div class="flex gap-3">
            <el-button @click="gallerySearch = ''; activeStyle = ''; activeFilter = '全部模型'" class="rounded-base">
              清除筛选
            </el-button>
            <el-button type="primary" @click="router.push('/generate')" class="rounded-base">
              去生成图片
            </el-button>
          </div>
        </div>

        <div v-if="filteredItems.length > 0" class="mt-12 text-center">
          <el-button @click="handleLoadMore" class="rounded-full px-8 py-3">
            加载更多
          </el-button>
        </div>
      </div>
    </div>
    <!-- 卡片内容弹窗 -->
    <GalleryModal
      :isOpen="!!selectedItem"
      :item="selectedItem"
      @close="selectedItem = null"
      @use="handleUseTemplate"
      @edit="handleEditTemplate"
    />
  </div>
</template>

<style scoped>
/* 确保横向滚动功能 */
.scrollbar-hide {
  display: flex;
  flex-wrap: nowrap;
}
</style>
