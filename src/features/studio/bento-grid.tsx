import { useLayoutEffect, useRef } from 'react'
import type { ReactNode } from 'react'

/** Equal-width lanes prevent the holes caused by mixed column spans. */
export function BentoGrid({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const grid = ref.current
    if (!grid) return
    let frame = 0
    let lastWidth = -1
    let disposed = false
    const place = () => {
      if (disposed) return
      const width = grid.clientWidth
      if (!width) return
      const styles = getComputedStyle(grid)
      const columns = Math.max(
        1,
        Number(styles.getPropertyValue('--bento-columns')) || 2,
      )
      const gap = parseFloat(styles.columnGap) || 10
      const cardWidth = (width - (columns - 1) * gap) / columns
      const items = Array.from(grid.children) as HTMLElement[]
      // Set widths together before measuring, so charts only reflow once.
      for (const item of items) {
        const next = `${cardWidth}px`
        if (item.style.width !== next) item.style.width = next
        item.style.gridRowEnd = ''
      }
      grid.classList.add('is-packed')
      const heights = items.map((item) => item.getBoundingClientRect().height)
      const lanes = Array<number>(columns).fill(0)
      items.forEach((item, index) => {
        const lane = lanes.indexOf(Math.min(...lanes))
        const x = lane * (cardWidth + gap)
        const y = lanes[lane]
        item.style.transform = `translate(${x}px, ${y}px)`
        lanes[lane] = y + heights[index] + gap
      })
      const height = Math.max(0, ...lanes) - (items.length ? gap : 0)
      const next = `${height}px`
      if (grid.style.height !== next) grid.style.height = next
      lastWidth = width
    }
    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(place)
    }
    const observer = new ResizeObserver((entries) => {
      if (
        entries.some(
          (entry) => entry.target !== grid || grid.clientWidth !== lastWidth,
        )
      )
        schedule()
    })
    const observe = () => {
      observer.disconnect()
      observer.observe(grid)
      Array.from(grid.children).forEach((child) => observer.observe(child))
      place()
    }
    const mutations = new MutationObserver(observe)
    mutations.observe(grid, { childList: true })
    observe()
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      mutations.disconnect()
    }
  }, [children])
  return (
    <div ref={ref} className={`bento-grid ${className}`}>
      {children}
    </div>
  )
}
