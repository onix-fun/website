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
  /** Returns focus to the menu toggle after Escape closes an open menu. */
  onEscape?: () => void
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
  onEscape,
  onCollapseChange,
}: UseHeaderControllerOptions): HeaderController {
  const capsuleRef = useRef<HTMLDivElement | null>(null)
  const [capsuleWidth, setCapsuleWidthState] = useState<number | null>(null)

  const capsuleWidthRef = useRef<number | null>(null)
  const fullWidthRef = useRef(0)
  const initializedRef = useRef(false)
  const prevCapsuleStateRef = useRef({ collapsed: false, open: false })
  const resizeFrameRef = useRef(0)

  // The resize listener is registered once, so keep its layout inputs current.
  const layoutStateRef = useRef({ isCollapsed, isMobile, menuOpen })
  const collapsedWidthRef = useRef(capsuleCollapsedWidth)

  useLayoutEffect(() => {
    layoutStateRef.current = { isCollapsed, isMobile, menuOpen }
    collapsedWidthRef.current = capsuleCollapsedWidth
  }, [capsuleCollapsedWidth, isCollapsed, isMobile, menuOpen])

  const setCapsuleWidth = (width: number | null) => {
    capsuleWidthRef.current = width
    setCapsuleWidthState(width)
  }

  const measure = () => {
    const { isCollapsed: collapsed, isMobile: mobile, menuOpen: open } = layoutStateRef.current
    // Hidden links have zero layout width. Never replace the remembered full
    // width with the compact button width while measuring a collapsed panel.
    if (mobile || (collapsed && !open)) return

    const el = capsuleRef.current
    if (!el) return
    const restoreWidth = el.style.width
    const restoreTransitionProperty = el.style.transitionProperty
    // Read the natural width synchronously. Otherwise clearing an explicit
    // compact width starts a CSS transition and offsetWidth captures one of
    // its intermediate frames as the full-width target.
    el.style.transitionProperty = 'none'
    el.style.width = ''
    void el.offsetWidth
    fullWidthRef.current = el.offsetWidth
    el.style.width = restoreWidth
    el.style.transitionProperty = restoreTransitionProperty
  }

  const handleResize = () => {
    cancelAnimationFrame(resizeFrameRef.current)
    // Let the browser and breakpoint-specific nav metrics settle first.
    resizeFrameRef.current = requestAnimationFrame(() => {
      const { isCollapsed: collapsed, isMobile: mobile, menuOpen: open } = layoutStateRef.current

      if (mobile) {
        setCapsuleWidth(null)
        return
      }

      if (collapsed && !open) {
        // Keep an explicit compact width so opening the menu can still animate
        // from the button, including when crossing the tablet breakpoint.
        setCapsuleWidth(collapsedWidthRef.current)
        return
      }

      measure()
      setCapsuleWidth(null)
    })
  }

  const closeMenuRef = useRef(onCloseMenu)
  const menuOpenRef = useRef(menuOpen)
  const onEscapeRef = useRef(onEscape)
  useEffect(() => {
    closeMenuRef.current = onCloseMenu
  }, [onCloseMenu])

  useEffect(() => {
    onEscapeRef.current = onEscape
  }, [onEscape])

  useEffect(() => {
    menuOpenRef.current = menuOpen
  }, [menuOpen])

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && menuOpenRef.current) {
      closeMenuRef.current()
      onEscapeRef.current?.()
    }
  }

  // Mount: measure once and keep the full width in sync with the viewport.
  useLayoutEffect(() => {
    if (!isMobile && (!isCollapsed || menuOpen)) measure()
    else fullWidthRef.current = 0
    initializedRef.current = true

    window.addEventListener('resize', handleResize, { passive: true })
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      initializedRef.current = false
      cancelAnimationFrame(resizeFrameRef.current)
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

    if (isMobile) return undefined

    // On menu open/scroll-up the full links are visible in the DOM, so measure
    // their natural width even if the previous viewport was compact.
    if (!isCollapsed || menuOpen) measure()

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
  }, [isCollapsed, isMobile, menuOpen])

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
