import type { CSSProperties, ElementType, ReactNode } from 'react'

/** Named spacing steps backed by CSS vars (`--space-*`), falling back to px. */
const SPACE = {
  none: '0',
  xs: 'var(--space-xs)',
  sm: 'var(--space-sm)',
  md: 'var(--space-md)',
  lg: 'var(--space-lg)',
  xl: 'var(--space-xl)',
} as const

export type Space = keyof typeof SPACE | number | string

const size = (value?: Space): string | undefined =>
  value === undefined ? undefined : typeof value === 'number' ? `${value}px` : (SPACE[value as keyof typeof SPACE] ?? value)

export interface StackProps {
  as?: ElementType
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse'
  gap?: Space
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'
  padding?: Space
  wrap?: boolean
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

const ALIGN = { start: 'flex-start', center: 'center', end: 'flex-end', stretch: 'stretch' } as const
const JUSTIFY = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
} as const

/** Flexbox layout primitive — no utility classes required at call sites. */
export function Stack({
  as: Tag = 'div',
  direction = 'row',
  gap,
  align,
  justify,
  padding,
  wrap,
  className,
  style,
  children,
}: StackProps) {
  const resolved: CSSProperties = {
    display: 'flex',
    flexDirection: direction,
    gap: size(gap),
    alignItems: align ? ALIGN[align] : undefined,
    justifyContent: justify ? JUSTIFY[justify] : undefined,
    padding: size(padding),
    flexWrap: wrap ? 'wrap' : undefined,
    ...style,
  }

  return (
    <Tag className={className} style={resolved}>
      {children}
    </Tag>
  )
}
