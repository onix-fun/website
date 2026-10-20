import type { CSSProperties, ElementType, ReactNode } from 'react'
import { cn } from '@/common/lib/utils'

export interface ContainerProps {
  /** Outer element (e.g. `main`); gets the gutter and fills the viewport width. */
  as?: ElementType
  /** Max width of the inner content grid; defaults to the header grid width. */
  maxWidth?: number | string
  /** Inline padding (gutter); defaults to the header grid gutter. */
  paddingInline?: number | string
  id?: string
  className?: string
  /** Classes for the inner max-width wrapper. */
  innerClassName?: string
  style?: CSSProperties
  children?: ReactNode
}

const px = (value?: number | string) => (typeof value === 'number' ? `${value}px` : value)

/**
 * Content grid matching the header: the outer element fills the width and
 * carries the horizontal gutter, the inner wrapper caps at `maxWidth` and is
 * centered — so page content lines up with the logo/nav capsule.
 */
export function Container({
  as: Tag = 'div',
  maxWidth = 'var(--page-max-width)',
  paddingInline = 'var(--page-inline)',
  className,
  innerClassName,
  style,
  children,
  ...rest
}: ContainerProps) {
  const outer: CSSProperties = {
    width: '100%',
    paddingInline: px(paddingInline),
    ...style,
  }

  const inner: CSSProperties = {
    width: '100%',
    maxWidth: px(maxWidth),
    marginInline: 'auto',
  }

  return (
    <Tag className={cn(className)} style={outer} {...rest}>
      <div className={cn(innerClassName)} style={inner}>
        {children}
      </div>
    </Tag>
  )
}
