// Avara UI · MIT License · Source: https://avaraui.com/r/draggable-card-list-motion.json
'use client'

import {
  Calendar,
  CheckCircle2,
  Circle,
  ExternalLink,
  GripVertical,
} from 'lucide-react'
import { Reorder, useDragControls } from 'motion/react'
import { useState } from 'react'

import { cn } from '@/lib/utils'

export interface DraggableCardItem {
  id: string | number
  title: string
  description?: string
  date?: string
  badge?: string
  badgeStyle?: string
  accentColor?: string
  hoverBorderColor?: string
  linkText?: string
  linkUrl?: string
  completed?: boolean
  category?: string
}

export interface DraggableCardListProps {
  /** List of draggable card items */
  items?: DraggableCardItem[]
  /** Card style variant: "classic" | "modern" (default: "classic") */
  variant?: 'classic' | 'modern'
  /** Callback fired when items are reordered */
  onReorder?: (newItems: DraggableCardItem[]) => void
  /** Callback fired when an item's completion status is toggled */
  onToggleComplete?: (id: string | number, completed: boolean) => void
  /** Optional title heading text above the list */
  title?: string
  /** Optional subtitle text under the heading */
  subtitle?: string
  /** Drag handle position: "right" or "left" (default: "right") */
  dragHandlePosition?: 'right' | 'left'
  /** Enable interactive completion checkboxes (default: false) */
  enableCheckboxes?: boolean
  /** Enable category badges (default: true) */
  enableBadges?: boolean
  /** Container class name */
  className?: string
  /** Card container class name */
  cardClassName?: string
}

const DEFAULT_ITEMS: DraggableCardItem[] = [
  {
    id: '1',
    title: 'System Performance Audit',
    description:
      'Optimize bundle splitting, reduce LCP to 0.8s, and tree-shake unused assets',
    date: '2026-08-30',
    badge: 'PERFORMANCE',
    badgeStyle:
      'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30',
    accentColor: 'from-amber-400 via-orange-500 to-yellow-500',
    hoverBorderColor:
      'hover:border-amber-500/80 dark:hover:border-amber-400/80',
    completed: false,
  },
  {
    id: '2',
    title: 'Security Vulnerability Patch',
    description:
      'Upgrade dependencies, sanitize input payloads, and rotate API tokens',
    date: '2026-08-30',
    badge: 'SECURITY',
    badgeStyle:
      'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30',
    accentColor: 'from-emerald-400 via-teal-500 to-cyan-500',
    hoverBorderColor:
      'hover:border-emerald-500/80 dark:hover:border-emerald-400/80',
    completed: false,
  },
  {
    id: '3',
    title: 'UI Component Library Release',
    description:
      'Publish version 2.4 with dark mode token updates and accessible aria roles',
    date: '2026-08-30',
    badge: 'LIBRARY',
    badgeStyle:
      'bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/30',
    accentColor: 'from-purple-400 via-indigo-500 to-violet-500',
    hoverBorderColor:
      'hover:border-purple-500/80 dark:hover:border-purple-400/80',
    completed: false,
  },
  {
    id: '4',
    title: 'Database Schema Migration',
    description:
      'Execute zero-downtime PostgreSQL indexing and partition query optimization',
    date: '2026-08-30',
    badge: 'DATABASE',
    badgeStyle:
      'bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/30',
    accentColor: 'from-blue-400 via-indigo-500 to-cyan-500',
    hoverBorderColor: 'hover:border-blue-500/80 dark:hover:border-blue-400/80',
    linkText: 'View database migration logs',
    linkUrl: '#',
    completed: false,
  },
]

interface SingleCardItemProps {
  item: DraggableCardItem
  variant: 'classic' | 'modern'
  dragHandlePosition: 'right' | 'left'
  enableCheckboxes: boolean
  enableBadges: boolean
  cardClassName?: string
  onToggle?: (id: string | number) => void
}

