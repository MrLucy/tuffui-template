'use client'

import { Avatar as AvatarPrimitive } from 'radix-ui'
import * as React from 'react'

import { cn } from '@/lib/utils'

type AvatarRootProps = React.ComponentPropsWithoutRef<
  typeof AvatarPrimitive.Root
>
type AvatarImageProps = React.ComponentPropsWithoutRef<
  typeof AvatarPrimitive.Image
>
type AvatarFallbackProps = React.ComponentPropsWithoutRef<
  typeof AvatarPrimitive.Fallback
>

function Avatar({ className, ...props }: AvatarRootProps) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        // Fixed: Replaced `size-8` with explicit `h-8 w-8`
        'relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full',
        className,
      )}
      {...props}
    />
  )
}

function AvatarImage({ className, ...props }: AvatarImageProps) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      // Fixed: Replaced `size-full` with `h-full w-full` and added `object-cover`
      className={cn('aspect-square h-full w-full object-cover', className)}
      {...props}
    />
  )
}

function AvatarFallback({ className, ...props }: AvatarFallbackProps) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        // Fixed: Replaced `size-full` with `h-full w-full`
        'flex h-full w-full items-center justify-center rounded-full bg-muted',
        className,
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarFallback, AvatarImage }
