import { Modal } from "@/shared/components/Modal"
import { useTranslation } from "react-i18next"
interface ErrorModalProps {
  error: string | null
  onClose: () => void
}

export const ErrorModal = ({ error, onClose }: ErrorModalProps) => {
  const { t } = useTranslation('yams')
  return (
    <Modal
      isOpen={!!error}
      onClose={onClose}
      title={t('ui.error')}
    >
      <div className="text-center">
        <p className="text-lg my-5">{error}</p>
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