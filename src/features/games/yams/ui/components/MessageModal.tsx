import { Modal } from "@/shared/components/Modal"
import type { Message } from "../hooks/useSaveScore"
import { useTranslation } from "react-i18next"

interface MessageModalProps {
  message: Message | null
  onClose: () => void
}

export const MessageModal = ({ message, onClose }: MessageModalProps) => {
  const { t } = useTranslation("yams")

  if (!message) return null

  return (
    <Modal
      isOpen={!!message}
      onClose={onClose}
      title={message.type === 'validation'
        ? t('ui.messageModal.validationTitle')
        : t('ui.messageModal.successTitle')}
    >
      <div className={`message-${message.type} p-4 rounded text-center`}>
        <p className="mb-4 font-content">{message.text}</p>
        <button
          onClick={onClose}
          className="action md"
        >
          OK
        </button>
      </div>
    </Modal>
  )
}