function SingleCardItem({
  item,
  variant,
  dragHandlePosition,
  enableCheckboxes,
  enableBadges,
  cardClassName,
  onToggle,
}: SingleCardItemProps) {
  const controls = useDragControls()

  const renderDragHandle = () => (
    <div
      onPointerDown={(e) => controls.start(e)}
      aria-label="拖动以调整顺序"
      className={cn(
        // touch-none: the handle's vertical drag must not scroll the page instead.
        'shrink-0 cursor-grab touch-none rounded-2xl border border-border/50 bg-muted/60 p-2.5 text-muted-foreground/60 transition-all duration-200 hover:border-primary/30 hover:bg-primary hover:text-primary-foreground active:cursor-grabbing',
      )}
    >
      <GripVertical className="h-5 w-5" />
    </div>
  )

  // VARIANT 1: Modern (Glass-Glow Card + Left Accent Color Border Shift on Hover)
  if (variant === 'modern') {
    return (
      <Reorder.Item
        value={item}
        id={String(item.id)}
        dragControls={controls}
        dragListener={false}
        whileDrag={{
          scale: 1.02,
          zIndex: 50,
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className={cn(
          'group relative flex w-full items-start justify-between gap-3 overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-r from-card via-card to-primary/5 p-4 shadow-none backdrop-blur-2xl transition-colors select-none sm:p-3 dark:to-primary/10',
          item.hoverBorderColor || 'hover:border-primary/80',
          item.completed && 'bg-muted/40 opacity-60',
          cardClassName,
        )}
      >
        {/* Glowing Left Side Gradient Bar */}
        <div
          className={cn(
            'absolute top-0 bottom-0 left-0 w-1.5 bg-gradient-to-b',
            item.accentColor || 'from-primary via-primary/80 to-primary/40',
          )}
        />

        {dragHandlePosition === 'left' && renderDragHandle()}

        {/* Main Card Content */}
        <div className="min-w-0 flex-1 space-y-1.5 pl-2">
          {/* Header Row: Title & Right-Aligned Badge */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              {enableCheckboxes && (
                <button
                  type="button"
                  onClick={() => onToggle?.(item.id)}
                  aria-label={
                    item.completed
                      ? `将${item.title}标记为未完成`
                      : `完成${item.title}`
                  }
                  aria-pressed={!!item.completed}
                  className="shrink-0 cursor-pointer text-muted-foreground transition-colors hover:text-primary"
                >
                  {item.completed ? (
                    <CheckCircle2 className="h-4 w-4 fill-emerald-500/20 text-emerald-500" />
                  ) : (
                    <Circle className="h-4 w-4" />
                  )}
                </button>
              )}
              <h3
                className={cn(
                  'text-base leading-tight font-semibold tracking-tight text-foreground',
                  item.completed && 'text-muted-foreground line-through',
                )}
              >
                {item.title}
              </h3>
            </div>

            {enableBadges && item.badge && (
              <span
                className={cn(
                  'ml-auto shrink-0 rounded-md px-2.5 py-0.5 text-[9px] font-extrabold tracking-wider uppercase shadow-2xs',
                  item.badgeStyle ||
                    'border border-primary/30 bg-primary/10 text-primary',
                )}
              >
                {item.badge}
              </span>
            )}
          </div>

          {item.description && (
            <p className="text-xs leading-relaxed font-medium text-muted-foreground">
              {item.description}
            </p>
          )}

          {/* Footer Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/40 pt-2 font-mono text-xs text-muted-foreground/80">
            {item.date && (
              <div className="flex items-center gap-1.5 text-[11px] font-semibold">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                <span>{item.date}</span>
              </div>
            )}

            {item.linkText && (
              <a
                href={item.linkUrl || '#'}
                onClick={(e) => {
                  if (!item.linkUrl || item.linkUrl === '#') e.preventDefault()
                }}
                className="ml-auto inline-flex items-center gap-1 font-sans text-[11px] font-semibold text-primary transition-colors hover:text-primary/80 hover:underline"
              >
                <span>{item.linkText}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>

        {dragHandlePosition === 'right' && renderDragHandle()}
      </Reorder.Item>
    )
  }

  // VARIANT 2: Classic (Left Accent Color Border Shift on Hover, Zero Shadow)
  return (
    <Reorder.Item
      value={item}
      id={String(item.id)}
      whileDrag={{
        scale: 1.02,
        zIndex: 50,
      }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={cn(
        'group relative flex w-full cursor-grab items-start justify-between gap-3 rounded-2xl border border-border/80 bg-card p-4 shadow-none backdrop-blur-xl transition-colors select-none active:cursor-grabbing sm:p-3',
        item.hoverBorderColor || 'hover:border-primary/80',
        item.completed && 'bg-muted/40 opacity-60',
        cardClassName,
      )}
    >
      {dragHandlePosition === 'left' && renderDragHandle()}

      {/* Main Card Content */}
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          {enableCheckboxes && (
            <button
              type="button"
              onClick={() => onToggle?.(item.id)}
              aria-label={
                item.completed
                  ? `将${item.title}标记为未完成`
                  : `完成${item.title}`
              }
              aria-pressed={!!item.completed}
              className="shrink-0 cursor-pointer text-muted-foreground transition-colors hover:text-primary"
            >
              {item.completed ? (
                <CheckCircle2 className="h-4 w-4 fill-emerald-500/20 text-emerald-500" />
              ) : (
                <Circle className="h-4 w-4" />
              )}
            </button>
          )}
          <h3
            className={cn(
              'text-base leading-tight font-semibold tracking-tight text-foreground',
              item.completed && 'text-muted-foreground line-through',
            )}
          >
            {item.title}
          </h3>

          {enableBadges && item.badge && (
            <span
              className={cn(
                'ml-auto rounded-md px-2.5 py-0.5 text-[9px] font-extrabold tracking-wider uppercase shadow-2xs sm:ml-0',
                item.badgeStyle ||
                  'border border-primary/30 bg-primary/10 text-primary',
              )}
            >
              {item.badge}
            </span>
          )}
        </div>

        {item.description && (
          <p className="text-xs leading-relaxed font-medium text-muted-foreground">
            {item.description}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 font-mono text-xs text-muted-foreground/80">
          {item.date && (
            <div className="flex items-center gap-1 text-[11px]">
              <Calendar className="h-3.5 w-3.5 opacity-70" />
              <span>{item.date}</span>
            </div>
          )}

          {item.linkText && (
            <a
              href={item.linkUrl || '#'}
              onClick={(e) => {
                if (!item.linkUrl || item.linkUrl === '#') e.preventDefault()
              }}
              className="ml-auto inline-flex items-center gap-1 font-sans text-[11px] font-semibold text-primary transition-colors hover:text-primary/80 hover:underline"
            >
              <span>{item.linkText}</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>

      {dragHandlePosition === 'right' && renderDragHandle()}
    </Reorder.Item>
  )
}

export function DraggableCardList({
  items: initialItems = DEFAULT_ITEMS,
  variant = 'classic',
  onReorder,
  onToggleComplete,
  title,
  subtitle,
  dragHandlePosition = 'right',
  enableCheckboxes = false,
  enableBadges = true,
  className,
  cardClassName,
}: DraggableCardListProps) {
  const [itemList, setItemList] = useState<DraggableCardItem[]>(initialItems)
  // Re-seed when the caller hands over a different array. Doing it here
  // rather than in an effect avoids rendering the previous list first.
  const [seededFrom, setSeededFrom] = useState(initialItems)
  if (seededFrom !== initialItems) {
    setSeededFrom(initialItems)
    setItemList(initialItems)
  }

  const handleReorder = (newItems: DraggableCardItem[]) => {
    setItemList(newItems)
    if (onReorder) {
      onReorder(newItems)
    }
  }

  const handleToggleComplete = (id: string | number) => {
    const updated = itemList.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item,
    )
    setItemList(updated)
    const target = updated.find((i) => i.id === id)
    if (onToggleComplete && target) {
      onToggleComplete(id, target.completed || false)
    }
  }

  return (
    <div
      className={cn(
        'mx-auto w-full max-w-xl space-y-2 py-2 select-none',
        className,
      )}
    >
      {/* Optional Title Header */}
      {title && (
        <div className="mb-6 space-y-1 text-center">
          <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs font-medium text-muted-foreground sm:text-sm">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Reorder Group Container */}
      <Reorder.Group
        axis="y"
        values={itemList}
        onReorder={handleReorder}
        className="space-y-2"
      >
        {itemList.map((item) => (
          <SingleCardItem
            key={item.id}
            item={item}
            variant={variant}
            dragHandlePosition={dragHandlePosition}
            enableCheckboxes={enableCheckboxes}
            enableBadges={enableBadges}
            cardClassName={cardClassName}
            onToggle={handleToggleComplete}
          />
        ))}
      </Reorder.Group>
    </div>
  )
}

export default DraggableCardList
