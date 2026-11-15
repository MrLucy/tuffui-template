// Avara UI · MIT License · Source: https://avaraui.com/r/infrastructure-topology.json
'use client'

import {
  Activity,
  Cloud,
  CreditCard,
  Database,
  Shield,
  ShieldAlert,
  UserCheck,
  Wifi,
  Zap,
} from 'lucide-react'
import React, { useState } from 'react'

import { cn } from '@/lib/utils'

export interface TopologyNode {
  id: string
  title: string
  subtitle: string
  badgeText: string
  badgeVariant?: 'emerald' | 'amber' | 'blue' | 'rose' | 'purple'
  icon: React.ReactNode
  color: string
  strokeColor: string
  position:
    'top-left' | 'bottom-left' | 'top-right' | 'middle-right' | 'bottom-right'
}

export interface MetricItem {
  id: string
  label: string
  value: string
  icon: React.ReactNode
  color?: string
}

export interface InfrastructureTopologyProps {
  /** Header main title */
  headerTitle?: string
  /** Monospaced header subtitle */
  headerSubtitle?: string
  /** System status text */
  statusBadge?: string
  /** Bandwidth status text */
  bandwidthBadge?: string
  /** Center node title */
  centerTitle?: string
  /** Center node subtitle */
  centerSubtitle?: string
  /** Center node theme color: "cyan" | "emerald" | "indigo" | "rose" | "purple" */
  centerColor?: 'cyan' | 'emerald' | 'indigo' | 'rose' | 'purple'
  /** Custom list of service nodes */
  nodes?: TopologyNode[]
  /** Custom list of bottom metric pills */
  metrics?: MetricItem[]
  /** Enable animated beam data flows */
  animated?: boolean
  /** Enable interactive route highlighting on hover */
  interactive?: boolean
  /** Container class name */
  className?: string
}

const DEFAULT_NODES: TopologyNode[] = [
  {
    id: 'auth',
    title: 'User Auth',
    subtitle: 'OAUTH 2.0',
    badgeText: 'SECURED',
    badgeVariant: 'blue',
    icon: <UserCheck className="h-4 w-4 text-blue-500 md:h-4.5 md:w-4.5" />,
    color: 'blue',
    strokeColor: '#3b82f6',
    position: 'top-left',
  },
  {
    id: 'waf',
    title: 'WAF Guard',
    subtitle: 'LAYER 7',
    badgeText: 'ONLINE',
    badgeVariant: 'rose',
    icon: <ShieldAlert className="h-4 w-4 text-rose-500 md:h-4.5 md:w-4.5" />,
    color: 'rose',
    strokeColor: '#f43f5e',
    position: 'bottom-left',
  },
  {
    id: 'db',
    title: 'Postgres',
    subtitle: 'PRIMARY DB',
    badgeText: 'ONLINE',
    badgeVariant: 'purple',
    icon: <Database className="h-4 w-4 text-purple-500 md:h-4.5 md:w-4.5" />,
    color: 'purple',
    strokeColor: '#a855f7',
    position: 'top-right',
  },
  {
    id: 'aws',
    title: 'AWS Cloud',
    subtitle: 'US-EAST-1',
    badgeText: 'ACTIVE',
    badgeVariant: 'amber',
    icon: <Cloud className="h-4 w-4 text-amber-500 md:h-4.5 md:w-4.5" />,
    color: 'amber',
    strokeColor: '#f59e0b',
    position: 'middle-right',
  },
  {
    id: 'billing',
    title: 'Billing API',
    subtitle: 'STRIPE V3',
    badgeText: 'ONLINE',
    badgeVariant: 'emerald',
    icon: <CreditCard className="h-4 w-4 text-emerald-500 md:h-4.5 md:w-4.5" />,
    color: 'emerald',
    strokeColor: '#10b981',
    position: 'bottom-right',
  },
]

