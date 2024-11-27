import * as PrimitiveDialog from '@radix-ui/react-dialog'
import { MdClose } from 'react-icons/md'

export const DialogClose = () => {
  return (
    <PrimitiveDialog.Close type="button" title="Fechar" className="text-white">
      <MdClose size={16} />
    </PrimitiveDialog.Close>
  )
}
