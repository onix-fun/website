import type { CSSProperties, ComponentType, Ref, TransitionEvent } from 'react'
import { cn } from '@/common/lib/utils'
import { Position } from './layout'

export interface Item {
  id: string
  title: string
  to: string
  icon: ComponentType<{ className?: string; style?: CSSProperties; 'aria-hidden'?: boolean }>
  disabled?: boolean
}

export interface SkipLinkConfig {
  /** Id of the element to jump to. */
  targetId: string
  /** Visible text of the link. */
  label?: string
}

/** Sizes for the capsule and its items, in px. */
export interface NavPanelSizes {
  itemSize: number
  itemLabelMax: number
  iconSize: number
  burgerSize: number
  burgerBarWidth: number
  /** Panel content inset (px) on every side. */
  capsulePadding: number
  /** Space between the capsule's children (px). */
  capsuleGap: number
  /**
   * Header gutter (px) — the distance from the viewport edge to the logo and
   * burger. The mobile dropdown aligns to these gutters so it forms a single
   * vertical line with the logo on one side and the burger on the other.
   */
  gutter: number
}

/** Non-dimensional styles, passed as CSS values (usually `var(...)` refs). */
export interface NavPanelStyleValues {
  radiusPill: string
  radiusPanelStacked: string
  blur: string
  shadowPanel: string
  shadowItemHover: string
  shadowItemActive: string
  easing: string
  durationCapsule: string
  durationBurger: string
}

export interface Props {
  items: readonly Item[]
  activeId?: string | null
  /** Collapsed capsule hides its items until the menu is opened. */
  collapsed?: boolean
  /** Menu (and its burger toggle) is open. */
  open?: boolean
  /** Mobile opened menu stacks items vertically with permanent labels. */
  stacked?: boolean
  /** Explicit px width while the capsule animates; `undefined` lets CSS decide. */
  width?: number | string
  hoveredId?: string | null
  /** Breakpoint-resolved sizes supplied by the caller. */
  sizes: NavPanelSizes
  /** Non-dimensional style values supplied by the caller. */
  styles: NavPanelStyleValues
  /** Collapsed capsule width (px) used when no explicit `width` is given. */
  collapsedWidth?: number
  /** Renders a keyboard "skip to content" link as the first focusable element. */
  skipLink?: SkipLinkConfig
  onToggle?: () => void
  onHoverChange?: (id: string | null) => void
  onNavigate?: (item: Item) => void
  onTransitionEnd?: (event: TransitionEvent<HTMLElement>) => void
  className?: string
  /** Ref to the capsule element (used by the caller for width measurement). */
  ref?: Ref<HTMLDivElement>
}

function SkipLink({ targetId, label = 'Перейти к содержимому' }: SkipLinkConfig) {
  return (
    <a
      href={`#${targetId}`}
      className={cn(
        'sr-only',
        'focus:not-sr-only focus:absolute focus:left-0 focus:top-2 focus:z-[1001] focus:whitespace-nowrap focus:rounded-[var(--radius-pill)] focus:bg-[var(--color-accent)] focus:px-[var(--space-md)] focus:py-[var(--space-sm)] focus:text-xs focus:font-bold focus:text-[var(--color-on-accent)] focus:no-underline',
        'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-focus)]',
      )}
    >
      {label}
    </a>
  )
}

function Burger({
  open,
  onClick,
  sizes,
  styles,
}: {
  open: boolean
  onClick?: () => void
  sizes: NavPanelSizes
  styles: NavPanelStyleValues
}) {
  const barStyle: CSSProperties = {
    width: sizes.burgerBarWidth,
    transitionDuration: styles.durationBurger,
  }

  const bar = (variant?: string) =>
    cn('h-0.5 rounded-full bg-[var(--color-ink)] transition-all', open && variant)

  return (
    <button
      type="button"
      aria-expanded={open}
      aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
      onClick={onClick}
      className={cn(
        'flex shrink-0 cursor-pointer flex-col items-center justify-center gap-[5px] rounded-[var(--radius-pill)] border-0 p-0 outline-none',
        'hover:scale-[1.05]',
        'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-focus)]',
      )}
      style={{
        width: sizes.burgerSize,
        height: sizes.burgerSize,
        transitionProperty: 'opacity, transform',
        transitionDuration: `0.35s, 0.4s`,
        transitionTimingFunction: `ease, ${styles.easing}`,
      }}
    >
      <span className={bar('translate-y-[7px] rotate-45')} style={barStyle} />
      <span className={bar('scale-x-0 opacity-0')} style={barStyle} />
      <span className={bar('-translate-y-[7px] -rotate-45')} style={barStyle} />
    </button>
  )
}

