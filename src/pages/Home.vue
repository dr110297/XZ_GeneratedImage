<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, Zap, Image as ImageIcon, Share2 } from 'lucide-vue-next'
import GalleryCard from '@/components/ui/GalleryCard.vue'
import GalleryModal from '@/components/ui/GalleryModal.vue'

const router = useRouter()
const selectedTemplate = ref<any>(null)

const showcaseImages = [
  {
    id: 'home_1',
    src: "https://public.youware.com/users-website-assets/prod/faf7c4ec-0acf-42c0-b174-678e35ae8c70/93629169d5504c54b49b89961ff3a71d",
    prompt: "赛博朋克城市夜景，霓虹灯光，高耸的摩天大楼，雨夜反射，未来主义风格，8k分辨率，极其详细",
    style: "Cyberpunk",
    type: 'image' as const,
    title: '赛博朋克夜景',
    user: { name: 'System' },
    likes: 1205,
    runs: 3400
  },
  {
    id: 'home_2',
    src: "https://public.youware.com/users-website-assets/prod/faf7c4ec-0acf-42c0-b174-678e35ae8c70/2dd2239d444142d3afc0fb2db153df7b",
    prompt: "梦幻般的风景，漂浮的岛屿，巨大的发光水晶，云海，奇幻艺术，柔和的光线，吉卜力工作室风格",
    style: "Fantasy",
    type: 'image' as const,
    title: '天空之城',
    user: { name: 'System' },
    likes: 890,
    runs: 2100
  },
  {
    id: 'home_3',
    src: "https://public.youware.com/users-website-assets/prod/faf7c4ec-0acf-42c0-b174-678e35ae8c70/00bdd1645172419eb35df7fa3dd99321",
    prompt: "抽象3D形状，多彩的几何体，极简主义背景，柔和的阴影，C4D渲染，高光泽材质",
    style: "Abstract",
    type: 'video' as const,
    title: '几何抽象',
    user: { name: 'System' },
    likes: 560,
    runs: 1200
  },
  {
    id: 'home_4',
    src: "https://public.youware.com/users-website-assets/prod/faf7c4ec-0acf-42c0-b174-678e35ae8c70/c19331b743f442838b6dd7026c17ae0f",
    prompt: "未来时尚人像，模特穿着发光的高科技服装，复杂的细节，电影级照明，浅景深，虚幻引擎5渲染",
    style: "Portrait",
    type: 'image' as const,
    title: '未来时尚',
    user: { name: 'System' },
    likes: 2300,
    runs: 5600
  }
]

const handleQuickGenerate = (item: any) => {
  if (item) {
    router.push({
      path: '/generate',
      state: {
        prompt: item.prompt,
        autoGenerate: true,
        referenceImage: item.src
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
        autoGenerate: false,
        referenceImage: item.src
      }
    })
  }
}

const navigateToGenerate = () => {
  router.push('/generate')
}

const navigateToGallery = () => {
  router.push('/gallery')
}
</script>

