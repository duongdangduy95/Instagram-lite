'use client'

interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Xóa',
  cancelText = 'Hủy',
}: DeleteConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]" onClick={onClose}>
      <div 
        className="bg-[#0B0E11] border border-gray-800 p-6 rounded-xl w-96 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <p className="text-gray-300 mb-6">{message}</p>
        
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