function NavLink({
  item,
  active,
  labelVisible,
  hidden,
  stacked,
  sizes,
  styles,
  onHoverChange,
  onNavigate,
}: {
  item: Item
  active: boolean
  labelVisible: boolean
  hidden: boolean
  stacked: boolean
  sizes: NavPanelSizes
  styles: NavPanelStyleValues
  onHoverChange?: (id: string | null) => void
  onNavigate?: (item: Item) => void
}) {
  const Icon = item.icon

  const linkStyle: CSSProperties = {
    height: sizes.itemSize,
    maxWidth: hidden ? 0 : sizes.itemSize,
    minWidth: hidden ? 0 : sizes.itemSize,
    transitionProperty: 'max-width, opacity, visibility, background, transform, box-shadow',
    transitionDuration: `${styles.durationCapsule}, 0.35s, 0s, 0.3s, 0.35s, 0.35s`,
    transitionTimingFunction: `${styles.easing}, ease, ease, ease, ${styles.easing}, ease`,
  }

  return (
    <a
      href={item.to}
      aria-current={active ? 'page' : undefined}
      aria-disabled={item.disabled || undefined}
      onMouseEnter={() => onHoverChange?.(item.id)}
      onMouseLeave={() => onHoverChange?.(null)}
      onClick={() => onNavigate?.(item)}
      className={cn(
        'relative flex shrink-0 items-center justify-center rounded-[var(--radius-pill)] text-[var(--color-ink)] no-underline',
        !stacked &&
          'hover:bg-[var(--surface-hover)] hover:[box-shadow:var(--shadow-item-hover)]',
        'active:scale-[.96]',
        'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-focus)]',
        active &&
          'bg-[var(--surface-solid)] text-[var(--color-accent)] [box-shadow:var(--shadow-item-active)]',
        hidden && 'pointer-events-none invisible min-w-0 max-w-0 px-0 py-0 opacity-0',
        stacked && 'justify-start gap-3 px-4',
        !stacked && 'justify-start',
        !stacked && labelVisible && 'pr-4',
        item.disabled && 'pointer-events-none',
      )}
      style={{
        ...linkStyle,
        ...(stacked
          ? { maxWidth: 'none', minWidth: 0, width: '100%' }
          : hidden
            ? { paddingLeft: 0 }
            : { paddingLeft: (sizes.itemSize - sizes.iconSize) / 2 }),
        ...(labelVisible && !stacked && !hidden
          ? { maxWidth: sizes.itemLabelMax, minWidth: sizes.itemSize, width: 'fit-content' }
          : null),
      }}
    >
      <span
        className="flex shrink-0 items-center justify-center overflow-visible"
        style={{ width: sizes.iconSize, height: sizes.iconSize }}
      >
        <Icon
          aria-hidden
          className="block overflow-visible"
          style={{ width: sizes.iconSize, height: sizes.iconSize }}
        />
      </span>
      <span
        className={cn(
          'overflow-hidden whitespace-nowrap text-sm font-semibold text-[var(--color-ink)]',
          stacked ? 'min-w-0 max-w-none pl-0 opacity-100' : 'min-w-0 pl-3',
          !stacked && (labelVisible ? 'max-w-[200px] opacity-100' : 'max-w-0 pl-0 opacity-0'),
        )}
        style={{
          transitionProperty: 'max-width, opacity, padding',
          transitionDuration: `${styles.durationCapsule}, 0.25s, 0.25s`,
          transitionDelay: `0s, 0.18s, 0s`,
          transitionTimingFunction: `${styles.easing}, ease, ease`,
        }}
      >
        {item.title}
      </span>
    </a>
  )
}

/**
 * Pure presentational nav capsule. Layout and colors come from global tokens;
 * sizing and non-dimensional styles are supplied by the caller via props, so
 * this primitive stays free of any feature-specific token names.
 */
