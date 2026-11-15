import { useState } from 'react'

import { BentoGrid } from '@/components/studio/bento-grid'
import { DemoCard } from '@/components/studio/demo-card'
import { ExportButton } from '@/components/studio/export-button'
import { PageHeading } from '@/components/studio/page-heading'
import { Segmented } from '@/components/ui/segmented-control'

export function SettingsPage() {
  const [view, setView] = useState('all')
  const count = view === 'all' ? 12 : 4
  return (
    <div className="page-content">
      <PageHeading
        eyebrow="工作空间 · 功能演示"
        title="工作空间设置"
        description="把工作空间调整成你喜欢的样子。"
      >
        <ExportButton />
        <span className="demo-label">交互模拟</span>
      </PageHeading>
      <div className="feature-toolbar">
        <Segmented
          label="工作空间设置视图"
          value={view}
          onValueChange={setView}
          options={[
            { value: 'all', label: '工作空间' },
            { value: 'connections', label: '连接与偏好' },
          ]}
        />
        <span className="tiny-note">{count} 个组合组件</span>
      </div>
      <BentoGrid className="feature-grid">
        {view === 'all' && (
          <>
            <DemoCard name="avara/color-picker" />
            <DemoCard name="avara/toggle" />
            <DemoCard name="avara/kbd" />
            <DemoCard name="text-field" />
            <DemoCard name="select-field" />
            <DemoCard name="choice-controls" />
            <DemoCard name="range-slider" />
            <DemoCard name="agent-avatar" />
          </>
        )}
        {(view === 'all' || view === 'connections') && (
          <>
            <DemoCard name="mcp-servers" />
            <DemoCard name="memory-panel" />
            <DemoCard name="context-window-meter" />
            <DemoCard name="rate-limits" />
          </>
        )}
      </BentoGrid>
    </div>
  )
}
