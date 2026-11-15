import Logo from '@/assets/logo.png'

import { LoginForm } from './login-form'

export default function LoginPage() {
  return (
    <main className="grid min-h-svh bg-background text-foreground lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-5 sm:p-6">
        <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
          <img src={Logo} alt="" className="size-7 object-contain" />
          Tuff UI
        </div>
        <div className="flex flex-1 items-center justify-center py-6">
          <div className="w-full max-w-80">
            <LoginForm />
          </div>
        </div>
      </div>
      <aside
        className="hidden flex-col items-center justify-center gap-5 border-l bg-muted p-6 lg:flex"
        aria-label="Tuff UI"
      >
        <img src={Logo} alt="" className="w-full max-w-64 object-contain" />
        <div className="flex flex-col gap-2 text-center">
          <p className="text-xl font-semibold tracking-tight">
            从想法，到界面。
          </p>
          <p className="text-sm text-muted-foreground">
            在 Tuff UI，开始你的下一次构建。
          </p>
        </div>
      </aside>
    </main>
  )
}
