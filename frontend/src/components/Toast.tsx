import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, X, AlertCircle, Info } from "lucide-react";
import styles from "../styles/components/Toast.module.css";
import { ServiceResult } from "../shared/service.result/service.result";

export interface TokenDetails {
  token: string;
  refreshToken?: string;
  expiresIn?: number;
  userId?: string;
}

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastProps {
  isVisible: boolean;
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
  onClose: () => void;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
}

export interface ServiceResponseToastProps<T> {
  isVisible: boolean;
  serviceResult: ServiceResult<T> | null;
  duration?: number;
  onClose: () => void;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
  successTitle?: string;
  errorTitle?: string;
}

const Toast: React.FC<ToastProps> = ({
  isVisible,
  type,
  title,
  message,
  duration = 3000,
  onClose,
  position = "bottom-left",
}) => {
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!isVisible) return;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(progressInterval);
          return 0;
        }
        return prev - 100 / (duration / 100);
      });
    }, 100);

    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [isVisible, duration]);

  const handleClose = () => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      onClose();
      setIsAnimatingOut(false);
      setProgress(100);
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className={styles.icon} />;
      case "error":
        return <XCircle className={styles.icon} />;
      case "warning":
        return <AlertCircle className={styles.icon} />;
      case "info":
        return <Info className={styles.icon} />;
      default:
        return <Info className={styles.icon} />;
    }
  };

  if (!isVisible && !isAnimatingOut) return null;

  return (
    <div
      className={`
        ${styles.toast} 
        ${styles[type]} 
        ${styles[position]} 
        ${isAnimatingOut ? styles.animatingOut : styles.animatingIn}
      `}
    >
      <div className={styles.content}>
        <div className={styles.iconContainer}>{getIcon()}</div>
        <div className={styles.textContent}>
          <div className={styles.title}>{title}</div>
          <div className={styles.message}>{message}</div>
        </div>
        <button
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="Close notification"
        >
          <X className={styles.closeIcon} />
        </button>
      </div>
      <div className={styles.progressBar} style={{ width: `${progress}%` }} />
    </div>
  );
};

const ServiceResponseToast: React.FC<ServiceResponseToastProps<any>> = ({
  isVisible,
  serviceResult,
  duration = 3000,
  onClose,
  position = "bottom-left",
  successTitle = "Success",
  errorTitle = "Error",
}) => {
  if (!serviceResult) return null;

  const type: ToastType = serviceResult.success ? "success" : "error";
  const title = serviceResult.success ? successTitle : errorTitle;
  const message =
    serviceResult.message ||
    (serviceResult.success
      ? "Operation completed successfully"
      : "Something went wrong");

  return (
    <Toast
      isVisible={isVisible}
      type={type}
      title={title}
      message={message}
      duration={duration}
      onClose={onClose}
      position={position}
    />
  );
};

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
}

export interface ToastContainerProps {
  toasts: ToastItem[];
  onRemoveToast: (id: string) => void;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
}

const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onRemoveToast,
  position = "bottom-left",
}) => {
  return (
    <div className={`${styles.toastContainer} ${styles[position]}`}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          isVisible={true}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          duration={toast.duration}
          onClose={() => onRemoveToast(toast.id)}
          position={position}
        />
      ))}
    </div>
  );
};

// Hook for managing toasts
export const useToast = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = (toast: Omit<ToastItem, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const addServiceResponseToast = <T,>(
    serviceResult: ServiceResult<T>,
    options?: {
      successTitle?: string;
      errorTitle?: string;
      duration?: number;
    }
  ) => {
    const type: ToastType = serviceResult.success ? "success" : "error";
    const title = serviceResult.success
      ? options?.successTitle || "Success"
      : options?.errorTitle || "Error";
    const message =
      serviceResult.message ||
      (serviceResult.success
        ? "Operation completed successfully"
        : "Something went wrong");

    addToast({
      type,
      title,
      message,
      duration: options?.duration,
    });
  };

  const clearAllToasts = () => {
    setToasts([]);
  };

  return {
    toasts,
    addToast,
    removeToast,
    addServiceResponseToast,
    clearAllToasts,
  };
};

// Main exports
export { Toast, ServiceResponseToast, ToastContainer };
export default Toast;
