import {
  Activity,
  Bot,
  Check,
  CheckCircle2,
  Cloud,
  Database,
  FileText,
  Flag,
  FolderOpen,
  Layers,
  Search,
  Shield,
  Sparkles,
  WandSparkles,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { useState } from 'react'

import {
  AnimatedList,
  AnimatedListItem,
} from '@/components/avara/blocks/AnimatedListBlock'
import { AnimatedTimelineBlock } from '@/components/avara/blocks/AnimatedTimelineBlock'
import { AppleSelect } from '@/components/avara/blocks/AppleSelectBlock'
import { AvatarStack } from '@/components/avara/blocks/AvatarStackBlock'
import { BookingCard } from '@/components/avara/blocks/BookingCardBlock'
import { ConversationTimeline } from '@/components/avara/blocks/ConversationTimelineBlock'
import {
  CopyButton,
  CopyField,
} from '@/components/avara/blocks/CopyButtonBlock'
import {
  FlowCanvas,
  Flowchart,
  FlowConnection,
  FlowNode,
} from '@/components/avara/blocks/FlowchartBlock'
import { HalfStars } from '@/components/avara/blocks/HalfStarsBlock'
import { Kbd } from '@/components/avara/blocks/KbdBlock'
import {
  MagicBento,
  MagicBentoCard,
} from '@/components/avara/blocks/MagicBentoBlock'
import { MarqueeBlock } from '@/components/avara/blocks/MarqueeBlock'
import { CardStack } from '@/components/avara/blocks/motion/CardStackBlock'
import { Folder } from '@/components/avara/blocks/motion/FolderBlock'
import { MasonryGrid } from '@/components/avara/blocks/motion/MasonryGridBlock'
import { MemoriesCard } from '@/components/avara/blocks/motion/MemoriesCardBlock'
import { NetworkGraph } from '@/components/avara/blocks/NetworkGraphBlock'
import {
  CircularProgress,
  MultiProgress,
  Progress,
  ProgressField,
  ProgressSegment,
} from '@/components/avara/blocks/ProgressBlock'
import { QrCodeGenerator } from '@/components/avara/blocks/QrCodeGeneratorBlock'
import { SecureEnvelope } from '@/components/avara/blocks/SecureEnvelopeBlock'
import { Stepper, StepperContent } from '@/components/avara/blocks/StepperBlock'
import { TerminalBlock } from '@/components/avara/blocks/TerminalBlock'
import { TextAnimation } from '@/components/avara/blocks/TextAnimationBlock'
import { Toggle } from '@/components/avara/blocks/ToggleBlock'
import { VerifyBadge } from '@/components/avara/blocks/VerifyBadgeBlock'
import { ColorPicker } from '@/components/avara/color-picker'
import { InfrastructureTopology } from '@/components/avara/infrastructure-topology'
import {
  type DraggableCardItem,
  DraggableCardList,
} from '@/components/avara/motion/draggable-card-list'
import { Button } from '@/components/ui/action-button'
import { notify } from '@/lib/notify'

const {
  Days: BookingCardDays,
  Slots: BookingCardSlots,
  Submit: BookingCardSubmit,
  Confirmation: BookingCardConfirmation,
} = BookingCard
const tasks = [
  {
    id: 'review',
    title: '复盘模型评测结果',
    description: '比较四个模型的准确率与响应时间',
    badge: '评测',
    date: '11月14日',
    completed: false,
  },
  {
    id: 'library',
    title: '整理设计资源',
    description: '合并组件样式，统一工作台体验',
    badge: '设计',
    date: '11月15日',
    completed: false,
  },
  {
    id: 'report',
    title: '发布产品研究摘要',
    description: '同步本周发现，整理下一步计划',
    badge: '研究',
    date: '11月16日',
    completed: true,
  },
]
const research = tasks.map((task, i) => ({
  ...task,
  category: task.badge,
  meta: '工作空间 · 产品研发',
  icon: [<Flag size={22} />, <Layers size={22} />, <FileText size={22} />][i],
}))
const memories = tasks.map((task, i) => ({
  id: task.id,
  title: task.title,
  description: task.description,
  date: task.date,
  location: '产品研发工作空间',
  image: `/avara/project-${i + 1}.svg`,
  tag: task.badge,
}))
const timeline = [
  {
    id: '1',
    title: '建立共享工作空间',
    date: '11月12日',
    description: '统一项目资料与团队协作方式',
    icon: Layers,
  },
  {
    id: '2',
    title: '完成模型评测',
    date: '11月13日',
    description: '四个模型已完成首轮质量评测',
    icon: Flag,
  },
  {
    id: '3',
    title: '整合交互组件',
    date: '11月14日',
    description: '将两套组件融入同一个紧凑工作台',
    icon: CheckCircle2,
  },
]
const people = ['陈明', '王莉', '宋宁', '林悦'].map((name, i) => ({
  src: `/avara/avatar-${i + 1}.svg`,
  name,
  alt: name,
  fallback: name,
  tooltip: name,
  designation: ['产品负责人', '界面设计', '开发工程', '研究分析'][i],
}))
function TaskList() {
  const [items, setItems] = useState<DraggableCardItem[]>(tasks)
  return (
    <DraggableCardList
      items={items}
      variant="modern"
      enableCheckboxes
      onReorder={setItems}
      onToggleComplete={(id, completed) =>
        setItems((items) =>
          items.map((item) => (item.id === id ? { ...item, completed } : item)),
        )
      }
      title="本周任务"
      subtitle="拖动右侧手柄排序，点击圆点标记完成"
    />
  )
}
function Rating() {
  const [rating, setRating] = useState(4.5)
  return (
    <div className="avara-rating">
      <div>
        <strong>这次协作体验怎么样？</strong>
        <p>点击星星评分，支持半星。</p>
      </div>
      <HalfStars
        rating={rating}
        interactive
        showText
        size={24}
        onRatingChange={setRating}
      />
      <span className="tiny-note">当前评分：{rating} / 5</span>
    </div>
  )
}
function Wizard() {
  const [step, setStep] = useState(0)
  const steps = [
    {
      id: '1',
      title: '确定目标',
      description: '选择研究方向',
      content: <p>明确目标：分析模型表现，找出质量与成本的平衡点。</p>,
    },
    {
      id: '2',
      title: '配置任务',
      description: '选择模型与数据',
      content: <p>已选择 4 个模型和 1,000 条客服对话用例。</p>,
    },
    {
      id: '3',
      title: '完成创建',
      description: '准备开始运行',
      content: <p>配置已就绪，可以开始本地模拟任务。</p>,
    },
  ]
  return (
    <div className="avara-wizard">
      <Stepper steps={steps} currentStep={step} onStepChange={setStep} />
      <StepperContent steps={steps} currentStep={step} />
      <div className="avara-actions">
        <Button disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
          上一步
        </Button>
        <Button
          variant="primary"
          onClick={() =>
            step === 2
              ? notify('研究任务已创建（模拟）')
              : setStep((s) => s + 1)
          }
        >
          {step === 2 ? '创建任务' : '下一步'}
        </Button>
      </div>
    </div>
  )
}
function ColorStudio() {
  const [color, setColor] = useState('#6b9aff')
  return (
    <div className="avara-color">
      <ColorPicker
        value={color}
        onChange={setColor}
        showShades={false}
        showHarmonies={false}
        showEyeDropper={false}
      />
      <div className="avara-color-preview" style={{ borderColor: color }}>
        <span style={{ background: color }} />
        当前项目强调色<strong>{color.toUpperCase()}</strong>
      </div>
    </div>
  )
}
function ProgressDemo() {
  const [value, setValue] = useState(68)
  return (
    <div className="avara-progress">
      <ProgressField
        label="研究任务"
        value={value}
        hint="已整理资料，正在生成摘要"
      >
        <Progress value={value} />
      </ProgressField>
      <div className="avara-progress-row">
        <CircularProgress value={value} circleSize={82} />
        <div>
          <strong>让进度清晰可见。</strong>
          <p>资料整理、模型评测、内容创作，集中掌握。</p>
          <Button
            onClick={() =>
              setValue(value >= 100 ? 0 : Math.min(100, value + 16))
            }
          >
            {value >= 100 ? '重新运行' : '推进任务'}
          </Button>
        </div>
      </div>
      <MultiProgress max={100}>
        <ProgressSegment value={48} label="评测" />
        <ProgressSegment value={24} label="研究" color="emerald" />
        <ProgressSegment value={12} label="创作" color="indigo" />
      </MultiProgress>
    </div>
  )
}
function BookingDemo() {
  return (
    <BookingCard
      onBook={() => {
        notify('复盘会议已预约（模拟）')
      }}
    >
      <div className="avara-booking-heading">
        <strong>团队评测复盘</strong>
        <p>选择日期与时段，安排一次 30 分钟的交流。</p>
      </div>
      <BookingCardDays
        days={[16, 17, 18, 19, 20].map(
          (day) => new Date(`2026-11-${day}T12:00:00+08:00`),
        )}
      />
      <BookingCardSlots
        label="上午"
        slots={[
          { label: '09:30' },
          { label: '10:30' },
          { label: '11:30', taken: true },
        ]}
      />
      <BookingCardSlots
        label="下午"
        slots={[{ label: '14:00' }, { label: '15:30' }, { label: '16:30' }]}
      />
      <BookingCardSubmit>确认预约</BookingCardSubmit>
      <BookingCardConfirmation withName="产品研发团队" place="线上会议室" />
    </BookingCard>
  )
}
function FlowDemo() {
  return (
    <Flowchart layout="fluid" color="primary" className="avara-flow">
      <FlowCanvas viewBox="0 0 560 220" preserveAspectRatio="none">
        <FlowConnection
          id="research"
          path="M 160 55 C 240 55 240 110 300 110"
        />
        <FlowConnection id="write" path="M 160 165 C 240 165 240 110 300 110" />
        <FlowConnection id="output" path="M 430 110 H 550" />
      </FlowCanvas>
      <FlowNode
        id="source"
        title="知识检索"
        description="产品资料"
        icon={Search}
        connectedPaths={['research']}
        style={{ left: 0, top: 20 }}
      />
      <FlowNode
        id="draft"
        title="内容创作"
        description="研究摘要"
        icon={WandSparkles}
        connectedPaths={['write']}
        style={{ left: 0, top: 130 }}
      />
      <FlowNode
        id="review"
        title="质量审核"
        description="确认后输出"
        icon={Shield}
        connectedPaths={['research', 'write', 'output']}
        style={{ right: 0, top: 75 }}
      />
    </Flowchart>
  )
}
function TopologyDemo() {
  return (
    <InfrastructureTopology
      headerTitle="服务运行概览"
      headerSubtitle="工作空间基础设施"
      statusBadge="全部在线"
      bandwidthBadge="连接稳定"
      centerTitle="智能调度"
      centerSubtitle="任务协调中心"
      animated={false}
      nodes={[
        {
          id: 'auth',
          title: '身份认证',
          subtitle: '团队权限',
          badgeText: '已验证',
          position: 'top-left',
          icon: <Shield size={14} />,
          color: 'blue',
          strokeColor: '#6b9aff',
        },
        {
          id: 'knowledge',
          title: '知识资料',
          subtitle: '产品文档',
          badgeText: '已同步',
          position: 'bottom-left',
          icon: <FileText size={14} />,
          color: 'purple',
          strokeColor: '#ad8ad2',
        },
        {
          id: 'db',
          title: '运行数据',
          subtitle: '任务记录',
          badgeText: '在线',
          position: 'top-right',
          icon: <Database size={14} />,
          color: 'emerald',
          strokeColor: '#75ba9c',
        },
        {
          id: 'models',
          title: '模型服务',
          subtitle: '推理与生成',
          badgeText: '可用',
          position: 'middle-right',
          icon: <Cloud size={14} />,
          color: 'blue',
          strokeColor: '#6b9aff',
        },
        {
          id: 'metrics',
          title: '运行监控',
          subtitle: '响应与质量',
          badgeText: '正常',
          position: 'bottom-right',
          icon: <Activity size={14} />,
          color: 'emerald',
          strokeColor: '#75ba9c',
        },
      ]}
      metrics={[
        {
          id: '1',
          label: '任务成功率',
          value: '98.6%',
          icon: <Check size={12} />,
        },
        {
          id: '2',
          label: '平均响应',
          value: '1.24 秒',
          icon: <Activity size={12} />,
        },
      ]}
    />
  )
}
function ConversationDemo() {
  const [active, setActive] = useState('3')
  const checkpoints = [
    {
      id: '1',
      label: '提出研究目标',
      sublabel: '整理产品与模型数据',
      role: 'user' as const,
    },
    {
      id: '2',
      label: '对比模型表现',
      sublabel: '四个模型质量分析',
      role: 'assistant' as const,
    },
    {
      id: '3',
      label: '生成优化建议',
      sublabel: '按任务复杂度分配模型',
      role: 'assistant' as const,
    },
    {
      id: '4',
      label: '确认下一步计划',
      sublabel: '准备运行新一轮评测',
      role: 'user' as const,
    },
  ]
  return (
    <div className="avara-conversation">
      <ConversationTimeline
        checkpoints={checkpoints}
        activeId={active}
        onSelect={setActive}
        showLabels
        side="left"
      />
      <div>
        <strong>
          {checkpoints.find((point) => point.id === active)?.label}
        </strong>
        <p>{checkpoints.find((point) => point.id === active)?.sublabel}</p>
        <span className="tiny-note">点击时间标记，在研究步骤之间切换。</span>
      </div>
    </div>
  )
}
const demos: Record<string, () => ReactNode> = {
  'avara/card-stack': () => (
    <CardStack title="待阅读研究" items={research} loop swipeToDismiss />
  ),
  'avara/draggable-card-list': () => <TaskList />,
  'avara/folder': () => (
    <div className="avara-folder">
      <Folder
        label="产品研究资料"
        count="3 份资料 · 悬停展开"
        size={215}
        icon={FolderOpen}
        files={tasks.map((task, i) => ({
          name: `${task.title}.md`,
          thumb: `/avara/project-${i + 1}.svg`,
          content: (
            <div className="avara-folder-page">
              <FileText size={17} />
              <strong>{task.title}</strong>
              <p>{task.description}</p>
              <span>第 {i + 1} 份资料</span>
            </div>
          ),
        }))}
      />
    </div>
  ),
  'avara/memories-card': () => <MemoriesCard items={memories} />,
  'avara/magic-bento': () => (
    <MagicBento className="avara-magic">
      <MagicBentoCard highlight>
        <Sparkles size={22} />
        <strong>让好想法开始工作。</strong>
        <p>聚光跟随鼠标，串起研究、创作与协作。</p>
      </MagicBentoCard>
      <MagicBentoCard>
        <Flag size={20} />
        <strong>模型评测</strong>
        <span>质量通过率 98.6%</span>
      </MagicBentoCard>
      <MagicBentoCard>
        <Layers size={20} />
        <strong>双库协作</strong>
        <span>TuffUI × AvaraUI</span>
      </MagicBentoCard>
    </MagicBento>
  ),
  'avara/animated-list': () => (
    <AnimatedList className="avara-list">
      {tasks.map((task) => (
        <AnimatedListItem key={task.id}>
          <span className="avara-task-dot" />
          <div>
            <strong>{task.title}</strong>
            <p>{task.description}</p>
          </div>
          <span>{task.badge}</span>
        </AnimatedListItem>
      ))}
    </AnimatedList>
  ),
  'avara/animated-timeline': () => (
    <AnimatedTimelineBlock items={timeline} color="primary" />
  ),
  'avara/flowchart': () => <FlowDemo />,
  'avara/infrastructure-topology': () => <TopologyDemo />,
  'avara/network-graph': () => (
    <NetworkGraph
      nodes={people.map((person, i) => ({
        id: person.name,
        ring: i < 2 ? 1 : 2,
        image: person.src,
        label: person.name,
        fallback: person.name,
      }))}
      centerNode={{ fallback: '团队', label: '产品研发' }}
      ringCount={2}
      baseRadius={65}
      ringGap={55}
      animateOrbit={false}
      className="avara-network"
    />
  ),
  'avara/avatar-stack': () => (
    <div className="avara-people">
      <AvatarStack
        avatars={people}
        variant="spread"
        max={4}
        size="md"
        showTooltip
      />
      <div>
        <strong>团队协作进行中</strong>
        <p>4 位成员 · 产品研发工作空间</p>
      </div>
      <VerifyBadge size="sm" />
    </div>
  ),
  'avara/copy-button': () => (
    <div className="avara-copy">
      <CopyField
        value="https://studio.example.com/project/research"
        label="项目分享链接"
      />
      <CopyButton
        value="本周研究：通过率 98.6%，平均响应时间 1.24 秒。"
        label="复制项目摘要"
        copiedLabel="摘要已复制"
        errorLabel="复制失败，请重试"
        size="sm"
        variant="soft"
      />
    </div>
  ),
  'avara/half-stars': () => <Rating />,
  'avara/stepper': () => <Wizard />,
  'avara/booking-card': () => <BookingDemo />,
  'avara/progress': () => <ProgressDemo />,
  'avara/terminal': () => (
    <TerminalBlock
      filename="工作台构建"
      code={
        '$ npm run build\n\n正在构建生产版本…\n✓ 已处理 248 个模块\n✓ 构建完成，用时 1.28 秒\n\n所有任务均已完成。'
      }
      copyable
    />
  ),
  'avara/color-picker': () => <ColorStudio />,
  'avara/apple-select': () => (
    <div className="avara-selected">
      <span className="tiny-note">研究摘要 · 重点标注</span>
      <AppleSelect
        text="把复杂的工作交给工作台，把时间留给好想法。"
        selection={[10, 20]}
      />
      <p>统一整理、评测与创作，让团队专注有价值的事。</p>
    </div>
  ),
  'avara/conversation-timeline': () => <ConversationDemo />,
  'avara/secure-envelope': () => (
    <SecureEnvelope
      data={{
        sleeveTitle: '研究档案',
        sleeveSubtitle: '产品研发工作空间',
        frontTitle: '模型评测报告',
        frontSubtitle: '质量、效率与成本',
        frontBadge: '内部资料',
        frontSerial: '第 0042 号',
        cardTitle: '让决策有据可循',
        cardSubtitle: '本周产品研究',
        statement: '四个模型，同一组数据，持续比较每一步表现。',
        highlightQuote: '把好问题，变成更好的工作方式。',
        authorText: '产品研发团队',
        holderName: '陈明',
        roleTitle: '项目负责人',
        department: '产品研究',
        authLevel: '团队可见',
        statusText: '研究已完成',
        tagline: '汇集每一个值得保留的发现',
        subTagline: '悬停或点击打开档案',
        dossierNumber: '第 0042 号',
        stampBadge: '已归档',
        frontStamp: '已验证',
        stampSuffix: '团队档案',
        barcodeText: '资料编号 0042',
        clearanceLevel: '团队可见',
        cardCategory: '研究摘要',
        cardBadge: '状态',
        cardVersion: '已归档',
        idNumber: '研究档案 0042',
        cardDate: '2026年11月14日',
        metrics: [
          { label: '通过率', value: '98.6%' },
          { label: '平均响应', value: '1.24 秒' },
        ],
      }}
      className="avara-envelope"
    />
  ),
  'avara/verify-badge': () => (
    <div className="avara-verified">
      <VerifyBadge size="lg" />
      <div>
        <strong>产品研发工作空间</strong>
        <p>团队身份已验证 · 协作资料可信</p>
      </div>
    </div>
  ),
  'avara/toggle': () => (
    <div className="avara-toggles">
      <Toggle size="sm" variant="outline" defaultPressed>
        <Layers size={14} />
        显示图层
      </Toggle>
      <Toggle size="sm" variant="outline">
        <WandSparkles size={14} />
        精简模式
      </Toggle>
      <Toggle size="sm" variant="outline" defaultPressed>
        <Bot size={14} />
        智能建议
      </Toggle>
    </div>
  ),
  'avara/qr-code': () => (
    <div className="avara-qr">
      <QrCodeGenerator
        value="https://studio.example.com/project/research"
        size={132}
      />
      <div>
        <strong>分享这个项目</strong>
        <p>二维码指向示例项目地址，用于演示分享入口。</p>
        <CopyButton
          value="https://studio.example.com/project/research"
          label="复制地址"
          size="sm"
        />
      </div>
    </div>
  ),
  'avara/kbd': () => (
    <div className="avara-shortcut-grid">
      <span>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>搜索工作台
      </span>
      <span>
        <Kbd>↵</Kbd>确认操作
      </span>
      <span>
        <Kbd>退出</Kbd>关闭面板
      </span>
    </div>
  ),
  'avara/marquee': () => (
    <MarqueeBlock pauseOnHover fade speed="slow" gap="8px">
      {[
        '研究资料已更新',
        '模型评测已完成',
        '4 位成员在线',
        '产品摘要待确认',
      ].map((text) => (
        <span className="avara-news" key={text}>
          <span />
          {text}
        </span>
      ))}
    </MarqueeBlock>
  ),
  'avara/masonry-grid': () => (
    <MasonryGrid
      items={memories}
      columnsClassName="columns-2"
      gapClassName="gap-2"
      animateIn={false}
      renderItem={(item) => (
        <div className="avara-resource">
          <img src={item.image} alt={item.title} />
          <strong>{item.title}</strong>
          <p>{item.description}</p>
          <small>{item.date}</small>
        </div>
      )}
    />
  ),
  'avara/text-animation': () => (
    <div className="avara-typography">
      <TextAnimation text="让灵感，成为下一步。" variant="blur-reveal" />
      <p>从一个好问题，开始一段更高效的协作。</p>
    </div>
  ),
}
export function AvaraDemo({ name }: { name: string }) {
  return (
    <div className="avara-demo" data-avara={name}>
      {demos[name]?.()}
    </div>
  )
}
export default AvaraDemo