export function NavPanel({
  items,
  activeId = null,
  collapsed = false,
  open = false,
  stacked = false,
  width,
  hoveredId = null,
  sizes,
  styles,
  collapsedWidth,
  skipLink,
  onToggle,
  onHoverChange,
  onNavigate,
  onTransitionEnd,
  className,
  ref,
}: Props) {
  const hideItems = collapsed && !open
  const resolvedWidth = width ?? (hideItems ? collapsedWidth : undefined)

  const style: CSSProperties = { width: resolvedWidth }

  const panelBase = cn(
    'pointer-events-auto flex rounded-[var(--radius-pill)] border border-[var(--color-hairline)] bg-[var(--surface)] backdrop-blur-[var(--blur-panel)]',
    '[box-shadow:var(--shadow-panel)]',
    className,
  )

  const panelClassName = cn(
    panelBase,
    'items-center',
    hideItems && 'justify-center gap-0! overflow-hidden',
    stacked && 'flex-col items-stretch',
  )

  const panelStyle: CSSProperties = {
    ...style,
    padding: sizes.capsulePadding,
    gap: sizes.capsuleGap,
    transitionProperty: 'width, padding, gap',
    transitionDuration: `${styles.durationCapsule}, 0.35s, 0.35s`,
    transitionTimingFunction: `${styles.easing}, ${styles.easing}, ${styles.easing}`,
    ...(stacked ? { borderRadius: styles.radiusPanelStacked } : null),
  }

  const content = (
    <>
      {collapsed || open ? (
        <Burger open={open} onClick={onToggle} sizes={sizes} styles={styles} />
      ) : null}
      {items.map((item) => (
        <NavLink
          key={item.id}
          item={item}
          active={activeId === item.id}
          labelVisible={hoveredId === item.id}
          hidden={hideItems}
          stacked={stacked}
          sizes={sizes}
          styles={styles}
          onHoverChange={onHoverChange}
          onNavigate={onNavigate}
        />
      ))}
    </>
  )

  if (stacked) {
    // On mobile the burger capsule stays in flow (so the logo keeps its left
    // anchor) and holds the toggle in place; the items drop into a separate
    // fixed dropdown that opens *below* the burger, so the X stays visible.
    const anchorStyle: CSSProperties = {
      width: collapsedWidth,
      padding: sizes.capsulePadding,
      gap: sizes.capsuleGap,
      transitionProperty: 'width, padding, gap',
      transitionDuration: `${styles.durationCapsule}, 0.35s, 0.35s`,
      transitionTimingFunction: `${styles.easing}, ${styles.easing}, ${styles.easing}`,
    }

    const dropdownStyle: CSSProperties = {
      padding: sizes.capsulePadding,
      gap: sizes.capsuleGap,
      borderRadius: styles.radiusPanelStacked,
      transformOrigin: 'top right',
    }

    return (
      <>
        {skipLink ? <SkipLink {...skipLink} /> : null}
        <div
          ref={ref}
          style={anchorStyle}
          className={cn(panelBase, 'relative z-[2] items-center justify-center')}
        >
          <Burger open={open} onClick={onToggle} sizes={sizes} styles={styles} />
        </div>
        <Position
          position="fixed"
          top={`calc(var(--header-top) + ${sizes.burgerSize + 2 * sizes.capsulePadding + 12}px)`}
          right={sizes.gutter}
          left={sizes.gutter}
          style={dropdownStyle}
          className={cn(
            panelBase,
            'w-auto max-w-none flex-col items-stretch origin-top-right transition-[opacity,transform] duration-300',
            open
              ? 'pointer-events-auto scale-100 opacity-100'
              : 'pointer-events-none invisible scale-[.98] opacity-0',
          )}
          onTransitionEnd={onTransitionEnd}
        >
          {items.map((item) => (
            <NavLink
              key={item.id}
              item={item}
              active={activeId === item.id}
              labelVisible={hoveredId === item.id}
              hidden={false}
              stacked
              sizes={sizes}
              styles={styles}
              onHoverChange={onHoverChange}
              onNavigate={onNavigate}
            />
          ))}
        </Position>
      </>
    )
  }

  return (
    <>
      {skipLink ? <SkipLink {...skipLink} /> : null}
      <div ref={ref} style={panelStyle} className={panelClassName} onTransitionEnd={onTransitionEnd}>
        {content}
      </div>
    </>
  )
}
