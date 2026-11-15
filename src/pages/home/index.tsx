import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Circle,
  Command,
  Flag,
  FlaskConical,
  Plus,
  Sparkles,
  Workflow,
} from 'lucide-react'
import { useState } from 'react'
import { Link, useOutletContext } from 'react-router'

import { BentoGrid } from '@/components/studio/bento-grid'
import { DemoCard } from '@/components/studio/demo-card'
import { RaceDemo } from '@/components/studio/demos'
import { ExportButton } from '@/components/studio/export-button'
import { PageHeading } from '@/components/studio/page-heading'
import { Avatar } from '@/components/ui/agent-avatar'
import { ChartCard } from '@/components/ui/chart-card'
import { Segmented } from '@/components/ui/segmented-control'
import { StatGrid } from '@/components/ui/stat-grid'
import { StatusPill } from '@/components/ui/status-pill'
import { allComponentNames } from '@/config/component-registry'
import * as D from '@/data/studio'

export function HomePage() {
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
