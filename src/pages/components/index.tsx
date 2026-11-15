import { ChevronDown, FlaskConical, Search, X } from 'lucide-react'
import { useState } from 'react'
import { useSearchParams } from 'react-router'

import { BentoGrid } from '@/components/studio/bento-grid'
import { DemoCard } from '@/components/studio/demo-card'
import { PageHeading } from '@/components/studio/page-heading'
import { Button } from '@/components/ui/action-button'
import { Segmented } from '@/components/ui/segmented-control'
import { avaraGroups, avaraNames } from '@/config/avara-catalog'
import { categories } from '@/config/component-categories'
import {
  allComponentNames,
  componentLibrary,
  matchesComponent,
} from '@/config/component-registry'

export function ComponentLabPage() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const [category, setCategory] = useState('全部组件')
  const [library, setLibrary] = useState('全部')
  const groups =
    library === 'AvaraUI'
      ? avaraGroups
      : library === 'TuffUI'
        ? categories
        : { ...categories, ...avaraGroups }
  const [expanded, setExpanded] = useState(false)
  const filtered = allComponentNames.filter(
    (n) =>
      (library === '全部' || componentLibrary(n) === library) &&
      (category === '全部组件' || groups[category]?.includes(n)) &&
      matchesComponent(n, query),
  )
  const visible =
    expanded || query || category !== '全部组件'
      ? filtered
      : filtered.slice(0, 12)
  return (
    <div className="page-content">
      <PageHeading
        title="组件实验室"
        description="TuffUI 与 AvaraUI，在同一个工作空间自由组合。"
        eyebrow="从组件开始构建"
      >
        <span className="component-count">
          <span />
          {allComponentNames.length} 个组件，全部就绪
        </span>
      </PageHeading>
      <div className="lab-intro">
        <div className="lab-intro-icon">
          <BlocksIcon />
        </div>
        <div>
          <h2>小组件，搭起大想法。</h2>
          <p>两套官方组件 · 中文模拟数据 · 可交互预览</p>
        </div>
        <span className="lab-intro-pattern" aria-hidden="true">
          ⌘
        </span>
      </div>
      <div className="library-toolbar">
        <Segmented
          label="组件来源"
          value={library}
          onValueChange={(value) => {
            setLibrary(value)
            setCategory('全部组件')
            setExpanded(false)
          }}
          options={[
            { value: '全部', label: `全部组件 · ${allComponentNames.length}` },
            { value: 'TuffUI', label: 'TuffUI · 86' },
            { value: 'AvaraUI', label: `AvaraUI · ${avaraNames.length}` },
          ]}
        />
        <span className="tiny-note">两套组件 · 统一交互体验</span>
      </div>
      <div className="lab-controls">
        <div className="lab-search">
          <Search size={16} />
          <input
            aria-label="搜索组件"
            placeholder="搜索组件名称，例如评测、对话…"
            value={query}
            onChange={(e) => {
              setParams(e.target.value ? { q: e.target.value } : {})
              setExpanded(false)
            }}
          />
          {query && (
            <button aria-label="清空组件搜索" onClick={() => setParams({})}>
              <X size={14} />
            </button>
          )}
        </div>
        <span className="tiny-note">
          显示 {filtered.length} / {allComponentNames.length} 个组件
        </span>
      </div>
      <div className="category-tabs">
        {['全部组件', ...Object.keys(groups)].map((c) => (
          <button
            className={category === c ? 'active' : ''}
            key={c}
            onClick={() => {
              setCategory(c)
              setExpanded(false)
            }}
          >
            {c}
            <span>
              {c === '全部组件' ? allComponentNames.length : groups[c].length}
            </span>
          </button>
        ))}
      </div>
      {filtered.length ? (
        <BentoGrid className="feature-grid">
          {visible.map((name) => (
            <DemoCard
              key={name}
              name={name}
              wide={[
                'ai-chat',
                'agent-console',
                'coding-agent',
                'data-answer',
                'handoff-inbox',
                'booking-assistant',
              ].includes(name)}
            />
          ))}
        </BentoGrid>
      ) : (
        <div className="no-results">
          <Search size={28} />
          <h2>没有找到匹配组件</h2>
          <p>试试更短的关键词，或切换到全部组件。</p>
          <Button
            onClick={() => {
              setParams({})
              setCategory('全部组件')
            }}
          >
            清空筛选
          </Button>
        </div>
      )}
      {visible.length < filtered.length && (
        <div className="load-more">
          <Button onClick={() => setExpanded(true)}>
            展开全部 {filtered.length} 个组件
            <ChevronDown size={14} />
          </Button>
          <p>完整展示可能需要稍多的页面空间。</p>
        </div>
      )}
    </div>
  )
}
function BlocksIcon() {
  return <FlaskConical size={28} strokeWidth={1.4} />
}
