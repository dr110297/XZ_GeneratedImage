<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  Image as ImageIcon,
  Download,
  Wand2,
  X,
  Palette,
  Layout,
  Layers,
  Sparkles,
  CheckSquare,
  Square,
  Clock,
  ChevronRight,
  ChevronLeft,
  Video,
  Search,
  Grid,
  MessageSquare,
  User,
  Home
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { useRouter } from 'vue-router'
import GalleryCard from '@/components/ui/GalleryCard.vue'
import GalleryModal from '@/components/ui/GalleryModal.vue'

const router = useRouter()

const STYLES = [
  { id: 'cyberpunk', name: '赛博朋克', color: 'from-blue-500 to-purple-500' },
  { id: 'anime', name: '日系动漫', color: 'from-pink-500 to-rose-500' },
  { id: 'realistic', name: '超写实', color: 'from-green-500 to-emerald-500' },
  { id: 'oil', name: '油画风格', color: 'from-yellow-500 to-orange-500' },
  { id: '3d', name: '3D 渲染', color: 'from-indigo-500 to-blue-500' },
  { id: 'sketch', name: '素描手绘', color: 'from-gray-500 to-slate-500' },
]

const ASPECT_RATIOS = [
  { label: '1:1', value: '1:1'},
  { label: '2:3', value: '2:3'},
  { label: '3:2', value: '3:2'},
  { label: '4:5', value: '4:5'},
  { label: '5:4', value: '5:4'},
  { label: '9:16', value: '9:16'},
  { label: '16:9', value: '16:9'},
  { label: '21:9', value: '21:9'},
]

// Types
interface Message {
  id: string
  role: 'user' | 'assistant'
  content?: string
  images?: string[]
  referenceImage?: string
}

interface HistorySession {
  id: string
  date: string
  firstPrompt: string
  firstImage?: string
  totalImages: number
  messages: Message[]
}

// 历史记录=>模拟数据
const HISTORY_SESSIONS: HistorySession[] = [
  {
    id: 'session_1',
    date: new Date().toISOString(),
    firstPrompt: "一只穿着宇航服的猫在月球上弹吉他，背景是地球，赛博朋克风格，霓虹灯光，高细节，8k分辨率。这只猫的表情非常专注，吉他是透明的发光材质。",
    firstImage: "https://public.youware.com/users-website-assets/prod/faf7c4ec-0acf-42c0-b174-678e35ae8c70/93629169d5504c54b49b89961ff3a71d",
    totalImages: 4,
    messages: [//暂时按数组顺序排列历史回复数据
      // 第一条记录
      {
        id: 'msg_1_1',
        role: 'user',//用户角色
        content: "一只穿着宇航服的猫在月球上弹吉他，背景是地球，赛博朋克风格，霓虹灯光，高细节，8k分辨率。这只猫的表情非常专注，吉他是透明的发光材质。",
        referenceImage: "https://public.youware.com/users-website-assets/prod/faf7c4ec-0acf-42c0-b174-678e35ae8c70/93629169d5504c54b49b89961ff3a71d"
      },
      {
        id: 'msg_1_2',
        role: 'assistant',//回复角色
        images: [
          "https://public.youware.com/users-website-assets/prod/faf7c4ec-0acf-42c0-b174-678e35ae8c70/93629169d5504c54b49b89961ff3a71d",
          "https://public.youware.com/users-website-assets/prod/faf7c4ec-0acf-42c0-b174-678e35ae8c70/93629169d5504c54b49b89961ff3a71d",
          "https://public.youware.com/users-website-assets/prod/faf7c4ec-0acf-42c0-b174-678e35ae8c70/93629169d5504c54b49b89961ff3a71d",
        ]
      },
      // 第二条记录
      {
        id: 'msg_2_1',
        role: 'user',
        content: "历史数据2",
        referenceImage: "https://public.youware.com/users-website-assets/prod/faf7c4ec-0acf-42c0-b174-678e35ae8c70/2dd2239d444142d3afc0fb2db153df7b"
      },
      {
        id: 'msg_2_2',
        role: 'assistant',
        images: [
          "https://public.youware.com/users-website-assets/prod/faf7c4ec-0acf-42c0-b174-678e35ae8c70/2dd2239d444142d3afc0fb2db153df7b"
        ]
      }
    ]
  },
  {
    id: 'session_2',
    date: new Date(Date.now() - 86400000).toISOString(),
    firstPrompt: "未来城市的空中花园，悬浮在云层之上，巨大的瀑布流向下方，生物发光的植物，梦幻般的氛围。",
    totalImages: 2,
    messages: [
      {
        id: 'msg_2_1',
        role: 'user',
        content: "未来城市的空中花园，悬浮在云层之上，巨大的瀑布流向下方，生物发光的植物，梦幻般的氛围。"
      },
      {
        id: 'msg_2_2',
        role: 'assistant',
        images: [
          "https://public.youware.com/users-website-assets/prod/faf7c4ec-0acf-42c0-b174-678e35ae8c70/2dd2239d444142d3afc0fb2db153df7b",
        ]
      }
    ]
  },
  {
    id: 'session_3',
    date: new Date(Date.now() - 172800000).toISOString(),
    firstPrompt: "极简主义风格的几何抽象画，柔和的色彩，光影交错。",
    firstImage: "https://public.youware.com/users-website-assets/prod/faf7c4ec-0acf-42c0-b174-678e35ae8c70/c19331b743f442838b6dd7026c17ae0f",
    totalImages: 1,
    messages: [
      {
        id: 'msg_3_1',
        role: 'user',
        content: "极简主义风格的几何抽象画，柔和的色彩，光影交错。",
        referenceImage: "https://public.youware.com/users-website-assets/prod/faf7c4ec-0acf-42c0-b174-678e35ae8c70/c19331b743f442838b6dd7026c17ae0f"
      },
      {
        id: 'msg_3_2',
        role: 'assistant',
        images: [
          "https://public.youware.com/users-website-assets/prod/faf7c4ec-0acf-42c0-b174-678e35ae8c70/c19331b743f442838b6dd7026c17ae0f"
        ]
      }
    ]
  },
]

