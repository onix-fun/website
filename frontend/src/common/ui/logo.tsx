import type { ComponentType, CSSProperties } from 'react'
import { Link } from 'react-router'
import { cn } from '@/common/lib/utils'

export interface LogoSizes {
  width: number
  height: number
  iconWidth: number
}

export interface Props {
  to?: string
  label?: string
  icon: ComponentType<{
    className?: string
    style?: CSSProperties
    'aria-hidden'?: boolean
    strokeWidth?: number
  }>
  hidden?: boolean
  /** Breakpoint-resolved sizes supplied by the caller. */
  sizes: LogoSizes
  className?: string
}

/** Brand link; sits in the header's normal flow. Sizing comes from props. */
export function Logo({
  to = '/',
  label = 'Главная',
  icon: Icon,
  hidden = false,
  sizes,
  className,
}: Props) {
  return (
    <div
      className={cn(
        'pointer-events-auto flex shrink-0 items-center justify-center p-[5px_7px] text-[var(--color-accent)]',
        'hover:scale-[1.05]',
        'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-focus)]',
        hidden && 'pointer-events-none opacity-0',
        className,
      )}
      style={{
        width: sizes.width,
        height: sizes.height,
        transitionProperty: 'opacity, translate, scale',
        transitionDuration: '0.35s, 0.45s, 0.45s',
        transitionTimingFunction: 'ease, var(--ease-out), var(--ease-out)',
      }}
    >
      <Link to={to} aria-label={label} className="flex h-full w-full items-center justify-center">
        <Icon
          aria-hidden
          strokeWidth={1.5}
          className="h-auto max-h-full shrink-0 overflow-visible"
          style={{ width: sizes.iconWidth }}
        />
      </Link>
    </div>
  )
}
