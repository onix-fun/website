import { useCallback, useRef, useState, useSyncExternalStore } from 'react'
import { useLocation } from 'react-router'
import type { Item } from '@/common'
import { getHeaderMetrics, type HeaderMetrics } from './header-metrics'

const MOBILE_QUERY = '(max-width: 768px)'
const COMPACT_QUERY = '(max-width: 1024px)'

/** Viewport/scroll state comes from external stores, so no effect sync is needed. */
function useMediaQuery(query: string, onMatchChange?: (matches: boolean) => void): boolean {
  const subscribe = useCallback(
    (notifySnapshotChange: () => void) => {
      const mediaQueryList = window.matchMedia(query)
      const handleChange = () => {
        onMatchChange?.(mediaQueryList.matches)
        notifySnapshotChange()
      }
      mediaQueryList.addEventListener('change', handleChange)
      return () => mediaQueryList.removeEventListener('change', handleChange)
    },
    [onMatchChange, query],
  )

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  )
}

function useScrolledPast(
  offset: number,
  onExpandedScroll?: () => void,
  onCollapsedScroll?: () => void,
): boolean {
  const subscribe = useCallback((onChange: () => void) => {
    let wasScrolledPast = window.scrollY > offset
    const handleScroll = () => {
      const isScrolledPast = window.scrollY > offset
      if (isScrolledPast !== wasScrolledPast) {
        wasScrolledPast = isScrolledPast
        if (isScrolledPast) onCollapsedScroll?.()
        else onExpandedScroll?.()
      }
      onChange()
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [offset, onCollapsedScroll, onExpandedScroll])

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
  /** Whether leaving mobile should close this menu. */
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

  const [menu, setMenu] = useState<MenuState>(() => ({
    open: false,
    locationKey: location.key,
    openedOnMobile: false,
  }))
  const menuRef = useRef(menu)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const clearHoveredId = useCallback(() => setHoveredId(null), [])

  const closeMenuOnScrollUp = useCallback(() => {
    const currentMenu = menuRef.current
    if (!currentMenu.open || currentMenu.openedOnMobile) return

    const closedMenu = {
      open: false,
      locationKey: location.key,
      openedOnMobile: false,
    }
    menuRef.current = closedMenu
    setMenu(closedMenu)
    onMenuChange?.(false)
  }, [location.key, onMenuChange])

  const handleMobileQueryChange = useCallback((matches: boolean) => {
    const currentMenu = menuRef.current
    if (matches || !currentMenu.open || !currentMenu.openedOnMobile) return

    const closedMenu = {
      open: false,
      locationKey: location.key,
      openedOnMobile: false,
    }
    menuRef.current = closedMenu
    setMenu(closedMenu)
    onMenuChange?.(false)
  }, [location.key, onMenuChange])

  const isMobile = useMediaQuery(MOBILE_QUERY, handleMobileQueryChange)
  const isCompact = useMediaQuery(COMPACT_QUERY)
  const isScrolledPast = useScrolledPast(collapseOffset, closeMenuOnScrollUp, clearHoveredId)
  const isCollapsed = isMobile || isScrolledPast
  const metrics = getHeaderMetrics({ isMobile, isCompact })

  // The menu never survives navigation, and it closes when mobile layout goes
  // away after being opened there.
  const menuOpen =
    menu.open && menu.locationKey === location.key && (isMobile || !menu.openedOnMobile)

  const setMenuOpen = useCallback((open: boolean) => {
    const nextMenu = { open, locationKey: location.key, openedOnMobile: isMobile }
    menuRef.current = nextMenu
    setMenu(nextMenu)
    onMenuChange?.(open)
  }, [isMobile, location.key, onMenuChange])

  const toggleMenu = useCallback(() => setMenuOpen(!menuOpen), [menuOpen, setMenuOpen])
  const closeMenu = useCallback(() => setMenuOpen(false), [setMenuOpen])

  const activeId = items.find((item) => item.to === location.pathname)?.id ?? null

  return {
    items,
    activeId,
    hoveredId,
    setHoveredId,
    menuOpen,
    toggleMenu,
    closeMenu,
    isCollapsed,
    isMobile,
    stacked: isMobile,
    logoHidden: isCollapsed && !isMobile,
    needsSpacer: location.pathname !== '/',
    metrics,
  }
}
