import { BentoGrid } from './bento-grid'
import {
  allComponentLabels as componentLabels,
  allComponentNames,
  matchesComponent,
  componentLibrary,
} from './component-registry'
import { avaraNames, avaraGroups } from './avara-catalog'
import { AvaraPreview } from './avara-preview'
import { useState } from 'react'
import type { ReactNode } from 'react'
import {
  Link,
  useLocation,
  useOutletContext,
  useSearchParams,
} from 'react-router'
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Circle,
  Command,
  Flag,
  FlaskConical,
  Plus,
  Search,
  Sparkles,
  Workflow,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/action-button'
import { Segmented } from '@/components/ui/segmented-control'
import { StatusPill } from '@/components/ui/status-pill'
import { StatGrid } from '@/components/ui/stat-grid'
import { ChartCard } from '@/components/ui/chart-card'
import { Avatar } from '@/components/ui/agent-avatar'
import { Demo, RaceDemo, notify } from './demos'
import { categories, navigation } from './navigation'
import * as D from './data'

export function PageHeading({
  title,
  description,
  children,
  eyebrow,
}: {
  title: string
  description: string
  children?: ReactNode
  eyebrow?: string
}) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="heading-actions">{children}</div>
    </div>
  )
}
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
function ExportButton() {
  return (
    <Button
      onClick={() => {
        const blob = new Blob(
          [
            JSON.stringify(
              {
                title: '工作台报告',
                date: '2026-11-14',
                stats: D.stats,
                agents: D.agents,
              },
              null,
              2,
            ),
          ],
          { type: 'application/json' },
        )
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = '工作台报告-2026-11-14.json'
        a.click()
        URL.revokeObjectURL(url)
        notify('报告已导出')
      }}
    >
      <ArrowDownToLine size={14} />
      导出报告
    </Button>
  )
}
export function OverviewPage() {
  const { onCreate } = useOutletContext<{ onCreate: () => void }>()
  const [range, setRange] = useState('week')
  const stats =
    range === 'week'
      ? D.stats
      : D.stats.map((stat, i) => ({
          ...stat,
          value: ['48,621', '97.8%', '1.38 秒', '¥256.84'][i],
        }))
  return (
    <div className="page-content">
      <PageHeading
        title="让好想法，开始工作。"
        description="欢迎回来，陈明。所有任务与进展，尽在这一屏。"
        eyebrow="工作空间概览"
      >
        <ExportButton />
        <button className="blue-button" onClick={onCreate}>
          <Plus size={15} />
          新建项目
        </button>
      </PageHeading>
      <div className="overview-toolbar">
        <div className="section-tabs">
          <span className="selected">工作空间概览</span>
          <Link to="/agents">
            智能体动态 <span>3</span>
          </Link>
        </div>
        <Segmented
          label="数据时间范围"
          value={range}
          onValueChange={setRange}
          options={[
            { value: 'week', label: '最近 7 天' },
            { value: 'month', label: '本月' },
          ]}
        />
      </div>
      <div className="overview-stats">
        <StatGrid className="!max-w-none" data={stats} />
      </div>
      <BentoGrid className="overview-bento">
        <section className="bento-tile tile-race" aria-label="模型评测概览">
          <div className="section-heading">
            <h2>
              <Flag size={15} />
              模型评测
            </h2>
            <Link to="/evaluations">
              全部评测
              <ArrowUpRight size={13} />
            </Link>
          </div>
          <RaceDemo />
        </section>
        <section className="bento-tile tile-chart">
          <div className="section-heading">
            <h2>运行趋势</h2>
            <StatusPill size="sm" tone="positive">
              运行正常
            </StatusPill>
          </div>
          <ChartCard
            title="成功运行"
            subtitle={range === 'week' ? '对比上一周 +12.8%' : '本月累计运行'}
            total={range === 'week' ? '24,892' : '48,621'}
            data={{
              labels: D.labels,
              series:
                range === 'week'
                  ? D.series
                  : D.series.map((series) => ({
                      ...series,
                      values: series.values.map((value) => value * 1.8),
                    })),
            }}
            type="area"
            className="!max-w-none"
          />
        </section>
        <section className="bento-tile tile-quick">
          <div className="section-heading">
            <h2>
              <Sparkles size={15} />
              快捷开始
            </h2>
            <span className="tiny-note">随时开始</span>
          </div>
          <div className="bento-shortcuts">
            {[
              {
                to: '/chat',
                icon: Command,
                title: '开启智能对话',
                detail: '让想法更进一步',
              },
              {
                to: '/writer',
                icon: Sparkles,
                title: '打磨一段文字',
                detail: '找到恰当的表达',
              },
              {
                to: '/evaluations',
                icon: FlaskConical,
                title: '比较模型表现',
                detail: '找到更适合的模型',
              },
              {
                to: '/projects',
                icon: Plus,
                title: '创建研究任务',
                detail: '把好问题变成行动',
              },
            ].map((item) => (
              <Link key={item.to} to={item.to}>
                <item.icon size={16} />
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.detail}</small>
                </span>
                <ArrowUpRight size={13} />
              </Link>
            ))}
          </div>
        </section>
        <section className="bento-tile tile-team">
          <div className="section-heading">
            <h2>智能体团队</h2>
            <Link to="/agents">
              查看全部
              <ArrowUpRight size={13} />
            </Link>
          </div>
          <div className="bento-agent-grid">
            {D.agents.map((agent) => (
              <Link
                key={agent.id}
                to="/agents"
                className={`bento-agent ${agent.status}`}
              >
                <div className="bento-agent-head">
                  <Avatar
                    name={agent.name}
                    size="sm"
                    status={
                      agent.status === 'running'
                        ? 'working'
                        : agent.status === 'waiting'
                          ? 'away'
                          : 'online'
                    }
                  />
                  <span className={`agent-state ${agent.status}`}>
                    <Circle size={5} fill="currentColor" />
                    {agent.status === 'running'
                      ? '运行中'
                      : agent.status === 'waiting'
                        ? '等待中'
                        : '空闲'}
                  </span>
                </div>
                <strong>{agent.name}</strong>
                <p>{agent.task}</p>
                <div className="mini-progress">
                  <span style={{ width: `${agent.progress * 100}%` }} />
                </div>
              </Link>
            ))}
          </div>
        </section>
        <section className="bento-tile tile-activity">
          <div className="section-heading">
            <h2>
              最近活动<span className="count-label">今天</span>
            </h2>
            <Link to="/agents">
              全部活动
              <ArrowUpRight size={13} />
            </Link>
          </div>
          <div className="bento-activity-grid">
            {[
              {
                icon: Check,
                cls: 'green',
                title: '组件构建检查完成',
                detail: '开发助手验证 248 个模块',
                time: '2 分钟前',
                to: '/agents',
              },
              {
                icon: FlaskConical,
                cls: 'blue',
                title: '客服对话质量评测',
                detail: '4 个模型 · 1,000 条用例',
                time: '5 分钟前',
                to: '/evaluations',
              },
              {
                icon: Workflow,
                cls: 'orange',
                title: '产品研究等待审批',
                detail: '写作助手请求发送摘要',
                time: '12 分钟前',
                to: '/approvals',
              },
            ].map((item) => (
              <Link to={item.to} key={item.title}>
                <div>
                  <span className={`activity-icon ${item.cls}`}>
                    <item.icon size={15} />
                  </span>
                  <time>{item.time}</time>
                </div>
                <strong>{item.title}</strong>
                <p>{item.detail}</p>
              </Link>
            ))}
          </div>
        </section>
        <section className="bento-tile tile-approvals">
          <div className="section-heading">
            <h2>
              <Workflow size={15} />
              待办提醒
            </h2>
            <StatusPill tone="warning" size="sm">
              3 项待处理
            </StatusPill>
          </div>
          <div className="approval-summary">
            <strong>下一步，由你决定。</strong>
            <p>研究报告、构建检查和团队摘要正在等待确认。</p>
            <Link to="/approvals">
              打开工具审批
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>
        <DemoCard name="avara/draggable-card-list" title="本周项目任务" />
        <DemoCard name="avara/card-stack" title="待阅读的研究" />
        <DemoCard name="avara/folder" title="共享资源" />
        <Link to="/components" className="bento-tile tile-explore">
          <span className="explore-icon">
            <FlaskConical size={22} />
          </span>
          <div>
            <strong>{allComponentNames.length} 个组件，无限种可能。</strong>
            <p>从基础交互到完整业务场景，自由探索、自由组合。</p>
          </div>
          <ArrowUpRight size={17} />
        </Link>
      </BentoGrid>
    </div>
  )
}
const pageSections: Record<
  string,
  { description: string; chips: string[]; components: string[] }
