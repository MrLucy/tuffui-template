// Avara UI · MIT License · Source: https://avaraui.com/r/memories-card-motion.json
'use client'

import { cn } from '@/lib/utils'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react'
import type { PanInfo, Variants } from 'motion/react'
import { Calendar, MapPin, RotateCcw, Sparkles } from 'lucide-react'
import React, { useState } from 'react'

export interface MemoryItem {
  id: string
  title: string
  location?: string
  date?: string
  image: string
  description?: string
  tag?: string
}

export interface MemoriesCardProps extends React.HTMLAttributes<HTMLDivElement> {
  items: MemoryItem[]
  onCardChange?: (index: number) => void
}

// The swiped card leaves toward the side it was thrown: `custom` is -1 or 1.
const exitVariants: Variants = {
  exit: (direction: number) => ({
    x: direction * 350,
    opacity: 0,
    rotateZ: direction * 20,
    transition: { duration: 0.3 },
  }),
}

export const MemoriesCard = React.forwardRef<HTMLDivElement, MemoriesCardProps>(
  ({ items, onCardChange, className, ...props }, ref) => {
    const [cards, setCards] = useState<MemoryItem[]>(items)
    const [exitDirection, setExitDirection] = useState(1)

    // 3D Tilt Motion Values for Front Card
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const rotateX = useSpring(useTransform(y, [-150, 150], [14, -14]), {
      stiffness: 300,
      damping: 25,
    })
    const rotateY = useSpring(useTransform(x, [-150, 150], [-14, 14]), {
      stiffness: 300,
      damping: 25,
    })

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      x.set(e.clientX - centerX)
      y.set(e.clientY - centerY)
    }

    const handleMouseLeave = () => {
      x.set(0)
      y.set(0)
    }

    const handleDragEnd = (_: MouseEvent | TouchEvent, info: PanInfo) => {
      const threshold = 80
      if (Math.abs(info.offset.x) > threshold) {
        setExitDirection(info.offset.x < 0 ? -1 : 1)
        // Remove front card and push to the back of the stack
        setCards((prev) => {
          const newStack = [...prev]
          const removed = newStack.shift()
          if (removed) newStack.push(removed)

          // Fixed: Pass the correct original index of the NEW front card to the parent
          if (onCardChange && newStack[0]) {
            const nextActiveIndex = items.findIndex(
              (orig) => orig.id === newStack[0].id,
            )
            onCardChange(nextActiveIndex)
          }

          return newStack
        })
        x.set(0)
        y.set(0)
      }
    }

    const handleReset = () => {
      setExitDirection(1)
      setCards(items)
      if (onCardChange) onCardChange(0)
    }

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex min-h-[330px] w-full flex-col items-center justify-center py-3 select-none perspective-[1200px]',
          className,
        )}
        {...props}
      >
        {/* Card Stack Container */}
        <div className="relative flex h-[300px] w-full max-w-[300px] items-center justify-center">
          <AnimatePresence custom={exitDirection}>
            {cards.map((item, index) => {
              const isFront = index === 0

              // Fixed: Lookup card's original sequence index in the immutable items prop
              const originalIndex = items.findIndex(
                (orig) => orig.id === item.id,
              )

              // Calculate fanned background spread offsets
              const fanRotate = index === 1 ? 6 : index === 2 ? -6 : index * 4
              const fanX = index === 1 ? 24 : index === 2 ? -24 : 0
              const fanY = index * 12
              const fanScale = 1 - index * 0.05
              const fanZIndex = cards.length - index

              // Hide cards deep in the stack for performance
              if (index > 3) return null

              return (
                <motion.div
                  key={item.id}
                  style={
                    isFront
                      ? { rotateX, rotateY, zIndex: fanZIndex }
                      : { zIndex: fanZIndex }
                  }
                  onMouseMove={isFront ? handleMouseMove : undefined}
                  onMouseLeave={isFront ? handleMouseLeave : undefined}
                  drag={isFront ? 'x' : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.6}
                  onDragEnd={isFront ? handleDragEnd : undefined}
                  initial={{ scale: 0.8, opacity: 0, y: 50 }}
                  animate={{
                    scale: fanScale,
                    rotateZ: isFront ? 0 : fanRotate,
                    x: isFront ? 0 : fanX,
                    y: isFront ? 0 : fanY,
                    opacity: 1 - index * 0.2,
                  }}
                  custom={exitDirection}
                  variants={exitVariants}
                  exit="exit"
                  transition={{ type: 'spring', stiffness: 260, damping: 25 }}
                  className={cn(
                    'absolute inset-0 overflow-hidden rounded-xl shadow-2xl transition-shadow duration-300',
                    'border border-border/80 bg-card',
                    isFront
                      ? 'cursor-grab ring-2 shadow-primary/20 ring-primary/30 active:cursor-grabbing dark:shadow-primary/20'
                      : 'pointer-events-none shadow-md shadow-zinc-300/40 hover:border-primary/50 dark:shadow-black/50',
                  )}
                >
                  {/* Card Background Image */}
                  <div className="relative h-full w-full overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="pointer-events-none h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    />

                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent dark:from-black/95 dark:via-black/40 dark:to-transparent" />

                    {/* Top Bar Badges */}
                    <div className="pointer-events-none absolute inset-x-5 top-3 flex items-center justify-between text-white">
                      {item.tag ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold tracking-wider text-primary-foreground uppercase shadow-sm backdrop-blur-md">
                          <Sparkles className="h-3 w-3" />
                          {item.tag}
                        </span>
                      ) : (
                        <div />
                      )}

                      {/* Fixed: Displays actual sequence (1/4, 2/4, etc.) based on original index */}
                      <span className="rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-xs font-medium text-white/80 backdrop-blur-md">
                        {originalIndex + 1} / {items.length}
                      </span>
                    </div>

                    {/* Bottom Metadata Payload */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col justify-end p-3 text-white">
                      <div className="mb-2 flex items-center gap-4 text-xs font-medium text-zinc-300 dark:text-zinc-400">
                        {item.date && (
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-primary" />
                            {item.date}
                          </span>
                        )}
                        {item.location && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-primary" />
                            {item.location}
                          </span>
                        )}
                      </div>

                      <h3 className="mb-2 text-lg leading-snug font-semibold tracking-tight text-white md:text-lg">
                        {item.title}
                      </h3>

                      {item.description && (
                        <p className="line-clamp-2 text-sm leading-relaxed text-zinc-300 dark:text-zinc-400">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Action Controls & Instructions */}
        <div className="z-40 mt-6 flex w-full max-w-[340px] items-center justify-between px-2 sm:max-w-[380px]">
          <span className="text-xs font-medium tracking-wide text-muted-foreground">
            ← 左右滑动，切换研究卡片 →
          </span>

          <button
            onClick={handleReset}
            title="恢复卡片顺序"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm transition-all hover:border-primary/30 hover:bg-primary hover:text-primary-foreground active:scale-95"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            重置
          </button>
        </div>
      </div>
    )
  },
)

MemoriesCard.displayName = 'MemoriesCard'
