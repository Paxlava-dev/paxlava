import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'green' | 'yellow' | 'amber' | 'red' | 'teal' | 'lav'

const variants: Record<BadgeVariant, string> = {
  default: 'bg-cream',
  green:   'bg-[#B7E4C7]',
  yellow:  'bg-yellow',
  amber:   'bg-amber',
  red:     'bg-red-200',
  teal:    'bg-teal text-white',
  lav:     'bg-lav-soft',
}

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-block px-2.5 py-1 rounded-pill border border-black text-xs font-bold',
      variants[variant],
      className,
    )}>
      {children}
    </span>
  )
}