// 卡片内容信息
const GALLERY_ITEMS = Array.from({ length: 30 }).map((_, i) => ({
  id: `gal_${i}`,
  src: [
    "https://public.youware.com/users-website-assets/prod/faf7c4ec-0acf-42c0-b174-678e35ae8c70/c19331b743f442838b6dd7026c17ae0f",
    "https://public.youware.com/users-website-assets/prod/faf7c4ec-0acf-42c0-b174-678e35ae8c70/93629169d5504c54b49b89961ff3a71d",
    "https://public.youware.com/users-website-assets/prod/faf7c4ec-0acf-42c0-b174-678e35ae8c70/2dd2239d444142d3afc0fb2db153df7b",
    "https://public.youware.com/users-website-assets/prod/faf7c4ec-0acf-42c0-b174-678e35ae8c70/00bdd1645172419eb35df7fa3dd99321"
  ][i % 4],
  title: `Gallery Item ${i}`,
  category: ['Portrait', 'Landscape', 'Sci-Fi', 'Abstract'][i % 4],
  type: (i % 3 === 0 ? 'video' : 'image') as 'image' | 'video',
  prompt: `Gallery Item ${i} prompt description...`,
  user: { name: 'System' },
  likes: Math.floor(Math.random() * 1000),
  runs: Math.floor(Math.random() * 5000),
  style: ['Cyberpunk', 'Fantasy', 'Abstract', 'Portrait'][i % 4]
}))

// const route = useRoute()
const prompt = ref('')
const isGenerating = ref(false)
const selectedStyle = ref(STYLES[0].id)
const aspectRatio = ref('1:1')
const imageCount = ref(1)
const isAmazonSuite = ref(false)
const referenceMedia = ref<string | null>(null)
const showSidebar = ref(true)

