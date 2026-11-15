import {
  allComponentLabels as componentLabels,
  allComponentNames as componentNames,
  matchesComponent,
} from '@/features/studio/component-registry'
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router'
import {
  ArrowUpRight,
  Bell,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Command,
  Layers2,
  Menu,
  Plus,
  Search,
  Sparkles,
  X,
} from 'lucide-react'
import { navigation } from '@/features/studio/navigation'
import { notify } from '@/features/studio/demos'
import { Avatar } from '@/components/ui/agent-avatar'
import { Button } from '@/components/ui/action-button'
import { KeyCombo } from '@/components/ui/key-hint'
import { Dialog } from '@/components/ui/modal-sheet'
import { Popover } from '@/components/ui/popover-panel'
import { TextField } from '@/components/ui/text-field'
import { Toaster } from '@/components/ui/toast-stack'
import { Switch } from '@/components/ui/choice-controls'
import '@/features/studio/studio.css'
import '@/features/studio/bento.css'
import '@/features/studio/avara.css'

export function RootLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [menu, setMenu] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [projectName, setProjectName] = useState('')
  const content = useRef<HTMLElement>(null)
  const page =
    navigation.find((n) => n.path === location.pathname) ?? navigation[0]
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])
  useEffect(() => {
    content.current?.scrollTo(0, 0)
  }, [location.pathname])
  const selectRoute = (path: string) => {
    navigate(path)
    setSearchOpen(false)
    setMenu(false)
  }
  return (
    <div className="studio-app">
      {menu && (
        <button
          aria-label="关闭导航"
          className="sidebar-backdrop"
          onClick={() => setMenu(false)}
        />
      )}
      <aside className={`studio-sidebar ${menu ? 'is-open' : ''}`}>
        <Link to="/" className="studio-brand">
          <span className="brand-symbol">
            <Layers2 size={22} strokeWidth={2.4} />
          </span>
          <span>
            tuff<span className="brand-light">studio</span>
            <sup>β</sup>
          </span>
        </Link>
        <Popover
          title="切换工作空间"
          trigger={
            <button className="workspace-switch">
              <span className="workspace-icon">研</span>
              <span>
                <strong>产品研发工作空间</strong>
                <small>
                  团队版 <span>·</span> 5 位成员
                </small>
              </span>
              <ChevronDown size={14} />
            </button>
          }
        >
          <div className="workspace-menu">
            <strong>产品研发工作空间</strong>
            <p>当前演示工作空间</p>
            <Button onClick={() => notify('当前为本地演示工作空间')}>
              管理工作空间
            </Button>
          </div>
        </Popover>
        <button className="sidebar-search" onClick={() => setSearchOpen(true)}>
          <Search size={15} />
          <span>搜索工作台</span>
          <KeyCombo keys="mod+k" />
        </button>
        <nav aria-label="主导航">
          {['工作空间', '工具与洞察', '管理'].map((group) => (
            <div className="nav-group" key={group}>
              <p>{group}</p>
              {navigation
                .filter((n) => n.group === group)
                .map((n) => (
                  <NavLink
                    key={n.path}
                    to={n.path}
                    end={n.path === '/'}
                    onClick={() => setMenu(false)}
                    className={({ isActive }) =>
                      `nav-item ${isActive ? 'active' : ''}`
                    }
                  >
                    <n.icon size={17} strokeWidth={1.7} />
                    <span>{n.title}</span>
                    {n.badge && (
                      <span
                        className={`nav-badge ${n.path === '/approvals' ? 'amber' : ''}`}
                      >
                        {n.badge}
                      </span>
                    )}
                    {n.path === '/components' && <span className="lab-dot" />}
                  </NavLink>
                ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <Link className="lab-promo" to="/components">
            <span className="promo-top">
              <Sparkles size={15} /> 为好想法而构建 <ArrowUpRight size={14} />
            </span>
            <p>{componentNames.length} 个组件，无限种可能。</p>
            <span className="promo-link">
              探索组件实验室 <ChevronRight size={12} />
            </span>
          </Link>
          <a
            className="help-link"
            href="https://tuffui.com/components/eval-race"
            target="_blank"
            rel="noreferrer"
          >
            <CircleHelp size={16} />
            帮助与文档
            <ArrowUpRight size={13} />
          </a>
          <Popover
            side="top"
            title="个人偏好"
            trigger={
              <button className="profile-button">
                <Avatar name="陈明" kind="person" size="sm" />
                <span>
                  <strong>陈明</strong>
                  <small>个人账户</small>
                </span>
                <ChevronDown size={14} />
              </button>
            }
          >
            <div className="workspace-menu">
              <p>陈明 · 演示账户</p>
              <Switch label="接收工作台通知" defaultChecked />
            </div>
          </Popover>
        </div>
      </aside>
      <div className="studio-body">
        <header className="studio-topbar">
          <div className="breadcrumbs">
            <button
              className="mobile-menu"
              aria-label="打开导航"
              onClick={() => setMenu(true)}
            >
              <Menu size={20} />
            </button>
            <span className="breadcrumb-workspace">工作空间</span>
            <ChevronRight size={13} />
            <strong>{page.title}</strong>
          </div>
          <div className="topbar-right">
            <span className="demo-chip">
              <span /> 本地演示
            </span>
            <a
              href="https://tuffui.com"
              target="_blank"
              rel="noreferrer"
              className="docs-link"
            >
              TuffUI 文档 <ArrowUpRight size={12} />
            </a>
            <span className="topbar-divider" />
            <Popover
              title="通知"
              trigger={
                <button className="notification-button" aria-label="查看通知">
                  <Bell size={18} />
                  <i />
                </button>
              }
            >
              <div className="workspace-menu">
                <strong>工作空间已准备就绪</strong>
                <p>所有界面均使用本地模拟数据。</p>
                <p>
                  已整合 {componentNames.length} 个本地组件，来自 TuffUI 与
                  AvaraUI。
                </p>
              </div>
            </Popover>
            <Avatar name="陈明" kind="person" size="sm" />
          </div>
        </header>
        <main className="studio-main" ref={content}>
          <Outlet context={{ onCreate: () => setCreateOpen(true) }} />
          <footer className="studio-footer">
            <span>用好组件，让想法成形。</span>
            <span>
              基于{' '}
              <a href="https://tuffui.com" target="_blank" rel="noreferrer">
                TuffUI
              </a>
              <span className="footer-dot">×</span>
              <a
                href="https://avaraui.com/docs/nextjs/all-components"
                target="_blank"
                rel="noreferrer"
              >
                AvaraUI
              </a>
            </span>
          </footer>
        </main>
      </div>
      <Dialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        title="搜索工作台"
        description="查找页面、功能或组件"
      >
        <div className="command-search">
          <Search size={18} />
          <input
            autoFocus
            placeholder="输入功能或组件名称…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="搜索页面与组件"
          />
          {query && (
            <button aria-label="清空搜索" onClick={() => setQuery('')}>
              <X size={16} />
            </button>
          )}
        </div>
        <div className="command-results">
          {navigation
            .filter((n) =>
              `${n.title} ${n.en}`.toLowerCase().includes(query.toLowerCase()),
            )
            .map((n) => (
              <button key={n.path} onClick={() => selectRoute(n.path)}>
                <n.icon size={17} />
                <span>{n.title}</span>
                <ArrowUpRight size={14} />
              </button>
            ))}
          {query &&
            componentNames
              .filter((n) => matchesComponent(n, query))
              .slice(0, 8)
              .map((n) => (
                <button
                  key={n}
                  onClick={() => selectRoute(`/components?q=${n}`)}
                >
                  <Command size={16} />
                  <span>{componentLabels[n]}</span>
                  <span className="tiny-note">组件</span>
                </button>
              ))}
        </div>
      </Dialog>
      <Dialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="创建新项目"
        description="给你的下一个好想法，一个工作空间。"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault()
            notify(`项目「${projectName}」已创建（模拟）`)
            setProjectName('')
            setCreateOpen(false)
            navigate('/projects')
          }}
          className="create-form"
        >
          <TextField
            label="项目名称"
            placeholder="例如：下一代产品研究"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />
          <div className="flex justify-end gap-2">
            <Button onClick={() => setCreateOpen(false)}>取消</Button>
            <Button variant="primary" type="submit">
              <Plus size={14} /> 创建项目
            </Button>
          </div>
        </form>
      </Dialog>
      <Toaster />
    </div>
  )
}
