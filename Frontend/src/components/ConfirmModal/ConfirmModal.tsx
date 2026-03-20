import { useEffect } from 'react'
import { Overlay, Modal, Title, Message, ButtonGroup, CancelButton, ConfirmButton } from './ConfirmModal.styles'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <Overlay onClick={onCancel} role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title">
      <Modal onClick={(e) => e.stopPropagation()}>
        <Title id="confirm-modal-title">{title}</Title>
        <Message>{message}</Message>
        <ButtonGroup>
          <CancelButton type="button" onClick={onCancel}>
            {cancelLabel}
          </CancelButton>
          <ConfirmButton type="button" onClick={onConfirm}>
            {confirmLabel}
          </ConfirmButton>
        </ButtonGroup>
      </Modal>
    </Overlay>
  )
}
