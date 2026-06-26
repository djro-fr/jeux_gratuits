import { Modal } from "@/shared/components/Modal"
interface ErrorModalProps {
  error: string | null
  onClose: () => void
}

export const ErrorModal = ({ error, onClose }: ErrorModalProps) => {
  return (
    <Modal
      isOpen={!!error}
      onClose={onClose}
      title="Erreur"
    >
      <div className="text-center">
        <p className="text-lg text-red-600 mb-6">{error}</p>
        <button
          onClick={onClose}
          className="action gold icon md"
        >
          OK
        </button>
      </div>
    </Modal>
  )
}