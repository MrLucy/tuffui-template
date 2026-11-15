import { useState } from 'react'

import { BentoGrid } from '@/components/studio/bento-grid'
import { DemoCard } from '@/components/studio/demo-card'
import { ExportButton } from '@/components/studio/export-button'
import { PageHeading } from '@/components/studio/page-heading'
import { Segmented } from '@/components/ui/segmented-control'

export function AnalyticsPage() {
  const [view, setView] = useState('all')
  const count = view === 'all' ? 15 : view === 'distribution' ? 7 : 3
  return (
    <div className="page-content">
      <PageHeading
        eyebrow="工作空间 · 功能演示"
        title="数据洞察"
        description="从每一次运行中发现信号，让决策有据可循。"
      >
        <ExportButton />
        <span className="demo-label">交互模拟</span>
      </PageHeading>
      <div className="feature-toolbar">
        <Segmented
          label="数据洞察视图"
          value={view}
          onValueChange={setView}
          options={[
            { value: 'all', label: '使用概览' },
            { value: 'distribution', label: '分布与趋势' },
            { value: 'assistant', label: '数据助手' },
          ]}
        />
        <span className="tiny-note">{count} 个组合组件</span>
      </div>
      <BentoGrid className="feature-grid">
        {view === 'all' && (
          <>
            <DemoCard name="avara/magic-bento" />
            <DemoCard name="stat-grid" wide />
            <DemoCard name="usage-summary" />
            <DemoCard name="chart-card" />
            <DemoCard name="tick-gauge" />
          </>
        )}
        {(view === 'all' || view === 'distribution') && (
          <>
            <DemoCard name="avara/network-graph" />
            <DemoCard name="delivery-heatmap" />
            <DemoCard name="diverging-bars" />
            <DemoCard name="iso-bars" />
            <DemoCard name="hex-density" />
            <DemoCard name="mirror-strips" />
            <DemoCard name="radial-dots" />
          </>
        )}
        {(view === 'all' || view === 'assistant') && (
          <>
            <DemoCard name="message-log" />
            <DemoCard name="data-table" />
            <DemoCard name="data-answer" wide />
          </>
        )}
      </BentoGrid>
    </div>
  )
}