// New State
const mediaType = ref<'image' | 'video'>('image')
const activeSidebarTab = ref<'history' | 'gallery'>('gallery')
const historySearch = ref('')
const gallerySearch = ref('')
const selectedCategory = ref('All')
const selectedImage = ref<string | null>(null)
const selectedGalleryItem = ref<any>(null)

const currentSession = ref<HistorySession | null>(null)
const sessions = ref<HistorySession[]>(HISTORY_SESSIONS)

onMounted(() => {
  if (history.state) {
    const { prompt: initialPrompt, autoGenerate, referenceImage } = history.state
    if (initialPrompt) {
      prompt.value = initialPrompt
      if (autoGenerate) {
        handleGenerate(initialPrompt)
      }
    }
    if (referenceImage) {
      referenceMedia.value = referenceImage
      mediaType.value = 'image'
    }
    window.history.replaceState({}, document.title)
  }
})

const handleGenerate = (currentPrompt = prompt.value) => {
  // 1. 输入验证 - 确保有生成内容的基础
  if (!currentPrompt && !referenceMedia.value) return
  
  // 2. 设置生成状态，用于UI显示加载效果
  isGenerating.value = true
  
  // 3. 模拟API调用
  setTimeout(() => {
    // 4. 生成完成后重置状态
    isGenerating.value = false
    
    // 5. 模拟生成结果
    const newImages = [
      "https://public.youware.com/users-website-assets/prod/faf7c4ec-0acf-42c0-b174-678e35ae8c70/93629169d5504c54b49b89961ff3a71d",
      "https://public.youware.com/users-website-assets/prod/faf7c4ec-0acf-42c0-b174-678e35ae8c70/2dd2239d444142d3afc0fb2db153df7b",
      "https://public.youware.com/users-website-assets/prod/faf7c4ec-0acf-42c0-b174-678e35ae8c70/00bdd1645172419eb35df7fa3dd99321",
      "https://public.youware.com/users-website-assets/prod/faf7c4ec-0acf-42c0-b174-678e35ae8c70/c19331b743f442838b6dd7026c17ae0f"
    ].slice(0, imageCount.value) // 根据用户选择的生成数量截取

    // 6. 会话管理逻辑 - 处理当前会话的更新或创建
    if (currentSession.value) {
      // 6.1 如果存在当前会话，更新现有会话
      const updatedSession = {
        ...currentSession.value, // 保留原有会话数据
        totalImages: currentSession.value.totalImages + newImages.length, // 累加图片总数
        messages: [
          ...currentSession.value.messages, // 保留原有消息
          // 添加新的用户消息
          { 
            id: `msg_${Date.now()}_u`, 
            role: 'user' as const, 
            content: currentPrompt, 
            referenceImage: referenceMedia.value || undefined 
          },
          // 添加AI生成的回复消息
          { 
            id: `msg_${Date.now()}_a`, 
            role: 'assistant' as const, 
            images: newImages 
          }
        ]
      }
      // 更新会话状态
      currentSession.value = updatedSession
      // 更新会话列表，替换对应的会话
      sessions.value = sessions.value.map(s => 
        s.id === updatedSession.id ? updatedSession : s
      )
    } else {
      // 6.2 如果没有当前会话，创建新会话
      const newSession: HistorySession = {
        id: `session_${Date.now()}`,
        date: new Date().toISOString(), // 当前时间
        firstPrompt: currentPrompt, // 第一条提示词
        firstImage: referenceMedia.value || undefined, // 参考图片
        totalImages: newImages.length, // 本次生成的图片数量
        messages: [
          // 用户消息
          { 
            id: `msg_${Date.now()}_u`, 
            role: 'user', 
            content: currentPrompt, 
            referenceImage: referenceMedia.value || undefined 
          },
          // AI回复消息
          { 
            id: `msg_${Date.now()}_a`, 
            role: 'assistant', 
            images: newImages 
          }
        ]
      }
      // 更新状态：将新会话添加到列表开头，并设为当前会话
      sessions.value = [newSession, ...sessions.value]
      currentSession.value = newSession
    }
  }, 3000) // 模拟3秒生成延迟
}

