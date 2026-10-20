import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { RefObject, TransitionEvent } from 'react'

export interface UseHeaderControllerOptions {
  /** Capsule collapse state, from the model. */
  isCollapsed: boolean
  /** Burger menu state, from the model. */
  menuOpen: boolean
  /** Mobile viewport — collapse events are suppressed while mobile. */
  isMobile: boolean
  /** Collapsed capsule width (px), from `model/header-metrics`. */
  capsuleCollapsedWidth: number
  /** Closes the menu (Escape key) — owned by the model. */
  onCloseMenu: () => void
  onCollapseChange?: (collapsed: boolean) => void
}

export interface HeaderController {
  /** Attach to the nav capsule so it can be measured. */
  capsuleRef: RefObject<HTMLDivElement | null>
  /** Explicit px width while the capsule animates; `null` lets CSS decide. */
  capsuleWidth: number | null
  handleCapsuleTransitionEnd: (event: TransitionEvent<HTMLElement>) => void
}

/**
 * All imperative header mechanics: measuring the capsule, driving its
 * two-step width animation and resize/keyboard listeners. State itself lives
 * in the model; this only orchestrates the DOM.
 */
export function useHeaderController({
  isCollapsed,
  menuOpen,
  isMobile,
  capsuleCollapsedWidth,
  onCloseMenu,
  onCollapseChange,
}: UseHeaderControllerOptions): HeaderController {
  const capsuleRef = useRef<HTMLDivElement | null>(null)
  const [capsuleWidth, setCapsuleWidthState] = useState<number | null>(null)

  const capsuleWidthRef = useRef<number | null>(null)
  const fullWidthRef = useRef(0)
  const initializedRef = useRef(false)
  const prevCapsuleStateRef = useRef({ collapsed: false, open: false })

  // Latest value for the resize listener, which is registered once on mount.
  const collapsedWidthRef = useRef(capsuleCollapsedWidth)
  useEffect(() => {
    collapsedWidthRef.current = capsuleCollapsedWidth
  }, [capsuleCollapsedWidth])

  const setCapsuleWidth = (width: number | null) => {
    capsuleWidthRef.current = width
    setCapsuleWidthState(width)
  }

  const measure = () => {
    const el = capsuleRef.current
    if (!el) return
    const restoreWidth = el.style.width
    el.style.width = ''
    fullWidthRef.current = el.offsetWidth
    el.style.width = restoreWidth
  }

  const handleResize = () => {
    // Let the browser apply layout changes before re-measuring.
    requestAnimationFrame(() => {
      measure()
      setCapsuleWidth(null)
    })
  }

  const closeMenuRef = useRef(onCloseMenu)
  useEffect(() => {
    closeMenuRef.current = onCloseMenu
  }, [onCloseMenu])

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') closeMenuRef.current()
  }

  // Mount: measure once and keep the full width in sync with the viewport.
  useLayoutEffect(() => {
    measure()
    initializedRef.current = true

    window.addEventListener('resize', handleResize, { passive: true })
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      initializedRef.current = false
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('keydown', handleKeyDown)
    }
    // Listener setup is mount-only; measurements use refs for freshness.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Collapse events for consumers (scroll-driven only, like the legacy header).
  const prevCollapsedRef = useRef<boolean | null>(null)
  useEffect(() => {
    const prev = prevCollapsedRef.current
    prevCollapsedRef.current = isCollapsed
    if (isMobile) return
    if (prev === null) {
      if (isCollapsed) onCollapseChange?.(true)
      return
    }
    if (prev !== isCollapsed) onCollapseChange?.(isCollapsed)
  }, [isCollapsed, isMobile, onCollapseChange])

  // Capsule width animation: snap to the current width, then transition to the
  // target on the next frame (same two-step dance as the legacy Vue watcher).
  useLayoutEffect(() => {
    const prev = prevCapsuleStateRef.current
    const changed = prev.collapsed !== isCollapsed || prev.open !== menuOpen
    prevCapsuleStateRef.current = { collapsed: isCollapsed, open: menuOpen }
    if (!changed || !initializedRef.current) return undefined

    let secondFrame = 0

    const firstFrame = requestAnimationFrame(() => {
      const el = capsuleRef.current
      if (!el || fullWidthRef.current === 0) return

      if (isCollapsed && !menuOpen) {
        setCapsuleWidth(el.offsetWidth)
        secondFrame = requestAnimationFrame(() => {
          setCapsuleWidth(collapsedWidthRef.current)
        })
        return
      }

      if (isCollapsed && menuOpen) {
        setCapsuleWidth(collapsedWidthRef.current)
        secondFrame = requestAnimationFrame(() => {
          setCapsuleWidth(fullWidthRef.current)
        })
        return
      }

      if (capsuleWidthRef.current !== null) {
        setCapsuleWidth(collapsedWidthRef.current)
        secondFrame = requestAnimationFrame(() => {
          setCapsuleWidth(fullWidthRef.current)
        })
      }
    })

    return () => {
      cancelAnimationFrame(firstFrame)
      cancelAnimationFrame(secondFrame)
    }
  }, [isCollapsed, menuOpen])

  const handleCapsuleTransitionEnd = (event: TransitionEvent<HTMLElement>) => {
    if (event.propertyName !== 'width') return
    if (!isCollapsed || menuOpen) {
      setCapsuleWidth(null)
    }
  }

  return {
    capsuleRef,
    capsuleWidth,
    handleCapsuleTransitionEnd,
  }
}
