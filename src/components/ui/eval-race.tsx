// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
'use client'

import { formatCount } from '@/lib/locale'
import { FlagCheckered } from '@phosphor-icons/react'
import {
  MotionConfig,
  motion,
  useReducedMotion,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react'
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { Panel, Shell, ShellHeader } from '@/components/ui/surface'
import { cn } from '@/lib/utils'

export type EvalRacer = {
  id: string
  /** Short name drawn in the standings, e.g. a model id. */
  label: string
  /** Full name for screen readers. Defaults to `label`. */
  name?: string
  /** Cases scored so far, `0…total`. */
  scored: number
  /** Duration of each completed lap, in seconds. */
  laps?: number[]
}

export type EvalRaceProps = {
  racers: EvalRacer[]
  /** Cases in the eval set; the finish. */
  total: number
  /** Cases per lap of the track. */
  perLap: number
  title?: string
  subtitle?: string
  /** `race` puts the track first; `standings` leads with the table. */
  layout?: 'race' | 'standings'
  /** Defaults to final once every racer has scored `total`. */
  status?: 'live' | 'final'
  formatTime?: (seconds: number) => string
  /** Called when a racer is hovered or reached with the arrow keys. */
  onSelect?: (id: string | null) => void
  className?: string
}

type Standing = EvalRacer & {
  rank: number
  done: boolean
  lap: number
  best: number | null
  last: number | null
  /** Cases behind the leader. */
  behind: number
  gap: string
}

const round = (n: number) => Math.round(n * 100) / 100
const sum = (xs: number[] = []) => xs.reduce((a, b) => a + b, 0)
const plural = formatCount

function useWidth() {
  const ref = useRef<HTMLDivElement>(null)
  // null until measured, so the track draws once at its real size.
  const [width, setWidth] = useState<number | null>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    setWidth(el.getBoundingClientRect().width)
    const observer = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width),
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return [ref, width ?? 400, width !== null] as const
}

/** Stadium-shaped track: two straights and two half circles around (mid, cy). */
function stadium(width: number, height: number, margin: number) {
  const r = (height - 2 * margin) / 2
  const cy = height / 2
  const x0 = margin + r
  const x1 = width - margin - r
  const mid = width / 2
  const straight = Math.max(x1 - x0, 0)
  const arc = Math.PI * r
  const perimeter = 2 * straight + 2 * arc

  /** Point `laps` around, clockwise from the start line at the bottom centre. */
  const at = (laps: number, rad = r): [number, number] => {
    let s = (((laps % 1) + 1) % 1) * perimeter
    if (s < straight / 2) return [mid - s, cy + rad]
    s -= straight / 2
    if (s < arc) {
      const a = Math.PI / 2 + s / r
      return [x0 + rad * Math.cos(a), cy + rad * Math.sin(a)]
    }
    s -= arc
    if (s < straight) return [x0 + s, cy - rad]
    s -= straight
    if (s < arc) {
      const a = -Math.PI / 2 + s / r
      return [x1 + rad * Math.cos(a), cy + rad * Math.sin(a)]
    }
    return [x1 - (s - arc), cy + rad]
  }

  const path = (rad = r) => {
    const [a, b, c, d] = [mid, x0, x1, rad].map(round)
    const [top, bottom] = [round(cy - rad), round(cy + rad)]
    return `M${a} ${bottom}H${b}A${d} ${d} 0 0 1 ${b} ${top}H${c}A${d} ${d} 0 0 1 ${c} ${bottom}Z`
  }

  return { r, cy, mid, perimeter, at, path }
}

type Track = ReturnType<typeof stadium>

