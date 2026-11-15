import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useOutletContext } from 'react-router'

import { BentoGrid } from '@/components/studio/bento-grid'
import { DemoCard } from '@/components/studio/demo-card'
import { ExportButton } from '@/components/studio/export-button'
import { PageHeading } from '@/components/studio/page-heading'
import { Segmented } from '@/components/ui/segmented-control'

export function ProjectsPage() {
  const [view, setView] = useState('all')
  const { onCreate } = useOutletContext<{ onCreate: () => void }>()
  const count = view === 'all' ? 12 : 8
  return (
    <div className="page-content">
      <PageHeading
        eyebrow="工作空间 · 功能演示"
        title="项目与订阅"
        description="项目、团队与订阅，在这里井然有序。"
      >
        <ExportButton />
        <button className="blue-button" onClick={onCreate}>
          <Plus size={14} /> 新建项目
        </button>
        <span className="demo-label">交互模拟</span>
      </PageHeading>
      <div className="feature-toolbar">
        <Segmented
          label="项目与订阅视图"
          value={view}
          onValueChange={setView}
          options={[
            { value: 'all', label: '项目管理' },
            { value: 'business', label: '业务场景' },
          ]}
        />
        <span className="tiny-note">{count} 个组合组件</span>
      </div>
      <BentoGrid className="feature-grid">
        {view === 'all' && (
          <>
            <DemoCard name="avara/draggable-card-list" />
            <DemoCard name="avara/card-stack" />
            <DemoCard name="avara/stepper" />
            <DemoCard name="form-card" />
          </>
        )}
        {(view === 'all' || view === 'business') && (
          <>
            <DemoCard name="avara/booking-card" />
            <DemoCard name="renewal-rings" />
            <DemoCard name="booking-assistant" wide />
            <DemoCard name="slot-picker" />
            <DemoCard name="handoff-inbox" wide />
            <DemoCard name="inbox-cleanup" />
            <DemoCard name="clause-playbook" />
            <DemoCard name="support-widget" />
          </>
        )}
      </BentoGrid>
    </div>
  )
}
