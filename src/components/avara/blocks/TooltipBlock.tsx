/** Compatibility bridge to the workspace's existing Radix tooltip primitives. */
import type { ComponentProps } from 'react'
import {
  Tooltip as Root,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent as Content,
} from '@/components/ui/tooltip'
export { TooltipTrigger }
export function Tooltip({ children, ...props }: ComponentProps<typeof Root>) {
  return (
    <TooltipProvider>
      <Root {...props}>{children}</Root>
    </TooltipProvider>
  )
}
export function TooltipContent({
  showArrow: _showArrow,
  animated: _animated,
  ...props
}: ComponentProps<typeof Content> & {
  showArrow?: boolean
  animated?: string
}) {
  return <Content {...props} />
}
