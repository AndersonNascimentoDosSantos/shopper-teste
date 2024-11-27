import { Title } from '@radix-ui/react-dialog'
import { type ReactNode } from 'react'
import { DialogClose } from './DialogClose'

interface DialogHeaderProps {
  title: string
  children?: ReactNode
}

export function DialogHeader({ title, children }: DialogHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-b-neutral-50 pb-8">
      <div className="flex items-center gap-4">
        <DialogClose />
        <Title className="text-body1">{title}</Title>
      </div>

      <div>{children}</div>
    </div>
  )
}
