import { LoaderCircle } from 'lucide-react'
import { Form, useActionData, useNavigation } from 'react-router'

import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { loginAction } from '@/router/login-action'

export function LoginForm({ className }: { className?: string }) {
  const result = useActionData<typeof loginAction>()
  const navigation = useNavigation()
  const pending = navigation.state !== 'idle'
  const errors = pending ? undefined : result?.errors

  return (
    <Form
      method="post"
      action="/login"
      noValidate
      className={cn('flex flex-col gap-5', className)}
      aria-busy={pending}
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">欢迎回来</h1>
        <p className="text-sm text-muted-foreground">
          登录你的 Tuff UI 账号，继续工作。
        </p>
      </div>
      <FieldGroup className="gap-4">
        <Field data-invalid={!!errors?.email} data-disabled={pending}>
          <FieldLabel htmlFor="email">邮箱</FieldLabel>
          <Input
            id="email"
            name="email"
            defaultValue="admin@example.com"
            type="email"
            placeholder="请输入邮箱地址"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            required
            disabled={pending}
            aria-invalid={!!errors?.email}
            aria-describedby={errors?.email ? 'email-error' : undefined}
          />
          <FieldError id="email-error">{errors?.email}</FieldError>
        </Field>
        <Field data-invalid={!!errors?.password} data-disabled={pending}>
          <FieldLabel htmlFor="password">密码</FieldLabel>
          <Input
            id="password"
            name="password"
            defaultValue="123456"
            type="password"
            placeholder="请输入密码"
            autoComplete="current-password"
            required
            disabled={pending}
            aria-invalid={!!errors?.password}
            aria-describedby={errors?.password ? 'password-error' : undefined}
          />
          <FieldError id="password-error">{errors?.password}</FieldError>
        </Field>
        <Field>
          <FieldError>{errors?.form}</FieldError>
          <Button type="submit" disabled={pending}>
            {pending && (
              <LoaderCircle
                data-icon="inline-start"
                className="motion-safe:animate-spin"
                aria-hidden="true"
              />
            )}
            {pending ? '正在登录…' : '登录'}
          </Button>
          {import.meta.env.DEV && (
            <FieldDescription className="text-xs leading-5">
              演示账号：admin@example.com
              <br />
              演示密码：123456
            </FieldDescription>
          )}
        </Field>
      </FieldGroup>
    </Form>
  )
}
