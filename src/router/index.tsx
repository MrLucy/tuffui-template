import type { RouteObject } from 'react-router'
import { createBrowserRouter } from 'react-router'

import { RootLayout } from '@/layouts/root-layout'
import { AboutPage } from '@/pages/about'
import { AgentsPage } from '@/pages/agents'
import { AnalyticsPage } from '@/pages/analytics'
import { ApprovalsPage } from '@/pages/approvals'
import { ChatPage } from '@/pages/chat'
import { ComponentLabPage } from '@/pages/components'
import { CreativePage } from '@/pages/creative'
import { EvaluationsPage } from '@/pages/evaluations'
import { HomePage } from '@/pages/home'
import { NotFoundPage } from '@/pages/not-found'
import { ProjectsPage } from '@/pages/projects'
import { SettingsPage } from '@/pages/settings'
import { WriterPage } from '@/pages/writer'

export const routes: RouteObject[] = [
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: 'agents', Component: AgentsPage },
      { path: 'chat', Component: ChatPage },
      { path: 'evaluations', Component: EvaluationsPage },
      { path: 'writer', Component: WriterPage },
      { path: 'approvals', Component: ApprovalsPage },
      { path: 'analytics', Component: AnalyticsPage },
      { path: 'projects', Component: ProjectsPage },
      { path: 'creative', Component: CreativePage },
      { path: 'settings', Component: SettingsPage },
      { path: 'components', Component: ComponentLabPage },
      { path: 'about', Component: AboutPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
]
export function createRouter() {
  return createBrowserRouter(routes)
}
export const router = createRouter()
