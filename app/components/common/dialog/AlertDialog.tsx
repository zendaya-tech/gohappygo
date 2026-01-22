import { useEffect } from "react";
import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon } from "@heroicons/react/24/outline";

interface AlertDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: "success" | "error" | "warning";
  confirmText?: string;
  onConfirm?: () => void;
}

export default function AlertDialog({
  open,
  onClose,
  title,
  message,
  type,
  confirmText = "OK",
  onConfirm,
}: AlertDialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircleIcon className="h-12 w-12 text-green-600" />;
      case "error":
        return <XCircleIcon className="h-12 w-12 text-red-600" />;
      case "warning":
        return <ExclamationTriangleIcon className="h-12 w-12 text-yellow-600" />;
      default:
        return <ExclamationTriangleIcon className="h-12 w-12 text-gray-600" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          button: "bg-green-600 hover",
        };
      case "error":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          button: "bg-red-600 hover",
        };
      case "warning":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          button: "bg-yellow-600 hover",
        };
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-200",
          button: "bg-gray-600 hover",
        };
    }
  };

  const colors = getColors();

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-2xl ring-1 ring-black/10">
        {/* Content */}
        <div className={`rounded-2xl ${colors.bg} ${colors.border} border p-6`}>
          {/* Icon */}
          <div className="flex justify-center mb-4">
            {getIcon()}
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
            {title}
          </h3>

          {/* Message */}
          <p className="text-sm text-gray-600 text-center mb-6 leading-relaxed">
            {message}
          </p>

          {/* Actions */}
          <div className="flex justify-center">
            <button
              onClick={handleConfirm}
              className={`px-6 py-2 rounded-lg text-white font-medium transition-colors ${colors.button}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}