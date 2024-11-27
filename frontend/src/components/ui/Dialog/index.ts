import * as PrimitiveDialog from '@radix-ui/react-dialog'
import { DialogContent } from './DialogContent'
import { DialogClose } from './DialogClose'
import { DialogHeader } from './DialogHeader'
import { DialogFooter } from './DialogFooter'

export const Dialog = {
  Root: PrimitiveDialog.Root,
  Trigger: PrimitiveDialog.Trigger,
  Content: DialogContent,
  Title: PrimitiveDialog.Title,
  Close: DialogClose,
  Header: DialogHeader,
  Footer: DialogFooter,
}
