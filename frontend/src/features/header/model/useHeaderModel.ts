import { useCallback, useState, useSyncExternalStore } from 'react'
import { useLocation } from 'react-router'
import type { Item } from '@/common'
import { getHeaderMetrics, type HeaderMetrics } from './header-metrics'

const MOBILE_QUERY = '(max-width: 768px)'
const COMPACT_QUERY = '(max-width: 1024px)'
const LARGE_QUERY = '(min-width: 1281px)'

/** Viewport/scroll state comes from external stores, so no effect sync is needed. */
function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mediaQueryList = window.matchMedia(query)
      mediaQueryList.addEventListener('change', onChange)
      return () => mediaQueryList.removeEventListener('change', onChange)
    },
    [query],
  )

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  )
}

function useScrolledPast(offset: number): boolean {
  const subscribe = useCallback((onChange: () => void) => {
    window.addEventListener('scroll', onChange, { passive: true })
    return () => window.removeEventListener('scroll', onChange)
  }, [])

  const getSnapshot = useCallback(() => window.scrollY > offset, [offset])

  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}

export interface UseHeaderModelOptions {
  items: readonly Item[]
  collapseOffset: number
  onMenuChange?: (open: boolean) => void
}

export interface HeaderModel {
  items: readonly Item[]
  /** Id of the nav item matching the current route, if any. */
  activeId: string | null
  /** Nav item currently hovered (drives the label reveal). */
  hoveredId: string | null
  setHoveredId: (id: string | null) => void
  /** Burger menu is open. */
  menuOpen: boolean
  toggleMenu: () => void
  closeMenu: () => void
  /** Capsule is collapsed (scrolled past the offset, or on mobile). */
  isCollapsed: boolean
  isMobile: boolean
  /** Mobile menu laid out vertically. */
  stacked: boolean
  /** Logo is hidden while collapsed (but kept visible on mobile). */
  logoHidden: boolean
  /** Route is not the hero, so the fixed header needs a spacer. */
  needsSpacer: boolean
  /** Breakpoint-resolved numeric sizes for the primitives. */
  metrics: HeaderMetrics
}

interface MenuState {
  open: boolean
  /** Navigation key the state belongs to — a route change resets the menu. */
  locationKey: string
  /** The menu closes when leaving mobile if it was opened there. */
  openedOnMobile: boolean
}

/**
 * Pure header state — no DOM/measurement concerns. Owns scroll + viewport
 * derived flags, the burger menu and the active nav item.
 */
export function useHeaderModel({
  items,
  collapseOffset,
  onMenuChange,
}: UseHeaderModelOptions): HeaderModel {
  const location = useLocation()

  const isMobile = useMediaQuery(MOBILE_QUERY)
  const isCompact = useMediaQuery(COMPACT_QUERY)
  const isLarge = useMediaQuery(LARGE_QUERY)
  const isScrolledPast = useScrolledPast(collapseOffset)
  const isCollapsed = isMobile || isScrolledPast
  const metrics = getHeaderMetrics({ isMobile, isCompact, isLarge })

  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [menu, setMenu] = useState<MenuState>(() => ({
    open: false,
    locationKey: location.key,
    openedOnMobile: isMobile,
  }))

  // The menu never survives navigation, and it closes when mobile layout goes
  // away after being opened there.
  const menuOpen =
    menu.open && menu.locationKey === location.key && (isMobile || !menu.openedOnMobile)

  const setMenuOpen = (open: boolean) => {
    setMenu({ open, locationKey: location.key, openedOnMobile: isMobile })
    onMenuChange?.(open)
  }

  const activeId = items.find((item) => item.to === location.pathname)?.id ?? null

  return {
    items,
    activeId,
    hoveredId,
    setHoveredId,
    menuOpen,
    toggleMenu: () => setMenuOpen(!menuOpen),
    closeMenu: () => setMenuOpen(false),
    isCollapsed,
    isMobile,
    stacked: menuOpen && isMobile,
    logoHidden: isCollapsed && !isMobile,
    needsSpacer: location.pathname !== '/',
    metrics,
  }
}
