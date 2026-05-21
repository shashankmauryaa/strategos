import { create } from 'zustand'

interface AppState {
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  searchQuery: string
  selectedRegion: string | null
  toggleSidebar: () => void
  toggleSidebarCollapse: () => void
  setSearchQuery: (q: string) => void
  setSelectedRegion: (r: string | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  sidebarCollapsed: false,
  searchQuery: '',
  selectedRegion: null,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleSidebarCollapse: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setSelectedRegion: (r) => set({ selectedRegion: r }),
}))
