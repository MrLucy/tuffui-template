import type { RouteObject } from 'react-router'
import { createBrowserRouter } from 'react-router'

import {
  ComponentLabPage,
  FeaturePage,
  OverviewPage,
} from '@/features/studio/pages'
import { RootLayout } from '@/layouts/root-layout'
import { AboutPage } from '@/pages/about'
import { NotFoundPage } from '@/pages/not-found'
export const routes: RouteObject[] = [
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
      { path: 'about', Component: AboutPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
]
export function createRouter() {
  return createBrowserRouter(routes)
}
export const router = createRouter()
