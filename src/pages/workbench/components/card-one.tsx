import {
  type RenewalContract,
  RenewalRings,
} from '@/components/ui/renewal-rings'

type CardOneProps = {
  contracts: RenewalContract[]
}

export function CardOne({ contracts }: CardOneProps) {
  return (
    <RenewalRings
      contracts={contracts}
      title="合同续约"
      heading="剩余期限"
      defaultSelectedId={contracts[0]?.id}
    />
  )
}
