import { type ReactNode } from 'react'

interface DialogFooterProps {
  children?: ReactNode
}

export function DialogFooter({ children }: DialogFooterProps) {
  return (
    <div className="flex justify-end border-t border-t-neutral-50 pt-8">
      <div>{children}</div>
    </div>
  )
}
