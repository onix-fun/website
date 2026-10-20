import type { CSSProperties, ReactNode, Ref, TransitionEvent } from 'react'
import { cn } from '@/common/lib/utils'

export type PositionType = 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky'

export interface PositionProps {
  position?: PositionType
  top?: number | string
  right?: number | string
  bottom?: number | string
  left?: number | string
  /** Stretch horizontally to the viewport edges (`left: 0; right: 0`). */
  insetX?: boolean
  /** Stretch vertically to the viewport edges (`top: 0; bottom: 0`). */
  insetY?: boolean
  /** Centers the box on a given axis via translate. */
  centerX?: boolean
  centerY?: boolean
  /** Centers along the axis using auto margins (needs an explicit width/max-width). */
  centerSelf?: boolean
  /** Max width constraint (number is treated as px). */
  maxWidth?: number | string
  minHeight?: number | string
  zIndex?: number
  className?: string
  style?: CSSProperties
  ref?: Ref<HTMLDivElement>
  onTransitionEnd?: (event: TransitionEvent<HTMLElement>) => void
  children?: ReactNode
}

const px = (value?: number | string) => (typeof value === 'number' ? `${value}px` : value)

/** Positional container — sets coordinates without utility classes. */
export function Position({
  position = 'absolute',
  top,
  right,
  bottom,
  left,
  insetX,
  insetY,
  centerX,
  centerY,
  centerSelf,
  maxWidth,
  minHeight,
  zIndex,
  className,
  style,
  ref,
  onTransitionEnd,
  children,
}: PositionProps) {
  const transforms: string[] = []
  if (centerX) transforms.push('translateX(-50%)')
  if (centerY) transforms.push('translateY(-50%)')

  const resolved: CSSProperties = {
    position,
    top: insetY ? 0 : (centerY ? '50%' : px(top)),
    right: insetX ? 0 : px(right),
    bottom: insetY ? 0 : px(bottom),
    left: insetX ? 0 : (centerX ? '50%' : px(left)),
    zIndex,
    maxWidth: px(maxWidth),
    minHeight: px(minHeight),
    marginInline: centerSelf ? 'auto' : undefined,
    transform: transforms.length > 0 ? transforms.join(' ') : undefined,
    ...style,
  }

  return (
    <div ref={ref} className={cn(className)} style={resolved} onTransitionEnd={onTransitionEnd}>
      {children}
    </div>
  )
}
