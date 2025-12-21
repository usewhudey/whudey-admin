import { useUIStore } from "@/store/useUIStore";
import { useCallback } from "react";

export const useToast = () => {
  const { showNotification, hideNotification } = useUIStore();

  const toast = useCallback(
    (message: string, type: "success" | "error" | "info" | "warning" = "info") => {
      showNotification(message, type);

      // Auto-hide after 5 seconds
      setTimeout(() => {
        hideNotification();
      }, 5000);
    },
    [showNotification, hideNotification]
  );

  return {
    toast,
    success: (message: string) => toast(message, "success"),
    error: (message: string) => toast(message, "error"),
    info: (message: string) => toast(message, "info"),
    warning: (message: string) => toast(message, "warning"),
  };
};
