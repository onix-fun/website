/**
 * Numeric header metrics, resolved per breakpoint in JS. These mirror the
 * former CSS tokens (`--item-size`, `--burger-size`, …) but are plain numbers
 * so `common/ui` primitives can receive them as props without knowing any
 * header token names.
 */
export interface HeaderMetrics {
  headerInline: number
  headerHeight: number
  headerMaxWidth: number
  /** Rendered brand-mark height (px); width follows the mark's aspect ratio. */
  logoHeight: number
  itemSize: number
  itemLabelMax: number
  iconSize: number
  burgerSize: number
  burgerBarWidth: number
  /** Panel content inset (px) — half the collapsed circle's padding. */
  capsulePadding: number
  /** Space between the capsule's children (px). */
  capsuleGap: number
  /** Collapsed capsule size (px) — a perfect square so it reads as a circle. */
  capsuleCollapsedWidth: number
}

export interface HeaderViewport {
  isMobile: boolean
  isCompact: boolean
}

/** Panel border width (px) — matches the capsule's `border` in `navPanel`. */
const PANEL_BORDER = 1

/**
 * Collapsed capsule is a circle: burger + equal padding/border on every side.
 * Derived (not hardcoded) so it can never drift into an oval.
 */
function collapsedCapsuleSize(burgerSize: number, capsulePadding: number): number {
  return burgerSize + 2 * (capsulePadding + PANEL_BORDER)
}

export function getHeaderMetrics({ isMobile, isCompact }: HeaderViewport): HeaderMetrics {
  if (isMobile) {
    const capsulePadding = 4
    const burgerSize = 48
    return {
      headerInline: 24,
      headerHeight: 62,
      headerMaxWidth: 1296,
      logoHeight: 44,
      itemSize: 48,
      itemLabelMax: 260,
      iconSize: 22,
      burgerSize,
      burgerBarWidth: 18,
      capsulePadding,
      capsuleGap: 4,
      capsuleCollapsedWidth: collapsedCapsuleSize(burgerSize, capsulePadding),
    }
  }

  if (isCompact) {
    const capsulePadding = 4
    const burgerSize = 58
    return {
      headerInline: 40,
      headerHeight: 62,
      headerMaxWidth: 1296,
      logoHeight: 48,
      itemSize: 48,
      itemLabelMax: 260,
      iconSize: 22,
      burgerSize,
      burgerBarWidth: 22,
      capsulePadding,
      capsuleGap: 4,
      capsuleCollapsedWidth: collapsedCapsuleSize(burgerSize, capsulePadding),
    }
  }

  const capsulePadding = 8
  const burgerSize = 58
  return {
    headerInline: 72,
    headerHeight: 62,
    headerMaxWidth: 1296,
    logoHeight: 52,
    itemSize: 56,
    itemLabelMax: 300,
    iconSize: 24,
    burgerSize,
    burgerBarWidth: 22,
    capsulePadding,
    capsuleGap: 8,
    capsuleCollapsedWidth: collapsedCapsuleSize(burgerSize, capsulePadding),
  }
}
