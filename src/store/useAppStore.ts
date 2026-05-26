import { create } from 'zustand'

interface AppState {
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  searchQuery: string
  selectedRegion: string | null
  isLiveMode: boolean
  toggleSidebar: () => void
  toggleSidebarCollapse: () => void
  setSearchQuery: (q: string) => void
  setSelectedRegion: (r: string | null) => void
}

// Detect if we have build-time API configuration
const hasAcledConfig = !!(
  import.meta.env.VITE_ACLED_EMAIL && import.meta.env.VITE_ACLED_TOKEN
)

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  sidebarCollapsed: false,
  searchQuery: '',
  selectedRegion: null,
  isLiveMode: hasAcledConfig, // automatically set live if env variables are active
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleSidebarCollapse: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setSelectedRegion: (r) => set({ selectedRegion: r }),
}))
