'use client'
import { Button } from '@/components/ui/button'
import { Modal, ModalContent, ModalTrigger } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'

interface Props {
  open: boolean
  setOpen: (x: boolean) => void
  onConfirm: () => void
  userName: string
  disabled: boolean
}

export function ConfirmSubmissionModal({ open, setOpen, onConfirm, userName, disabled }: Props) {
  const [confirmName, setConfirmName] = useState('')
  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <Button disabled={disabled} onClick={() => setOpen(true)}>Submit Course Selection</Button>
      </ModalTrigger>
      <ModalContent className="w-[400px]">
        <h3 className="text-lg font-bold mb-4">Confirm Submission</h3>
        <p>This action is <strong>irrevocable</strong>. Type your full name to confirm:</p>
        <Input placeholder="Your full name" value={confirmName} onChange={e => setConfirmName(e.target.value)} className="mt-2" />
        <Button
          className="mt-4"
          disabled={confirmName !== userName}
          onClick={() => { onConfirm(); setOpen(false) }}
        >
          I'm sure, submit my courses
        </Button>
      </ModalContent>
    </Modal>
  )
}
