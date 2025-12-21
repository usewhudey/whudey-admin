/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Modal {
  isOpen: boolean;
  type: "product" | "order" | "delete" | "upgrade" | null;
  data?: any;
}

interface UIState {
  // Sidebar
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  openSidebar: () => void;

  // Modals
  modal: Modal;
  openModal: (type: Modal["type"], data?: any) => void;
  closeModal: () => void;

  // Theme
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;

  // Mobile menu
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;

  // Loading states
  isGlobalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;

  // Notifications
  notification: {
    isVisible: boolean;
    message: string;
    type: "success" | "error" | "info" | "warning";
  };
  showNotification: (message: string, type: "success" | "error" | "info" | "warning") => void;
  hideNotification: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Sidebar
      isSidebarOpen: true,
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      closeSidebar: () => set({ isSidebarOpen: false }),
      openSidebar: () => set({ isSidebarOpen: true }),

      // Modals
      modal: {
        isOpen: false,
        type: null,
        data: undefined,
      },
      openModal: (type, data) => set({ modal: { isOpen: true, type, data } }),
      closeModal: () => set({ modal: { isOpen: false, type: null, data: undefined } }),

      // Theme
      theme: "light",
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),

      // Mobile menu
      isMobileMenuOpen: false,
      toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
      closeMobileMenu: () => set({ isMobileMenuOpen: false }),

      // Loading
      isGlobalLoading: false,
      setGlobalLoading: (loading) => set({ isGlobalLoading: loading }),

      // Notifications
      notification: {
        isVisible: false,
        message: "",
        type: "info",
      },
      showNotification: (message, type) =>
        set({
          notification: {
            isVisible: true,
            message,
            type,
          },
        }),
      hideNotification: () =>
        set({
          notification: {
            isVisible: false,
            message: "",
            type: "info",
          },
        }),
    }),
    {
      name: "whudey-ui-storage",
      partialize: (state) => ({
        theme: state.theme,
        isSidebarOpen: state.isSidebarOpen,
      }),
    }
  )
);