function rankRacers(
  racers: EvalRacer[],
  total: number,
  perLap: number,
  formatTime: (s: number) => string,
): Standing[] {
  const laps = Math.ceil(total / perLap)
  const sorted = racers
    .map((r, i) => ({ r, i }))
    .sort(
      (a, b) =>
        b.r.scored - a.r.scored || sum(a.r.laps) - sum(b.r.laps) || a.i - b.i,
    )
    .map(({ r }) => r)
  const lead = sorted[0]
  return sorted.map((r, rank) => {
    const behind = lead ? lead.scored - r.scored : 0
    const time = sum(r.laps) - sum(lead?.laps)
    const lapped = Math.floor(behind / perLap)
    const gap =
      rank === 0
        ? '领先'
        : lapped > 0
          ? `+${plural(lapped, 'lap')}`
          : behind > 0
            ? `+${behind}`
            : time > 0
              ? `+${formatTime(time)}`
              : '+0'
    return {
      ...r,
      rank,
      done: r.scored >= total,
      lap: Math.min(Math.floor(r.scored / perLap) + 1, laps),
      best: r.laps?.length ? Math.min(...r.laps) : null,
      last: r.laps?.length ? r.laps[r.laps.length - 1] : null,
      behind,
      gap,
    }
  })
}

/**
 * Several models scoring the same eval set, drawn as a race: one lap of the
 * track per `perLap` cases, numbered markers for positions, and standings
 * with gaps, lapped runners and the fastest lap.
 */
