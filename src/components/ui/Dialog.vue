<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

defineProps<{
  isOpen: boolean
  title?: string
  width?: string
}>()

defineEmits(['close'])
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" @click="$emit('close')" />
    <div 
      :class="cn(
        'relative bg-bg-base rounded-lg shadow-xl w-full max-h-[90vh] overflow-y-auto flex flex-col animate-in fade-in zoom-in-95 duration-200',
        width ? '' : 'max-w-2xl'
      )"
      :style="{ width: width }"
    >
      <div class="flex items-center justify-between p-6 border-b border-border-base sticky top-0 bg-bg-base z-10">
        <h3 class="text-lg font-bold text-text-primary">{{ title }}</h3>
        <button @click="$emit('close')" class="text-text-secondary hover:text-text-primary transition-colors">
          <X class="w-5 h-5" />
        </button>
      </div>
      
      <div class="p-6 flex-1">
        <slot />
      </div>

      <div v-if="$slots.footer" class="p-6 border-t border-border-base bg-bg-page flex justify-end gap-3 sticky bottom-0 z-10">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>
