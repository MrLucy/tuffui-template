/** Compatibility bridge to the workspace's existing Radix tooltip primitives. */
import type { ComponentProps } from 'react'

import {
  Tooltip as Root,
  TooltipContent as Content,
  TooltipProvider,
  TooltipTrigger,
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
  showArrow,
  animated,
  ...props
}: ComponentProps<typeof Content> & {
  showArrow?: boolean
  animated?: string
}) {
  return <Content {...props} showArrow={showArrow} data-animation={animated} />
}
