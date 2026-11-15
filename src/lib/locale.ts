/** 将计数单位转换成中文，不使用英语复数后缀。 */
export function formatCount(count: number, unit: string) {
  const units: Record<string, string> = {
    lap: '圈',
    case: '条用例',
    model: '个模型',
    sender: '位发件人',
    contract: '份合同',
    day: '天',
  }
  return `${count} ${units[unit] ?? unit}`
}
