import { useEffect } from 'react'
import { RouterProvider } from 'react-router/dom'

import { subscribeAuth } from '@/lib/auth'
import { router } from '@/router'

export default function App() {
  useEffect(() => subscribeAuth(() => void router.revalidate()), [])

  return <RouterProvider router={router} />
}
