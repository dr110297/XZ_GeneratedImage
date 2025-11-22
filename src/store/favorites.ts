import { reactive, watch } from 'vue'

export interface FavoriteItem {
  id: string | number
  src: string
  title?: string
  prompt?: string
  type: 'image' | 'video'
  style?: string
  folderId?: string
  createdAt: number
}

export interface Folder {
  id: string
  name: string
  createdAt: number
}

const STORAGE_KEY_FAVORITES = 'xztimes_favorites'
const STORAGE_KEY_FOLDERS = 'xztimes_folders'

// Load initial state
const savedFavorites = localStorage.getItem(STORAGE_KEY_FAVORITES)
const savedFolders = localStorage.getItem(STORAGE_KEY_FOLDERS)

export const store = reactive({
  favorites: (savedFavorites ? JSON.parse(savedFavorites) : []) as FavoriteItem[],
  folders: (savedFolders ? JSON.parse(savedFolders) : []) as Folder[],

  addFavorite(item: Omit<FavoriteItem, 'createdAt'>) {
    if (this.isFavorite(item.id)) return
    this.favorites.unshift({ ...item, createdAt: Date.now() })
  },

  removeFavorite(id: string | number) {
    const index = this.favorites.findIndex(f => f.id === id)
    if (index > -1) {
      this.favorites.splice(index, 1)
    }
  },

  isFavorite(id: string | number) {
    return this.favorites.some(f => f.id === id)
  },

  toggleFavorite(item: Omit<FavoriteItem, 'createdAt'>) {
    if (this.isFavorite(item.id)) {
      this.removeFavorite(item.id)
    } else {
      this.addFavorite(item)
    }
  },

  createFolder(name: string) {
    const id = `folder_${Date.now()}`
    this.folders.push({ id, name, createdAt: Date.now() })
    return id
  },

  deleteFolder(id: string) {
    const index = this.folders.findIndex(f => f.id === id)
    if (index > -1) {
      this.folders.splice(index, 1)
      // Move items in this folder to root (undefined folderId)
      this.favorites.forEach(f => {
        if (f.folderId === id) f.folderId = undefined
      })
    }
  },

  moveToFolder(itemId: string | number, folderId: string | undefined) {
    const item = this.favorites.find(f => f.id === itemId)
    if (item) {
      item.folderId = folderId
    }
  }
})

// Persist state
watch(() => store.favorites, (newVal) => {
  localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(newVal))
}, { deep: true })

watch(() => store.folders, (newVal) => {
  localStorage.setItem(STORAGE_KEY_FOLDERS, JSON.stringify(newVal))
}, { deep: true })