> = {
  '/agents': {
    description: '让专业的 智能体各司其职，随时掌握每一步进展。',
    chips: ['所有智能体', '运行与追踪', '开发工具'],
    components: [
      'avara/flowchart',
      'avara/infrastructure-topology',
      'avara/animated-list',

      'background-agents',
      'agent-console',
      'agent-question',
      'agent-status',
      'tool-call-graph',
      'run-trace',
      'coding-agent',
      'file-changes',
      'checkpoint-timeline',
      'terminal-output',
      'code-block',
      'json-viewer',
      'blast-radius',
    ],
  },
  '/chat': {
    description: '提一个好问题，和你的 AI 伙伴一起把想法向前推进。',
    chips: ['智能助手', '对话工具'],
    components: [
      'avara/avatar-stack',
      'avara/conversation-timeline',
      'avara/copy-button',

      'ai-chat',
      'conversation-list',
      'chat-thread',
      'streaming-message',
      'user-message',
      'message-branches',
      'agent-composer',
      'prompt-suggestions',
      'source-list',
      'response-feedback',
      'attachment-preview',
      'context-window-meter',
      'memory-panel',
    ],
  },
  '/evaluations': {
    description: '在同一条起跑线上，找到最适合你的模型。',
    chips: ['实时评测', '质量报告', '发布记录'],
    components: [
      'avara/progress',
      'avara/half-stars',
      'avara/animated-timeline',

      'eval-race',
      'eval-results',
      'lap-timer',
      'radar-chart',
      'match-field',
      'dot-histogram',
      'deploy-timeline',
    ],
  },
  '/writer': {
    description: '调整语气，梳理思路，让每一句表达恰到好处。',
    chips: ['语气改写', '内容与来源'],
    components: [
      'avara/folder',
      'avara/memories-card',
      'avara/apple-select',
      'avara/text-animation',

      'tone-rewrite',
      'artifact-panel',
      'prompt-suggestions',
      'source-list',
      'response-feedback',
      'result-carousel',
      'attachment-preview',
    ],
  },
  '/approvals': {
    description: '看清每一次工具调用，让 智能体的下一步由你掌控。',
    chips: ['审批队列', '工具管理'],
    components: [
      'avara/secure-envelope',
      'avara/verify-badge',

      'tool-approval-queue',
      'tool-call-block',
      'mcp-servers',
      'blast-radius',
      'confirmation-card',
      'rate-limits',
    ],
  },
  '/analytics': {
    description: '从每一次运行中发现信号，让决策有据可循。',
    chips: ['使用概览', '分布与趋势', '数据助手'],
    components: [
      'avara/network-graph',
      'avara/magic-bento',

      'stat-grid',
      'usage-summary',
      'chart-card',
      'tick-gauge',
      'delivery-heatmap',
      'diverging-bars',
      'iso-bars',
      'hex-density',
      'mirror-strips',
      'radial-dots',
      'message-log',
      'data-table',
      'data-answer',
    ],
  },
  '/projects': {
    description: '项目、团队与订阅，在这里井然有序。',
    chips: ['项目管理', '业务场景'],
    components: [
      'avara/draggable-card-list',
      'avara/card-stack',
      'avara/booking-card',
      'avara/stepper',

      'form-card',
      'renewal-rings',
      'booking-assistant',
      'slot-picker',
      'handoff-inbox',
      'inbox-cleanup',
      'clause-playbook',
      'support-widget',
    ],
  },
  '/creative': {
    description: '让两套组件在同一处协作，探索更有触感的任务与资源界面。',
    chips: ['全部组合', '任务与协作', '创作与资源'],
    components: avaraNames,
  },
  '/settings': {
    description: '把工作空间调整成你喜欢的样子。',
    chips: ['工作空间', '连接与偏好'],
    components: [
      'avara/color-picker',
      'avara/toggle',
      'avara/kbd',

      'text-field',
      'select-field',
      'choice-controls',
      'range-slider',
      'mcp-servers',
      'memory-panel',
      'context-window-meter',
      'rate-limits',
      'agent-avatar',
    ],
  },
}
export function FeaturePage() {
  const { pathname } = useLocation()
  const page = navigation.find((n) => n.path === pathname)!
  const config = pageSections[pathname]
  const [tab, setTab] = useState('0')
  const { onCreate } = useOutletContext<{ onCreate: () => void }>()
  const offset = tab === '0' ? 0 : tab === '1' ? 2 : 5
  const names =
    pathname === '/creative'
      ? tab === '0'
        ? avaraNames
        : avaraGroups[tab === '1' ? '任务与协作' : '创作与资源']
      : tab === '0'
        ? config.components
        : config.components.slice(offset)
  return (
    <div className="page-content">
      <PageHeading
        eyebrow="工作空间 · 功能演示"
        title={page.title}
        description={config.description}
      >
        <ExportButton />
        {pathname === '/projects' && (
          <button className="blue-button" onClick={onCreate}>
            <Plus size={14} />
            新建项目
          </button>
        )}
        <span className="demo-label">交互模拟</span>
      </PageHeading>
      <div className="feature-toolbar">
        <Segmented
          label={`${page.title}视图`}
          value={tab}
          onValueChange={setTab}
          options={config.chips.map((label, i) => ({
            value: String(i),
            label,
          }))}
        />
        <span className="tiny-note">{names.length} 个组合组件</span>
      </div>
      <BentoGrid className="feature-grid">
        {names.map((name) => (
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
              'stat-grid',
            ].includes(name)}
          />
        ))}
      </BentoGrid>
    </div>
  )
}
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
