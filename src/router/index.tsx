import type { RouteObject } from 'react-router'
import { createBrowserRouter } from 'react-router'
import { RootLayout } from '@/layouts/root-layout'
import {
  OverviewPage,
  FeaturePage,
  ComponentLabPage,
} from '@/features/studio/pages'
import { AboutPage } from '@/pages/about'
import { NotFoundPage } from '@/pages/not-found'
import LoginPage from '@/pages/system/login'
import { loginAction } from './login-action'
import { requireAuth } from './guards'
export const routes: RouteObject[] = [
  { path: '/login', Component: LoginPage, action: loginAction },
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: OverviewPage },
      ...[
        'agents',
        'chat',
        'evaluations',
        'writer',
        'approvals',
        'analytics',
        'projects',
        'creative',
        'settings',
      ].map((path) => ({ path, Component: FeaturePage })),
      { path: 'components', Component: ComponentLabPage },
      { path: 'about', loader: requireAuth, Component: AboutPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
]
export function createRouter() {
  return createBrowserRouter(routes)
}
export const router = createRouter()
