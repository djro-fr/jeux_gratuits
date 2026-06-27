import type { ReactNode } from "react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null

  return (
    <div id="modal" className="fixed inset-0 bg-overlay/95 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-3 border-b border-gray-300 shrink-0">
          <h2 className="text-2xl font-bold mt-0">{title}</h2>
          <button
            onClick={onClose}
            className="text-2xl font-bold hover:opacity-70"
          >
            ✕
          </button>
        </div>
        <div className="p-1 overflow-scroll">
          {children}
        </div>
      </div>
    </div>
  )
}