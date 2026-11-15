import { AvaraPreview } from '@/components/studio/avara-preview'
import { Demo } from '@/components/studio/demos'
import {
  allComponentLabels as componentLabels,
  componentLibrary,
} from '@/config/component-registry'

const compactComponents = new Set([
  'action-button',
  'action-menu',
  'agent-avatar',
  'agent-status',
  'choice-controls',
  'disclosure',
  'empty-state',
  'key-hint',
  'loader',
  'loading-skeleton',
  'modal-sheet',
  'popover-panel',
  'progress-bar',
  'range-slider',
  'rolling-number',
  'segmented-control',
  'select-field',
  'status-pill',
  'tab-panels',
  'text-field',
  'toast-stack',
  'tooltip-hint',
  'response-feedback',
  'user-message',
])
const chartComponents = new Set([
  'eval-race',
  'eval-results',
  'chart-card',
  'data-table',
  'delivery-heatmap',
  'deploy-timeline',
  'tool-call-graph',
  'message-log',
  'usage-summary',
  'radar-chart',
  'run-trace',
  'inbox-cleanup',
  'tone-rewrite',
  'renewal-rings',
])
export function DemoCard({
  name,
  title,
  description,
  wide = false,
}: {
  name: string
  title?: string
  description?: string
  wide?: boolean
}) {
  return (
    <article
      className="component-card"
      data-size={
        name === 'stat-grid'
          ? 'full'
          : wide
            ? 'wide'
            : compactComponents.has(name)
              ? 'small'
              : chartComponents.has(name)
                ? 'chart'
                : 'regular'
      }
      id={name}
    >
      <div className="component-caption">
        <div>
          <h2>{title ?? componentLabels[name]}</h2>
          {description && <p>{description}</p>}
        </div>
        <span
          className={`component-type library-${componentLibrary(name).toLowerCase()}`}
        >
          {componentLibrary(name)}
        </span>
      </div>
      <div
        className={`component-preview ${['ai-chat', 'agent-console', 'coding-agent', 'data-answer', 'booking-assistant', 'handoff-inbox'].includes(name) ? 'full-scene' : ''}`}
      >
        {name.startsWith('avara/') ? (
          <AvaraPreview name={name} />
        ) : (
          <Demo name={name} />
        )}
      </div>
    </article>
  )
}
