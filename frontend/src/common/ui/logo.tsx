import type { ComponentType, CSSProperties } from 'react'
import { Link } from 'react-router'
import { cn } from '@/common/lib/utils'
import { OnixMark } from './onix-mark'

export interface LogoSizes {
  /** Rendered mark height; width follows the mark's own aspect ratio. */
  height: number | string
}

export interface Props {
  to?: string
  label?: string
  /** Brand mark component; defaults to the Onix logo. */
  icon?: ComponentType<{
    className?: string
    style?: CSSProperties
  }>
  hidden?: boolean
  /** Breakpoint-resolved sizes supplied by the caller. */
  sizes: LogoSizes
  className?: string
}

/** Brand link; sits in the header's normal flow. Sizing comes from props. */
export function Logo({
  to = '/',
  label = 'Onix — на главную',
  icon: Icon = OnixMark,
  hidden = false,
  sizes,
  className,
}: Props) {
  return (
    <div
      className={cn(
        'pointer-events-auto flex shrink-0 items-center',
        'hover:scale-[1.05]',
        hidden && 'pointer-events-none opacity-0',
        className,
      )}
      aria-hidden={hidden || undefined}
      style={{
        transitionProperty: 'opacity, translate, scale',
        transitionDuration: '0.35s, 0.45s, 0.45s',
        transitionTimingFunction: 'ease, var(--ease-out), var(--ease-out)',
      }}
    >
      <Link
        to={to}
        aria-label={label}
        tabIndex={hidden ? -1 : undefined}
        className="flex items-center rounded-[var(--radius-sm)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--nav-focus)]"
      >
        <Icon className="h-full w-auto shrink-0 overflow-visible" style={{ height: sizes.height }} />
      </Link>
    </div>
  )
}