<template>
  <div class="flex flex-col min-h-screen bg-bg-page">
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-white" style="padding-top: 8rem; padding-bottom: 5rem;">
      <div class="absolute inset-0" style="background: radial-gradient(ellipse at top, rgba(37, 99, 235, 0.05), #ffffff, #ffffff);" />

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="text-center max-w-3xl mx-auto">
          <h1
            class="font-bold tracking-tight mb-8 text-text-primary"
            style="font-size: 3rem; line-height: 1; animation: fadeIn 0.7s ease-out;"
          >
            专为跨境而生
          </h1>
          <p
            class="text-xl text-text-secondary mb-8"
            style="animation: fadeIn 0.7s ease-out 0.1s both;"
          >
            瞬间将您的想法变为现实。为创作者、设计师和梦想家打造的最先进的AI图像生成器。
          </p>
          <div
            class="flex flex-col sm:flex-row items-center justify-center gap-4"
            style="animation: fadeIn 0.7s ease-out 0.2s both;"
          >
            <el-button
              type="primary"
              @click="navigateToGenerate"
              class="rounded-full px-8 py-4 text-lg shadow-lg flex items-center"
              style="box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);"
            >
              开始创作 <ArrowRight class="w-5 h-5 ml-2" />
            </el-button>
          </div>
        </div>
      </div>
    </section>

    <!-- Template Showcase Section -->
    <section class="bg-bg-page" style="padding-top: 4rem; padding-bottom: 4rem;">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-bold text-text-primary">热门模板</h2>
          <el-button
            @click="navigateToGallery"
            class="rounded-full px-8 py-4 text-lg"
          >
            浏览画廊<ArrowRight class="w-4 h-4" />
          </el-button>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <GalleryCard
            v-for="(item, i) in showcaseImages"
            :key="i"
            :item="item"
            aspect-ratio="aspect-[2/3]"
            :style="{ animation: `fadeIn 0.5s ease-out ${i * 0.1}s both` }"
            @click="selectedTemplate = item"
          >
            <template #info>
              <div class="flex flex-col justify-end h-full">
                <span class="text-text-primary font-medium truncate">{{ item.style }}</span>
                <span class="text-text-secondary text-xs truncate">{{ item.prompt }}</span>
              </div>
            </template>
          </GalleryCard>
        </div>
      </div>
    </section>

    <section class="bg-white relative" style="padding-top: 6rem; padding-bottom: 6rem;">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-text-primary mb-4">为什么选择 xzTimes？</h2>
          <p class="text-text-secondary">创造专业级AI艺术所需的一切。</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="p-8 rounded-base bg-bg-page border border-border-base shadow-sm transition-all hover-feature-card">
            <div class="w-12 h-12 rounded-base bg-primary flex items-center justify-center mb-6 feature-icon-bg">
              <Zap class="w-6 h-6 text-primary" />
            </div>
            <h3 class="text-xl font-bold text-text-primary mb-3">闪电般的速度</h3>
            <p class="text-text-secondary">利用我们优化的基础设施在几秒钟内生成高质量图像。</p>
          </div>
          <div class="p-8 rounded-base bg-bg-page border border-border-base shadow-sm transition-all hover-feature-card">
            <div class="w-12 h-12 rounded-base bg-primary flex items-center justify-center mb-6 feature-icon-bg">
              <ImageIcon class="w-6 h-6 text-primary" />
            </div>
            <h3 class="text-xl font-bold text-text-primary mb-3">高分辨率</h3>
            <p class="text-text-secondary">支持高达4K分辨率的下载，适用于打印和专业用途。</p>
          </div>
          <div class="p-8 rounded-base bg-bg-page border border-border-base shadow-sm transition-all hover-feature-card">
            <div class="w-12 h-12 rounded-base bg-primary flex items-center justify-center mb-6 feature-icon-bg">
              <Share2 class="w-6 h-6 text-primary" />
            </div>
            <h3 class="text-xl font-bold text-text-primary mb-3">轻松分享</h3>
            <p class="text-text-secondary">直接将您的作品分享到社交媒体或社区画廊。</p>
          </div>
        </div>
      </div>
    </section>
    <!-- 卡片内容弹窗 -->
    <GalleryModal
      :isOpen="!!selectedTemplate"
      :item="selectedTemplate"
      @close="selectedTemplate = null"
      @use="handleQuickGenerate"
      @edit="handleEditTemplate"
    />
  </div>
</template>

<style scoped>
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

.feature-icon-bg {
  background-color: rgba(37, 99, 235, 0.1);
  transition: background-color 0.3s ease;
}

.hover-feature-card:hover {
  box-shadow: var(--shadow-md);
}

.hover-feature-card:hover .feature-icon-bg {
  background-color: rgba(37, 99, 235, 0.2);
}

@media (min-width: 768px) {
  h1 {
    font-size: 4.5rem !important;
  }
}
</style>
