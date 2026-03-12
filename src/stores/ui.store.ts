import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

//  Types 

export type Theme = 'light' | 'dark' | 'system'

interface Notification {
  id:      string
  type:    'success' | 'error' | 'warning' | 'info'
  title:   string
  message?: string
}

interface UIState {
  sidebarCollapsed: boolean
  theme:            Theme
  notifications:    Notification[]
}

interface UIActions {
  toggleSidebar:        () => void
  setSidebarCollapsed:  (collapsed: boolean) => void
  setTheme:             (theme: Theme) => void
  addNotification:      (notification: Omit<Notification, 'id'>) => void
  removeNotification:   (id: string) => void
  clearNotifications:   () => void
}

type UIStore = UIState & UIActions

//  Store 

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      //  State 
      sidebarCollapsed: false,
      theme:            'system',
      notifications:    [],

      //  Actions 
      toggleSidebar: () =>
        set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      setSidebarCollapsed: (collapsed) =>
        set({ sidebarCollapsed: collapsed }),

      setTheme: (theme) =>
        set({ theme }),

      addNotification: (notification) =>
        set((s) => ({
          notifications: [
            ...s.notifications,
            { ...notification, id: crypto.randomUUID() },
          ],
        })),

      removeNotification: (id) =>
        set((s) => ({
          notifications: s.notifications.filter((n) => n.id !== id),
        })),

      clearNotifications: () =>
        set({ notifications: [] }),
    }),
    {
      name:    'trayectoria-ui',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        theme:            state.theme,
      }),
    },
  ),
)

//  Selectors 

export const selectSidebarCollapsed = (s: UIStore) => s.sidebarCollapsed
export const selectTheme            = (s: UIStore) => s.theme
export const selectNotifications    = (s: UIStore) => s.notifications
