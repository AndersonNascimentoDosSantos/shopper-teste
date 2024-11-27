import * as PrimitiveDialog from '@radix-ui/react-dialog'
import clsx from 'clsx'
import { type ReactNode } from 'react'

interface Props extends PrimitiveDialog.DialogContentProps {
  children: ReactNode
}

export const DialogContent = ({ children, className }: Props) => {
  return (
    <PrimitiveDialog.Portal>
      <PrimitiveDialog.Overlay className="fixed inset-0 animate-overlay-show bg-black/30" />
      <PrimitiveDialog.Content
        className={clsx(
          'absolute-centered-y absolute-centered-x fixed rounded-4xl bg-neutral-20 p-8 text-white shadow-lg',
          className,
        )}
      >
        {children}
      </PrimitiveDialog.Content>
    </PrimitiveDialog.Portal>
  )
}
