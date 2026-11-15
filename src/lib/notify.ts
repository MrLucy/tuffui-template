import { toast } from '@/components/ui/toast-stack'

export function notify(message = '已完成本地模拟操作') {
  toast.success(message)
}
