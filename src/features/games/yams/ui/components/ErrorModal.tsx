interface ErrorModalProps {
  error: string | null
  onClose: () => void
}

export const ErrorModal = ({ error, onClose }: ErrorModalProps) => {
  if (!error) return null 

  return (
    <div className="errorModal">
      <div>
        <h2>Erreur</h2>
        <p>{error}</p>
        <button onClick={onClose} className="action">OK</button>
      </div>
    </div>
  )
}