const DEFAULT_METRICS: MetricItem[] = [
  {
    id: 'throughput',
    label: 'THROUGHPUT',
    value: '4.8 GB/s',
    icon: <Activity className="h-3.5 w-3.5 text-blue-500" />,
    color: 'text-blue-600 dark:text-blue-400',
  },
  {
    id: 'latency',
    label: 'LATENCY P99',
    value: '< 8 ms',
    icon: <Zap className="h-3.5 w-3.5 text-emerald-500" />,
    color: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    id: 'threats',
    label: 'THREATS',
    value: '0 Active',
    icon: <Shield className="h-3.5 w-3.5 text-muted-foreground" />,
    color: 'text-foreground',
  },
  {
    id: 'queries',
    label: 'QUERIES/S',
    value: '12 400',
    icon: <Database className="h-3.5 w-3.5 text-purple-500" />,
    color: 'text-purple-600 dark:text-purple-400',
  },
  {
    id: 'uptime',
    label: 'UPTIME',
    value: '99.99%',
    icon: <Wifi className="h-3.5 w-3.5 text-amber-500" />,
    color: 'text-amber-600 dark:text-amber-400',
  },
]

export function InfrastructureTopology({
  headerTitle = 'Infrastructure Topology',
  headerSubtitle = 'LIVE DATA FLOW · 6 SERVICES · 5 ROUTES',
  statusBadge = 'ALL SYSTEMS',
  bandwidthBadge = '10 GBPS',
  centerTitle = 'NEURAL MESH',
  centerSubtitle = 'CORE ROUTER · V4.2',
  centerColor = 'cyan',
  nodes = DEFAULT_NODES,
  metrics = DEFAULT_METRICS,
  animated = true,
  interactive = true,
  className,
}: InfrastructureTopologyProps) {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)

  const getCenterColorStyles = (color: string) => {
    switch (color) {
      case 'emerald':
        return {
          border: 'border-emerald-500/60 dark:border-emerald-400/80',
          ringOuter: 'border-emerald-500/20',
          ringInner: 'border-emerald-500/10',
          iconBg:
            'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
          text: 'text-emerald-700 dark:text-emerald-400',
        }
      case 'indigo':
        return {
          border: 'border-indigo-500/60 dark:border-indigo-400/80',
          ringOuter: 'border-indigo-500/20',
          ringInner: 'border-indigo-500/10',
          iconBg:
            'bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400',
          text: 'text-indigo-700 dark:text-indigo-400',
        }
      case 'rose':
        return {
          border: 'border-rose-500/60 dark:border-rose-400/80',
          ringOuter: 'border-rose-500/20',
          ringInner: 'border-rose-500/10',
          iconBg:
            'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400',
          text: 'text-rose-700 dark:text-rose-400',
        }
      case 'purple':
        return {
          border: 'border-purple-500/60 dark:border-purple-400/80',
          ringOuter: 'border-purple-500/20',
          ringInner: 'border-purple-500/10',
          iconBg:
            'bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400',
          text: 'text-purple-700 dark:text-purple-400',
        }
      case 'cyan':
      default:
        return {
          border: 'border-cyan-500/60 dark:border-cyan-400/80',
          ringOuter: 'border-cyan-500/20',
          ringInner: 'border-cyan-500/10',
          iconBg:
            'bg-cyan-500/10 border-cyan-500/30 text-cyan-600 dark:text-cyan-400',
          text: 'text-cyan-700 dark:text-cyan-400',
        }
    }
  }

  const centerTheme = getCenterColorStyles(centerColor)

  const getBadgeStyle = (variant?: string) => {
    switch (variant) {
      case 'blue':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30'
      case 'rose':
        return 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30'
      case 'purple':
        return 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30'
      case 'amber':
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30'
      case 'emerald':
      default:
        return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
    }
  }

  const getNodeBorderStyle = (color: string, isHovered: boolean) => {
    if (isHovered) {
      switch (color) {
        case 'blue':
          return 'border-blue-500 ring-2 ring-blue-500/20'
        case 'rose':
          return 'border-rose-500 ring-2 ring-rose-500/20'
        case 'purple':
          return 'border-purple-500 ring-2 ring-purple-500/20'
        case 'amber':
          return 'border-amber-500 ring-2 ring-amber-500/20'
        case 'emerald':
        default:
          return 'border-emerald-500 ring-2 ring-emerald-500/20'
      }
    }

    switch (color) {
      case 'blue':
        return 'border-blue-500/30 hover:border-blue-500/60'
      case 'rose':
        return 'border-rose-500/30 hover:border-rose-500/60'
      case 'purple':
        return 'border-purple-500/30 hover:border-purple-500/60'
      case 'amber':
        return 'border-amber-500/30 hover:border-amber-500/60'
      case 'emerald':
      default:
        return 'border-emerald-500/30 hover:border-emerald-500/60'
    }
  }

  return (
    <div
      className={cn(
        'relative mx-auto w-full max-w-5xl overflow-hidden rounded-xl border border-border/80 bg-background/95 p-4 shadow-none backdrop-blur-2xl select-none sm:p-3 md:p-3',
        'bg-[radial-gradient(var(--border)_1.2px,transparent_1.2px)] [background-size:20px_20px]',
        className,
      )}
    >
      {/* `dash` drives the animate-[dash_…] beams below. Plain <style> rather
                than styled-jsx so the component compiles outside Next.js, and kept
                inline so the keyframes survive a copy into another project. */}
      <style
        dangerouslySetInnerHTML={{
          __html: `@keyframes dash { to { stroke-dashoffset: -1000; } }`,
        }}
      />

      {/* Header Section */}
      <div className="flex flex-col items-start justify-between gap-3 border-b border-border/40 pb-4 sm:flex-row sm:items-center sm:gap-4 sm:pb-6">
        <div className="space-y-1">
          <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-base md:text-lg">
            {headerTitle}
          </h2>
          <p className="font-mono text-[10px] font-semibold tracking-widest text-muted-foreground sm:text-[11px]">
            {headerSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex cursor-pointer items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 font-mono text-[11px] font-semibold text-emerald-600 transition-colors hover:bg-emerald-500/20 sm:text-xs dark:text-emerald-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <span>{statusBadge}</span>
          </div>

          <div className="flex cursor-pointer items-center gap-1.5 rounded-full border border-border/60 bg-muted/80 px-3 py-1 font-mono text-[11px] font-semibold text-muted-foreground transition-colors hover:bg-muted sm:text-xs">
            <Wifi className="h-3.5 w-3.5" />
            <span>{bandwidthBadge}</span>
          </div>
        </div>
      </div>

      {/* DESKTOP & TABLET VIEW (md and up): 2D Graph Canvas with SVG Lines */}
      <div className="relative my-4 hidden min-h-[480px] w-full items-center justify-center md:flex lg:min-h-[500px]">
        {/* SVG Data Flow Connection Beams Overlay */}
        <svg className="pointer-events-none absolute inset-0 z-0 h-full w-full">
          <defs>
            <linearGradient
              id="gradient-blue"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient
              id="gradient-rose"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#fb7185" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient
              id="gradient-purple"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#c084fc" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient
              id="gradient-amber"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient
              id="gradient-emerald"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          <line
            x1="22%"
            y1="22%"
            x2="50%"
            y2="50%"
            stroke="url(#gradient-blue)"
            strokeWidth={hoveredNodeId === 'auth' ? 4 : 3}
            strokeDasharray="8 6"
            className={cn(
              'transition-all duration-300',
              animated && 'animate-[dash_20s_linear_infinite]',
            )}
          />

          <line
            x1="22%"
            y1="78%"
            x2="50%"
            y2="50%"
            stroke="url(#gradient-rose)"
            strokeWidth={hoveredNodeId === 'waf' ? 4 : 3}
            strokeDasharray="8 6"
            className={cn(
              'transition-all duration-300',
              animated && 'animate-[dash_22s_linear_infinite]',
            )}
          />

          <line
            x1="78%"
            y1="20%"
            x2="50%"
            y2="50%"
            stroke="url(#gradient-purple)"
            strokeWidth={hoveredNodeId === 'db' ? 4 : 3}
            strokeDasharray="8 6"
            className={cn(
              'transition-all duration-300',
              animated && 'animate-[dash_18s_linear_infinite]',
            )}
          />

          <line
            x1="78%"
            y1="50%"
            x2="50%"
            y2="50%"
            stroke="url(#gradient-amber)"
            strokeWidth={hoveredNodeId === 'aws' ? 4 : 3}
            strokeDasharray="8 6"
            className={cn(
              'transition-all duration-300',
              animated && 'animate-[dash_15s_linear_infinite]',
            )}
          />

          <line
            x1="78%"
            y1="80%"
            x2="50%"
            y2="50%"
            stroke="url(#gradient-emerald)"
            strokeWidth={hoveredNodeId === 'billing' ? 4 : 3}
            strokeDasharray="8 6"
            className={cn(
              'transition-all duration-300',
              animated && 'animate-[dash_25s_linear_infinite]',
            )}
          />
        </svg>

        {/* Central Neural Mesh Hub Node - Mode Adaptive Colors, NO ZOOM */}
        <div className="relative z-20 flex cursor-pointer flex-col items-center justify-center">
          <div className="relative flex items-center justify-center">
            <div
              className={cn(
                'pointer-events-none absolute h-32 w-32 animate-ping rounded-full border opacity-40 lg:h-36 lg:w-36',
                centerTheme.ringOuter,
              )}
            />
            <div
              className={cn(
                'pointer-events-none absolute h-40 w-40 animate-pulse rounded-full border lg:h-44 lg:w-44',
                centerTheme.ringInner,
              )}
            />

            <div
              className={cn(
                'relative flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-full border-2 bg-card p-2.5 text-card-foreground shadow-none backdrop-blur-xl transition-colors lg:h-28 lg:w-28 lg:p-3',
                centerTheme.border,
              )}
            >
              <div
                className={cn(
                  'mb-1 rounded-xl border p-1.5 transition-colors lg:p-2',
                  centerTheme.iconBg,
                )}
              >
                <Zap className="h-5 w-5 animate-pulse lg:h-6 lg:w-6" />
              </div>
            </div>
          </div>

          <div className="mt-2.5 space-y-0.5 text-center">
            <h4
              className={cn(
                'text-[11px] font-bold tracking-wider uppercase lg:text-xs',
                centerTheme.text,
              )}
            >
              {centerTitle}
            </h4>
            <p className="font-mono text-[9px] font-semibold text-muted-foreground lg:text-[10px]">
              {centerSubtitle}
            </p>
          </div>
        </div>

        {/* Peripheral Service Card Nodes - Slightly Smaller on md: Screen */}
        <div className="pointer-events-none absolute inset-0 h-full w-full">
          {nodes.map((node) => {
            const isHovered = hoveredNodeId === node.id

            let posClasses = ''
            switch (node.position) {
              case 'top-left':
                posClasses = 'top-4 left-4 lg:left-12'
                break
              case 'bottom-left':
                posClasses = 'bottom-4 left-4 lg:left-12'
                break
              case 'top-right':
                posClasses = 'top-2 right-4 lg:right-12'
                break
              case 'middle-right':
                posClasses = 'top-1/2 -translate-y-1/2 right-4 lg:right-12'
                break
              case 'bottom-right':
                posClasses = 'bottom-2 right-4 lg:right-12'
                break
            }

            return (
              <div
                key={node.id}
                onMouseEnter={() => interactive && setHoveredNodeId(node.id)}
                onMouseLeave={() => interactive && setHoveredNodeId(null)}
                className={cn(
                  'pointer-events-auto absolute flex w-40 cursor-pointer flex-col items-center gap-1.5 rounded-2xl border bg-card/95 p-3 text-center shadow-none backdrop-blur-xl transition-all duration-300 hover:scale-[1.03] md:w-44 md:gap-2 md:p-3.5 lg:w-48 lg:p-4',
                  getNodeBorderStyle(node.color, isHovered),
                  posClasses,
                )}
              >
                <div className="rounded-xl border border-border/50 bg-muted/60 p-2 md:p-2.5">
                  {node.icon}
                </div>

                <div className="w-full min-w-0 space-y-0.5">
                  <h3 className="truncate text-xs leading-tight font-semibold text-foreground md:text-sm">
                    {node.title}
                  </h3>
                  <p className="truncate font-mono text-[9px] font-medium text-muted-foreground md:text-[10px]">
                    {node.subtitle}
                  </p>
                </div>

                <span
                  className={cn(
                    'flex cursor-pointer items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[8px] font-semibold tracking-wider uppercase md:px-2.5 md:text-[9px]',
                    getBadgeStyle(node.badgeVariant),
                  )}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  <span>{node.badgeText}</span>
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* MOBILE & SMALL SCREEN VIEW (< md): Clean Grid Layout */}
      <div className="space-y-6 py-6 md:hidden">
        {/* Central Hub Node Mobile */}
        <div className="flex cursor-pointer flex-col items-center justify-center py-2 text-center">
          <div className="relative flex items-center justify-center">
            <div
              className={cn(
                'pointer-events-none absolute h-28 w-28 animate-ping rounded-full border opacity-40',
                centerTheme.ringOuter,
              )}
            />
            <div
              className={cn(
                'flex h-20 w-20 flex-col items-center justify-center rounded-full border-2 bg-card p-2 text-card-foreground backdrop-blur-xl',
                centerTheme.border,
              )}
            >
              <Zap className={cn('h-5 w-5 animate-pulse', centerTheme.text)} />
            </div>
          </div>
          <h4
            className={cn(
              'mt-2 text-xs font-bold tracking-wider uppercase',
              centerTheme.text,
            )}
          >
            {centerTitle}
          </h4>
          <p className="font-mono text-[9px] font-semibold text-muted-foreground">
            {centerSubtitle}
          </p>
        </div>

        {/* 2-Column Responsive Service Grid */}
        <div className="xs:grid-cols-2 grid grid-cols-1 gap-3">
          {nodes.map((node) => (
            <div
              key={node.id}
              className={cn(
                'flex cursor-pointer items-center gap-3 rounded-2xl border bg-card/95 p-3.5 transition-all hover:scale-[1.02]',
                getNodeBorderStyle(node.color, false),
              )}
            >
              <div className="shrink-0 rounded-xl border border-border/50 bg-muted/60 p-2">
                {node.icon}
              </div>

              <div className="min-w-0 flex-1 space-y-0.5">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="truncate text-xs font-semibold text-foreground">
                    {node.title}
                  </h3>
                  <span
                    className={cn(
                      'py-0.2 shrink-0 rounded border px-1.5 font-mono text-[8px] font-semibold uppercase',
                      getBadgeStyle(node.badgeVariant),
                    )}
                  >
                    {node.badgeText}
                  </span>
                </div>
                <p className="truncate font-mono text-[9px] font-medium text-muted-foreground">
                  {node.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Telemetry Metrics Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-t border-border/40 pt-4 sm:justify-between sm:gap-3 sm:pt-6">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className="flex cursor-pointer items-center gap-2 rounded-2xl border border-border/60 bg-muted/40 px-3 py-1.5 text-xs shadow-none backdrop-blur-md transition-all hover:scale-[1.02] hover:border-border sm:px-4 sm:py-2"
          >
            <div className="rounded-md border border-border/40 bg-background/80 p-1">
              {metric.icon}
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[8px] font-semibold tracking-wider text-muted-foreground sm:text-[9px]">
                {metric.label}
              </span>
              <span
                className={cn(
                  'font-mono text-[11px] font-semibold sm:text-xs',
                  metric.color,
                )}
              >
                {metric.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default InfrastructureTopology
