import type { CSSProperties } from 'react'

export interface SpacerProps {
  /** Reserved space along the given axis. */
  size: number | string
  axis?: 'x' | 'y'
  className?: string
  style?: CSSProperties
}

/** Inserts fixed empty space in a layout (replaces magic-height divs). */
export function Spacer({ size: value, axis = 'y', className, style }: SpacerProps) {
  const resolved: CSSProperties =
    axis === 'x'
      ? { display: 'inline-block', flex: '0 0 auto', width: value, ...style }
      : { display: 'block', flex: '0 0 auto', height: value, ...style }

  return <div aria-hidden className={className} style={resolved} />
}