export function EvalRace({
  racers,
  total,
  perLap,
  title = '评测赛道',
  subtitle,
  layout = 'race',
  status,
  formatTime = (s) => `${s.toFixed(1)} 秒`,
  onSelect,
  className,
}: EvalRaceProps) {
  const [active, setActive] = useState<string | null>(null)
  const [fromKeyboard, setFromKeyboard] = useState(false)

  const laps = Math.max(Math.ceil(total / perLap), 1)
  const standings = rankRacers(racers, total, perLap, formatTime)
  const leader = standings[0]
  const second = standings[1]
  const final = status ? status === 'final' : standings.every((s) => s.done)

  const fastest = standings
    .filter((s) => s.best !== null)
    .sort((a, b) => (a.best ?? 0) - (b.best ?? 0))[0]

  const margin = !second
    ? ''
    : second.behind >= perLap
      ? `领先${plural(Math.floor(second.behind / perLap), 'lap')}`
      : second.behind > 0
        ? `领先${plural(second.behind, 'case')}`
        : second.gap.startsWith('+') && second.gap !== '+0'
          ? `领先${second.gap.slice(1)}`
          : ''
  const leaderLine = leader
    ? `${leader.label} ${leader.done ? (final ? '获胜' : '率先完成') : margin || '暂时领先'}${leader.done && margin ? `，${margin}` : ''}`
    : '暂无评测模型'

  const select = (id: string | null, keyboard: boolean) => {
    setFromKeyboard(keyboard)
    setActive(id)
    onSelect?.(id)
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    const n = standings.length
    if (!n) return
    const index = standings.findIndex((s) => s.id === active)
    const keys: Record<string, number> = {
      ArrowDown: index + 1,
      ArrowRight: index + 1,
      ArrowUp: (index < 0 ? n : index) - 1,
      ArrowLeft: (index < 0 ? n : index) - 1,
      Home: 0,
      End: n - 1,
    }
    if (event.key === 'Escape') return select(null, true)
    if (!(event.key in keys)) return
    event.preventDefault()
    select(standings[(keys[event.key] + n) % n].id, true)
  }

  const focused = standings.find((s) => s.id === active)
  const compact = layout === 'standings'

  const headline = (
    <div className="min-w-0">
      <p className="text-[0.8125rem] text-pretty text-muted-foreground">
        {leader && (
          <span className="font-medium text-foreground">{leader.label}</span>
        )}
        {leader ? leaderLine.slice(leader.label.length) : leaderLine}
      </p>
      <p className="mt-0.5 text-[1.75rem] leading-9 font-medium tracking-tight tabular-nums">
        {(leader?.scored ?? 0).toLocaleString('zh-CN')}
        <span className="text-lg text-muted-foreground">
          {' '}
          / {total.toLocaleString('zh-CN')}
        </span>
      </p>
      <p className="text-xs text-muted-foreground">
        已评分用例 · 每圈 = {perLap.toLocaleString('zh-CN')}
      </p>
    </div>
  )

  return (
    <MotionConfig reducedMotion="user">
      <Shell className={cn('max-w-xl', className)}>
        <ShellHeader
          icon={FlagCheckered}
          title={title}
          subtitle={
            subtitle ?? `${plural(racers.length, 'model')} · ${total}条用例`
          }
          aside={
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              {final ? (
                <FlagCheckered
                  weight="fill"
                  aria-hidden="true"
                  className="size-3.5"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-brand motion-safe:animate-pulse"
                />
              )}
              {final
                ? '已结束'
                : compact
                  ? `圈数${leader?.lap ?? 1}共${laps}`
                  : '实时'}
            </span>
          }
        />
        <Panel className="p-4 @max-sm:p-3">
          {compact ? (
            <div className="flex items-center justify-between gap-4">
              {headline}
              <TrackView
                standings={standings}
                perLap={perLap}
                active={active}
                mini
                className="w-[34%] max-w-44 shrink-0"
              />
            </div>
          ) : (
            <>
              {headline}
              <TrackView
                standings={standings}
                perLap={perLap}
                active={active}
                onSelect={(id) => select(id, false)}
                className="mt-4"
                label={
                  <>
                    <p className="text-2xl font-medium tracking-tight tabular-nums @max-sm:text-xl">
                      {final ? (
                        '已结束'
                      ) : (
                        <>
                          圈数 {leader?.lap ?? 1}
                          <span className="text-muted-foreground">
                            {' '}
                            / {laps}
                          </span>
                        </>
                      )}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {fastest ? (
                        <>
                          最快圈速 · {fastest.label}{' '}
                          <span className="font-mono text-brand tabular-nums">
                            {formatTime(fastest.best ?? 0)}
                          </span>
                        </>
                      ) : (
                        `首圈 ·${perLap}条用例`
                      )}
                    </p>
                  </>
                }
              />
            </>
          )}

          <div
            tabIndex={0}
            role="group"
            aria-label={`${title}排行榜。使用方向键查看各模型。`}
            onKeyDown={onKeyDown}
            onBlur={() => fromKeyboard && select(null, true)}
            onPointerLeave={() => select(null, false)}
            className="mt-4 rounded-xl outline-offset-2"
          >
            <div className="eval-racer-grid">
              {standings.map((s) => (
                <motion.article
                  key={s.id}
                  layout
                  onPointerEnter={() => select(s.id, false)}
                  className={cn(
                    'eval-racer-card',
                    s.rank === 0 && 'is-leading',
                    active !== null && active !== s.id && 'is-dimmed',
                  )}
                >
                  <header>
                    <span className="racer-position">{s.rank + 1}</span>
                    <strong>{s.label}</strong>
                    <span>
                      {s.done ? '已完成' : s.rank === 0 ? '领先' : s.gap}
                    </span>
                  </header>
                  <div
                    className="racer-progress"
                    role="progressbar"
                    aria-label={`${s.label}评测进度`}
                    aria-valuemin={0}
                    aria-valuemax={total}
                    aria-valuenow={s.scored}
                  >
                    <span
                      style={{
                        width: `${Math.min(s.scored / total, 1) * 100}%`,
                      }}
                    />
                  </div>
                  <dl>
                    <div>
                      <dt>已评分</dt>
                      <dd>
                        {s.scored}
                        <small> / {total}</small>
                      </dd>
                    </div>
                    <div>
                      <dt>当前圈数</dt>
                      <dd>
                        {s.lap}
                        <small> / {laps}</small>
                      </dd>
                    </div>
                    <div>
                      <dt>最佳圈速</dt>
                      <dd>{s.best === null ? '—' : formatTime(s.best)}</dd>
                    </div>
                  </dl>
                </motion.article>
              ))}
            </div>
          </div>

          <table className="sr-only">
            <caption>{`${title}: ${leaderLine}`}</caption>
            <thead>
              <tr>
                <th scope="col">排名</th>
                <th scope="col">模型</th>
                <th scope="col">已评分用例</th>
                <th scope="col">圈数</th>
                <th scope="col">差距</th>
                <th scope="col">上一圈</th>
                <th scope="col">最佳圈速</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((s) => (
                <tr key={s.id}>
                  <td>{s.rank + 1}</td>
                  <th scope="条记录">{s.name ?? s.label}</th>
                  <td>{`${s.scored}共${total}`}</td>
                  <td>{s.done ? '已完成' : `${s.lap}共${laps}`}</td>
                  <td>{s.gap}</td>
                  <td>{s.last === null ? '无' : formatTime(s.last)}</td>
                  <td>{s.best === null ? '无' : formatTime(s.best)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p role="status" aria-live="polite" className="sr-only">
            {fromKeyboard && focused
              ? `排名${focused.rank + 1}, ${focused.name ?? focused.label}, ${focused.scored}共${total}条用例，${focused.gap}`
              : leader
                ? `${leader.name ?? leader.label} ${final ? '获胜' : '领先'}`
                : ''}
          </p>
        </Panel>
      </Shell>
    </MotionConfig>
  )
}

function TrackView({
  standings,
  perLap,
  active,
  mini = false,
  label,
  onSelect,
  className,
}: {
  standings: Standing[]
  perLap: number
  active: string | null
  mini?: boolean
  label?: React.ReactNode
  onSelect?: (id: string | null) => void
  className?: string
}) {
  const id = useId()
  const [ref, width, measured] = useWidth()
  const marker = mini ? 4.5 : width < 360 ? 9 : 10
  const lane = mini ? 9 : width < 360 ? 20 : 24
  const pad = Math.max(marker, lane / 2) + 2
  const height = Math.round(
    mini ? width * 0.5 : Math.min(Math.max(width * 0.3, 120), 156),
  )
  const track = stadium(width, height, pad)
  const inner = track.r - lane / 2 - 4

  // Finished racers queue up past the line in finishing order.
  const spacing = ((marker * 2 + 3) / track.perimeter) * perLap
  const finished = standings.filter((s) => s.done).length

  const ticks = mini
    ? []
    : Array.from({ length: 19 }, (_, k) => {
        const f = (k + 1) / 20
        const long = (k + 1) % 5 === 0
        const [x1, y1] = track.at(f, inner + 2)
        const [x2, y2] = track.at(f, inner + 2 - (long ? 6 : 3))
        return { k, long, x1, y1, x2, y2 }
      })

  const [lx, ly] = track.at(0)
  const sq = lane / 4

  return (
    <div ref={ref} className={cn('relative', className)}>
      <svg
        key={measured ? 'measured' : 'guess'}
        visibility={measured ? undefined : 'hidden'}
        aria-hidden="true"
        width={width}
        height={height}
        className="block overflow-visible"
      >
        {!mini && (
          <defs>
            <pattern
              id={`${id}-grain`}
              width={8}
              height={8}
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx={4}
                cy={4}
                r={0.75}
                className="fill-foreground/[0.12]"
              />
            </pattern>
          </defs>
        )}
        {!mini && inner > 0 && (
          <path d={track.path(inner)} fill={`url(#${id}-grain)`} />
        )}
        <path
          d={track.path()}
          fill="none"
          strokeWidth={lane}
          className="stroke-foreground/[0.06]"
        />
        {!mini && (
          <path
            d={track.path()}
            fill="none"
            strokeDasharray="2 6"
            className="stroke-foreground/15"
          />
        )}
        {ticks.map((t) => (
          <line
            key={t.k}
            x1={round(t.x1)}
            y1={round(t.y1)}
            x2={round(t.x2)}
            y2={round(t.y2)}
            className={
              t.long ? 'stroke-foreground/25' : 'stroke-foreground/[0.12]'
            }
          />
        ))}

        {/* Start / finish: a two-column checker across the lane. */}
        <g>
          {Array.from({ length: 8 }, (_, k) => {
            const col = k % 2
            const row = Math.floor(k / 2)
            if ((row + col) % 2) return null
            return (
              <rect
                key={k}
                x={round(lx - sq + col * sq)}
                y={round(ly - lane / 2 + row * sq)}
                width={round(sq)}
                height={round(sq)}
                className="fill-foreground/70"
              />
            )
          })}
        </g>

        {/* Two passes, so streaks never paint over another marker. */}
        {(['trail', 'disc'] as const).flatMap((part) =>
          [...standings]
            .reverse()
            .map((s) => (
              <Marker
                key={`${part}-${s.id}`}
                part={part}
                track={track}
                laps={
                  s.scored / perLap +
                  (s.done ? ((finished - s.rank) * spacing) / perLap : 0)
                }
                rank={s.rank}
                lead={s.rank === 0}
                lapped={s.behind >= perLap}
                dim={active !== null && active !== s.id}
                mini={mini}
                r={marker}
                lane={lane}
                onPointerEnter={onSelect && (() => onSelect(s.id))}
                onPointerLeave={onSelect && (() => onSelect(null))}
              />
            )),
        )}
      </svg>
      {label && measured && (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 flex flex-col items-center justify-center text-center"
          style={{ height }}
        >
          {label}
        </div>
      )}
    </div>
  )
}

function Marker({
  part,
  track,
  laps,
  rank,
  lead,
  lapped,
  dim,
  mini,
  r,
  lane,
  onPointerEnter,
  onPointerLeave,
}: {
  part: 'trail' | 'disc'
  track: Track
  laps: number
  rank: number
  lead: boolean
  lapped: boolean
  dim: boolean
  mini: boolean
  r: number
  lane: number
  onPointerEnter?: () => void
  onPointerLeave?: () => void
}) {
  const reduce = useReducedMotion()
  // Scores land in steps; a critically damped spring turns them into a glide.
  const pos = useSpring(laps, { stiffness: 70, damping: 18, restDelta: 0.0002 })
  useEffect(() => {
    if (reduce) pos.jump(laps)
    else pos.set(laps)
  }, [laps, pos, reduce])

  const velocity = useVelocity(pos)
  // Each new score kicks the spring, so raw velocity pulses every update; a
  // slow, overdamped spring turns it into a steady speed for the streak.
  const speed = useSpring(velocity, {
    stiffness: 24,
    damping: 14,
    restDelta: 0.0001,
  })
  const x = useTransform(pos, (v) => round(track.at(v)[0]))
  const y = useTransform(pos, (v) => round(track.at(v)[1]))
  // A streak behind each marker, as long as it is fast.
  const tail = useTransform(speed, (v) => Math.min(Math.max(v * 0.22, 0), 0.08))
  const dash = useTransform(
    tail,
    (t) => `${t.toFixed(4)} ${(1 - t).toFixed(4)}`,
  )
  const offset = useTransform(() => -(pos.get() - tail.get()))
  // Fades with its length instead of popping off at rest.
  const streak = useTransform(tail, (t) => Math.min(t / 0.02, 1))

  if (part === 'trail') {
    if (mini || reduce) return null
    return (
      <motion.path
        d={track.path()}
        pathLength={1}
        fill="none"
        strokeWidth={lane * 0.3}
        strokeLinecap="round"
        className={cn(
          'transition-[stroke] duration-200',
          dim
            ? 'stroke-foreground/[0.06]'
            : lead
              ? 'stroke-brand/50'
              : 'stroke-foreground/15',
        )}
        style={{
          strokeDasharray: dash,
          strokeDashoffset: offset,
          opacity: streak,
        }}
      />
    )
  }

  return (
    <g onPointerEnter={onPointerEnter} onPointerLeave={onPointerLeave}>
      <motion.g style={{ x, y }}>
        <circle
          r={r}
          className={cn(
            'transition-[fill] duration-200',
            // Dimmed markers stay opaque so the track never shows through.
            dim
              ? 'fill-surface-raised'
              : lead
                ? 'fill-brand'
                : lapped
                  ? 'fill-muted-foreground'
                  : 'fill-foreground',
          )}
        />
        {!mini && (
          <text
            textAnchor="middle"
            dy="0.35em"
            fontSize={r > 9 ? 11 : 10}
            className={cn(
              'font-mono font-medium',
              dim
                ? 'fill-muted-foreground'
                : lead
                  ? 'fill-white'
                  : 'fill-surface-inset',
            )}
          >
            {rank + 1}
          </text>
        )}
      </motion.g>
    </g>
  )
}