const toggleAmazonSuite = () => {
  const newState = !isAmazonSuite.value
  isAmazonSuite.value = newState
  if (newState) {
    imageCount.value = 6
  } else {
    imageCount.value = 1
  }
}
const handleDownloadToLocal = (imageUrl: string) => {
  console.log('下载图片到本地:', imageUrl)
  
  // 创建临时链接进行下载
  const link = document.createElement('a')
  link.href = imageUrl
  link.download = `aiImage-${Date.now()}.jpg`
  link.target = '_blank'
  link.rel = 'noopener noreferrer'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
const handleMediaUpload = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = mediaType.value === 'image' ? 'image/*' : 'video/*'
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        referenceMedia.value = e.target?.result as string
      }
      reader.readAsDataURL(file)
    }
  }
  input.click()
}

const filteredHistory = computed(() => {
  return sessions.value.filter(item => {
    const matchesSearch = item.date.includes(historySearch.value) || item.firstPrompt.toLowerCase().includes(historySearch.value.toLowerCase())
    return matchesSearch
  })
})

const filteredGallery = computed(() => {
  return GALLERY_ITEMS.filter(item => {
    const matchesType = item.type === mediaType.value
    const matchesSearch = item.title.toLowerCase().includes(gallerySearch.value.toLowerCase())
    const matchesCategory = selectedCategory.value === 'All' || item.category === selectedCategory.value
    return matchesType && matchesSearch && matchesCategory
  })
})

const handleSidebarItemClick = (item: any, type: 'history' | 'gallery') => {
  if (type === 'history') {
    currentSession.value = item
  } else {
    selectedGalleryItem.value = item
  }
}

const handleUseTemplate = (item: any) => {
  if (item) {
    prompt.value = item.prompt || ''
    referenceMedia.value = item.src
    if (item.type === 'video') {
      mediaType.value = 'video'
    } else {
      mediaType.value = 'image'
    }
    selectedGalleryItem.value = null
  }
}

const handleEditTemplate = (item: any) => {
  if (item) {
    prompt.value = item.prompt || ''
    referenceMedia.value = item.src
    selectedGalleryItem.value = null
  }
}

