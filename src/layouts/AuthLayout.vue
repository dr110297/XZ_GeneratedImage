<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import logo from '@/assets/logo.png'
</script>

<template>
  <div class="min-h-screen bg-bg-page text-text-primary flex flex-col relative overflow-hidden">
    <!-- Background Glow -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />

    <div class="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 relative z-10">
      <RouterLink to="/login" class="mb-8 flex items-center gap-2 group">
        <img :src="logo" alt="Logo" class="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
        <span class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
          xzTimes
        </span>
      </RouterLink>
      
      <div class="w-full max-w-md bg-bg-card/60 border border-border-base rounded-base p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <RouterView />
      </div>
    </div>
    
    <div class="py-6 text-center text-sm text-text-secondary relative z-10">
      © {{ new Date().getFullYear() }} xzTimes. 保留所有权利。
    </div>
  </div>
</template>
