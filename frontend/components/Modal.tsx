import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  icon,
  className = "",
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-md overflow-y-auto h-full w-full z-50"
      onClick={onClose}
    >
      <div
        className={`relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mt-3 text-center">
          {icon && (
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              {icon}
            </div>
          )}
          <h3 className="text-lg font-medium text-gray-900 mt-2">{title}</h3>
          <div className="mt-2 px-7 py-3">{children}</div>
        </div>
      </div>
    </div>
  );
}

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClassName?: string;
  cancelButtonClassName?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmButtonClassName = "px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50",
  cancelButtonClassName = "px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300",
  icon,
  disabled = false,
  loading = false,
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} icon={icon}>
      <p className="text-sm text-gray-500">{message}</p>
      <div className="items-center px-4 py-3">
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className={cancelButtonClassName}
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={confirmButtonClassName}
            disabled={disabled || loading}
          >
            {loading ? "Loading..." : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