const formatDate = (isoString: string) => {
  const date = new Date(isoString)
  return date.toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const navigateToGallery = () => {
  router.push('/gallery')
}
</script>

<template>
  <div class="flex h-[calc(100vh-64px)] md:h-screen md:pt-0 bg-bg-page overflow-hidden">
    <!-- 创作工具 -->
    <div class="w-80 bg-bg-base border-r border-border-base flex flex-col z-20 shadow-lg hidden lg:flex">
      <div class="p-6 border-b border-border-base flex items-center justify-between">
        <div class="flex items-center gap-2 text-primary">
          <Sparkles class="w-5 h-5" />
          <h2 class="font-bold text-lg">创作工具</h2>
        </div>
        <button
          @click="router.push('/')"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-base bg-primary/10 hover:bg-primary hover:text-white text-primary border border-primary/20 hover:border-primary transition-all text-sm font-medium"
          title="回到首页"
        >
          <Home class="w-4 h-4" />
          <span>首页</span>
        </button>
      </div>
      
      <div class="flex-1 overflow-y-auto p-6 space-y-8">
        <!-- 艺术风格 -->
        <div>
          <label class="text-sm font-medium text-text-secondary mb-3 flex items-center gap-2">
            <Palette class="w-4 h-4" /> 艺术风格
          </label>
          <div class="grid grid-cols-2 gap-3">
            <button
              v-for="style in STYLES"
              :key="style.id"
              @click="selectedStyle = style.id"
              :class="cn(
                'relative overflow-hidden p-3 rounded-base border text-left transition-all group',
                selectedStyle === style.id
                  ? 'border-primary shadow-glow'
                  : 'border-border-base hover:border-primary/50'
              )"
            >
              <div :class="cn('absolute inset-0 opacity-10 bg-gradient-to-br', style.color)" />
              <span :class="cn(
                'text-sm font-medium relative z-10',
                selectedStyle === style.id ? 'text-primary' : 'text-text-secondary group-hover:text-text-primary'
              )">
                {{ style.name }}
              </span>
            </button>
          </div>
        </div>

        <!-- 画面比例 -->
        <div>
          <label class="text-sm font-medium text-text-secondary mb-3 flex items-center gap-2">
            <Layout class="w-4 h-4" /> 画面比例
          </label>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="ratio in ASPECT_RATIOS"
              :key="ratio.value"
              @click="aspectRatio = ratio.value"
              :class="cn(
                'p-3 rounded-base border text-center transition-all',
                aspectRatio === ratio.value
                  ? 'bg-primary/10 border-primary text-primary shadow-glow'
                  : 'bg-bg-card border-border-base text-text-secondary hover:border-primary/50 hover:text-primary'
              )"
            >
              <span class="block text-sm font-medium">{{ ratio.label }}</span>
            </button>
          </div>
        </div>

        <!-- 生成数量 -->
        <div>
          <label class="text-sm font-medium text-text-secondary mb-3 flex items-center gap-2">
            <Layers class="w-4 h-4" /> 生成数量
          </label>
          
          <div v-if="!isAmazonSuite" class="flex items-center gap-2 bg-bg-page p-1 rounded-base border border-border-base mb-4">
            <button
              v-for="num in [1, 2, 4, 8]"
              :key="num"
              @click="imageCount = num"
              :class="cn(
                'flex-1 py-2 rounded-small text-sm font-medium transition-all',
                imageCount === num
                  ? 'bg-bg-card text-primary shadow-sm border border-border-light'
                  : 'text-text-secondary hover:text-text-primary'
              )"
            >
              {{ num }}
            </button>
          </div>

          <!-- 亚马逊套图 -->
          <button 
            @click="toggleAmazonSuite"
            :class="cn(
              'flex items-center gap-3 w-full p-3 rounded-base border transition-all',
              isAmazonSuite 
                ? 'bg-primary/10 border-primary text-primary shadow-glow' 
                : 'bg-bg-card border-border-base text-text-secondary hover:border-primary/50 hover:text-primary'
            )"
          >
            <CheckSquare v-if="isAmazonSuite" class="w-5 h-5 shrink-0" />
            <Square v-else class="w-5 h-5 shrink-0" />
            <div class="text-left">
              <span class="block text-sm font-medium">亚马逊套图</span>
              <span class="block text-xs opacity-70">自动生成 6 张商品展示图</span>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Center: 内容生成区域 -->
    <div class="flex-1 flex flex-col min-w-0 relative">
      <div class="flex-1 p-4 md:p-6 overflow-y-auto bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-bg-card to-bg-page">
        <div v-if="currentSession" class="w-full h-full space-y-8 pb-20 px-4 md:px-8">
          <div v-for="msg in currentSession.messages" :key="msg.id" :class="cn('flex gap-4', msg.role === 'assistant' ? 'flex-row' : 'flex-row-reverse')">
            <div :class="cn(
              'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
              msg.role === 'assistant' ? 'bg-primary/10 text-primary' : 'bg-gray-200 text-gray-600'
            )">
              <Sparkles v-if="msg.role === 'assistant'" class="w-5 h-5" />
              <User v-else class="w-5 h-5" />
            </div>
            
            <div :class="cn('flex-1 space-y-2 max-w-[85%]', msg.role === 'user' && 'flex flex-col items-end')">
              <div v-if="msg.content || (msg.role === 'user' && msg.referenceImage)" :class="cn(
                'inline-block p-4 rounded-2xl text-left shadow-sm',
                msg.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-white border border-border-base rounded-tl-none'
              )">
                <!-- 用户输入信息 -->
                <div v-if="msg.role === 'user' && msg.referenceImage" class="mb-3 pb-3 border-b border-white/20">
                  <img 
                    :src="msg.referenceImage" 
                    alt="Ref" 
                    class="w-16 h-16 rounded-lg object-cover border border-white/30 cursor-pointer hover:opacity-90 transition-opacity shadow-sm bg-black/20"
                    @click.stop="selectedImage = msg.referenceImage"
                  />
                </div>
                <p v-if="msg.content" class="text-sm whitespace-pre-wrap">{{ msg.content }}</p>
              </div>
              
              <!-- 对话消息图片区域 -->
              <div v-if="msg.images && msg.images.length > 0" class="flex flex-wrap gap-4 w-full">
                <div v-for="(img, idx) in msg.images" :key="idx" class="relative group rounded-xl overflow-hidden shadow-md border border-border-base bg-white max-w-[300px] flex-shrink-0">
                  <img 
                    :src="img" 
                    alt="Generated" 
                    class="w-full h-auto object-contain cursor-zoom-in" 
                    @click="selectedImage = img"
                  />
                  <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <button 
                      @click.stop="handleDownloadToLocal(img)"
                      class="p-1.5 bg-black/50 text-white rounded-full hover:bg-green-500 transition-colors"
                      title="下载图片到本地"
                    >
                      <Download class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="isGenerating" class="flex gap-4">
            <div class="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 animate-pulse">
              <Sparkles class="w-5 h-5" />
            </div>
            <div class="bg-white border border-border-base p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-3">
              <div class="w-2 h-2 bg-primary rounded-full animate-bounce" />
              <div class="w-2 h-2 bg-primary rounded-full animate-bounce delay-75" />
              <div class="w-2 h-2 bg-primary rounded-full animate-bounce delay-150" />
              <span class="text-sm text-text-secondary ml-2">正在生成中...</span>
            </div>
          </div>
        </div>
        <div v-else class="h-full flex flex-col items-center justify-center text-center text-text-secondary max-w-md mx-auto">
          <div class="w-20 h-20 rounded-round bg-bg-card border border-border-base flex items-center justify-center mb-6 shadow-glow animate-pulse">
            <Wand2 class="w-10 h-10 text-primary" />
          </div>
          <h3 class="text-xl font-medium text-text-primary mb-2">开始您的创作之旅</h3>
          <p class="text-text-secondary">选择左侧的艺术风格，在下方输入描述，或从右侧历史记录中选择会话。</p>
        </div>
      </div>

      <!-- 参考图/视图添加样式 -->
      <div class="p-6 border-t border-border-base bg-bg-base shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-20">
        <div class="w-full px-4 md:px-8">
          <div v-if="referenceMedia" class="mb-4 flex items-start gap-4 animate-in slide-in-from-bottom-2">
            <div class="relative group w-24 h-24 rounded-base overflow-hidden border border-border-base shadow-sm">
              <video v-if="mediaType === 'video'" :src="referenceMedia" class="w-full h-full object-cover" />
              <img v-else :src="referenceMedia" alt="Reference" class="w-full h-full object-cover" />
              <button 
                @click="referenceMedia = null"
                class="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-danger"
              >
                <X class="w-3 h-3" />
              </button>
            </div>
            <div class="text-sm text-text-secondary pt-2">
              <p class="font-medium text-text-primary">参考{{ mediaType === 'image' ? '图' : '视频' }}已添加</p>
              <p>AI 将参考此内容的构图和色彩进行生成</p>
            </div>
          </div>

          <div class="relative flex gap-2">
            <div class="flex flex-col gap-2">
              <div class="flex bg-bg-page rounded-base border border-border-base p-1">
                <button
                  @click="mediaType = 'image'"
                  :class="cn(
                    'flex-1 p-2 rounded-small transition-all',
                    mediaType === 'image' ? 'bg-white shadow-sm text-primary' : 'text-text-secondary hover:text-text-primary'
                  )"
                  title="图片模式"
                >
                  <ImageIcon class="w-4 h-4" />
                </button>
                <button
                  @click="mediaType = 'video'"
                  :class="cn(
                    'flex-1 p-2 rounded-small transition-all',
                    mediaType === 'video' ? 'bg-white shadow-sm text-primary' : 'text-text-secondary hover:text-text-primary'
                  )"
                  title="视频模式"
                >
                  <Video class="w-4 h-4" />
                </button>
              </div>

              <button 
                @click="handleMediaUpload"
                :class="cn(
                  'p-4 rounded-base border border-border-base flex flex-col items-center justify-center gap-1 transition-all w-24 shrink-0',
                  referenceMedia 
                    ? 'bg-primary/5 border-primary text-primary' 
                    : 'bg-bg-page text-text-secondary hover:border-primary hover:text-primary'
                )"
                :title="`上传参考${mediaType === 'image' ? '图' : '视频'}`"
              >
                <ImageIcon v-if="mediaType === 'image'" class="w-6 h-6" />
                <Video v-else class="w-6 h-6" />
                <span class="text-xs font-medium">参考{{ mediaType === 'image' ? '图' : '视频' }}</span>
              </button>
            </div>

            <!-- AI文本编辑输入 -->
            <div class="relative flex-1">
              <textarea
                v-model="prompt"
                placeholder="描述您想看到的内容..."
                class="w-full h-full min-h-[80px] bg-bg-page border border-border-base rounded-base p-4 pr-32 text-text-primary placeholder-text-placeholder focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all resize-none shadow-inner"
              />
              <div class="absolute bottom-4 right-4 flex items-center gap-2">
                <button 
                  v-if="prompt"
                  @click="prompt = ''"
                  class="p-2 text-text-secondary hover:text-danger transition-colors"
                >
                  <X class="w-4 h-4" />
                </button>
                <button
                  @click="handleGenerate()"
                  :disabled="(!prompt && !referenceMedia) || isGenerating"
                  class="el-button el-button-primary shadow-glow px-6"
                >
                  <template v-if="isGenerating">
                    <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    生成中...
                  </template>
                  <template v-else>
                    <Wand2 class="w-4 h-4 mr-2" />
                    生成
                    {{ isAmazonSuite ? " (6张)" : "" }}
                  </template>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧边栏显示/隐藏 -->
      <button
        v-if="!showSidebar"
        @click="showSidebar = true"
        class="absolute top-6 right-6 p-2 bg-bg-base border border-border-base rounded-base shadow-md text-text-secondary hover:text-primary z-30"
      >
        <ChevronLeft class="w-5 h-5" />
      </button>
    </div>

    <!-- 右侧边栏：浏览画廊/历史记录 -->
    <div :class="cn(
      'bg-bg-base border-l border-border-base flex flex-col transition-all duration-300 ease-in-out z-20 shadow-lg',
      showSidebar ? 'w-80 translate-x-0' : 'w-0 translate-x-full opacity-0 overflow-hidden'
    )">
      <div class="flex border-b border-border-base">
        <button
          @click="activeSidebarTab = 'gallery'"
          :class="cn(
            'flex-1 py-3 text-sm font-medium transition-colors border-b-2',
            activeSidebarTab === 'gallery'
              ? 'text-primary border-primary bg-primary/5'
              : 'text-text-secondary border-transparent hover:text-text-primary hover:bg-bg-page'
          )"
        >
          <Grid class="w-4 h-4 inline-block mr-2" />
          浏览画廊
        </button>
        <button
          @click="activeSidebarTab = 'history'"
          :class="cn(
            'flex-1 py-3 text-sm font-medium transition-colors border-b-2',
            activeSidebarTab === 'history'
              ? 'text-primary border-primary bg-primary/5'
              : 'text-text-secondary border-transparent hover:text-text-primary hover:bg-bg-page'
          )"
        >
          <Clock class="w-4 h-4 inline-block mr-2" />
          历史记录
        </button>
        <button 
          @click="showSidebar = false"
          class="px-3 border-l border-border-base text-text-secondary hover:text-primary"
        >
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-4">
        
        <!-- 图片搜索 -->
        <div v-if="activeSidebarTab === 'gallery'" class="space-y-4">
          <el-input
            v-model="gallerySearch"
            placeholder="搜索画廊..."
            class="w-full text-sm"
          >
            <template #prefix>
              <Search class="w-4 h-4 text-text-secondary" />
            </template>
          </el-input>
          <!-- 图片分类筛选 -->
          <div class="scrollable_flex scrollbar-thin">
            <button
              v-for="cat in ['All', 'Portrait', 'Landscape', 'Sci-Fi', 'Abstract']"
              :key="cat"
              @click="selectedCategory = cat"
              style="margin-right:8px;"
              :class="cn(
                'px-3 py-1 rounded-full text-xs border whitespace-nowrap transition-colors',
                selectedCategory === cat
                  ? 'bg-primary text-white border-primary'
                  : 'bg-bg-card border-border-base text-text-secondary hover:border-primary'
              )"
            >
              {{ cat }}
            </button>
          </div>

          <div class="text-xs text-text-secondary mb-2">
            正在显示: {{ mediaType === 'image' ? '图片' : '视频' }}资源
          </div>

          <div class="grid grid-cols-2 gap-3">
            <!-- 右侧边栏：卡片信息 -->
            <GalleryCard
              v-for="item in filteredGallery"
              :key="item.id"
              :item="item"
              aspect-ratio="aspect-square"
              @click="handleSidebarItemClick(item, 'gallery')"
            />
          </div>
          
          <div class="mt-6 text-center">
            <button 
              @click="navigateToGallery"
              class="text-xs text-primary hover:underline transition-colors"
            >
              浏览更多灵感 &rarr;
            </button>
          </div>
        </div>

        <!-- 历史记录tab区域 -->
        <div v-if="activeSidebarTab === 'history'" class="space-y-4">
          <el-input
            v-model="historySearch"
            placeholder="搜索内容..."
            class="w-full text-sm"
          >
            <template #prefix>
              <Search class="w-4 h-4 text-text-secondary" />
            </template>
          </el-input>

          <div class="space-y-4">
            <div 
              v-for="session in filteredHistory"
              :key="session.id" 
              :class="cn(
                'group relative rounded-base overflow-hidden bg-bg-card border cursor-pointer transition-all hover:shadow-md',
                currentSession?.id === session.id ? 'border-primary ring-1 ring-primary' : 'border-border-base hover:border-primary/50'
              )"
              @click="handleSidebarItemClick(session, 'history')"
            >
              <div class="flex p-3 gap-3">
                <div class="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-border-base">
                  <img v-if="session.firstImage" :src="session.firstImage" alt="Thumbnail" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full flex items-center justify-center text-text-secondary">
                    <MessageSquare class="w-6 h-6" />
                  </div>
                </div>
                
                <!-- 内容区域 -->
                <div class="flex-1 min-w-0 flex flex-col justify-between">
                  <div class="flex items-start justify-between gap-2">
                    <p class="text-sm text-text-primary font-medium line-clamp-2 leading-snug">
                      {{ session.firstPrompt }}
                    </p>
                  </div>
                  
                  <div class="flex items-center justify-between mt-2">
                    <span class="text-xs text-text-secondary flex items-center gap-1">
                      <Clock class="w-3 h-3" />
                      {{ formatDate(session.date) }}
                    </span>
                    <span class="text-xs font-medium px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                      {{ session.totalImages }} 张
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="activeSidebarTab === 'history'" class="mt-6 text-center">
          <button class="text-xs text-text-secondary hover:text-primary transition-colors">
            加载更多...
          </button>
        </div>
      </div>
    </div>
    <div 
      v-if="selectedImage"
      class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-in fade-in duration-200"
      @click="selectedImage = null"
    >
      <button 
        class="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors"
        @click="selectedImage = null"
      >
        <X class="w-8 h-8" />
      </button>
      <img 
        :src="selectedImage" 
        alt="Full view" 
        class="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
        @click.stop
      />
    </div>
    <!-- 卡片内容弹窗 -->
    <GalleryModal
      :isOpen="!!selectedGalleryItem"
      :item="selectedGalleryItem"
      @close="selectedGalleryItem = null"
      @use="handleUseTemplate"
      @edit="handleEditTemplate"
    />
  </div>
</template>
<style scoped>
.scrollable_flex {
  display: flex;
  overflow-x: auto;
  padding-bottom: 8px;
}
</style>

