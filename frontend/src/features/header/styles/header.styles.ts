import styled from 'styled-components'
import { BREAKPOINTS } from '@/common/styles/breakpoints'

export const HeaderStyles = styled.header`
& {
  --blur-panel: var(--header-panel-blur);
  --radius-panel-stacked: var(--header-panel-stacked-radius);
  --nav-surface-hover: color-mix(in srgb, var(--color-accent-soft) 24%, var(--surface));
  --nav-surface-active: color-mix(in srgb, var(--color-accent-soft) 38%, var(--surface));
  --nav-focus: var(--color-focus);

  /* Capsule elevation = the Onix mark's black, down-left shadow. */
  --shadow-panel: var(--shadow-capsule);

  /* Capsule hairline = the brand's gradient stroke (bright at the lit edge). */
  --stroke-panel: var(--stroke-panel-gradient);

  /* Item states are header-local: they compose the global elevation tokens
     with an inner top highlight bespoke to the capsule. */
  --shadow-item-hover: var(--shadow-inset-top), var(--shadow-sm);
  --shadow-item-active: var(--shadow-inset-top), var(--shadow-sm);

  --duration-burger: var(--duration-base);

  /* Fixed-bar placement + spacer height for non-hero routes. */
  --header-top: var(--header-fixed-top);
  --header-spacer: var(--header-spacer-height);
}

& [data-part=navigationControls] {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  gap: var(--space-sm);
}

& [data-part=themeToggleSlot] {
  display: flex;
  width: var(--header-controls-slot-size);
  height: var(--header-controls-slot-size);
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
  opacity: 1;
  transform: scale(1);
  transition:
    width var(--duration-base) var(--ease-out),
    opacity var(--duration-fast) ease,
    transform var(--duration-base) var(--ease-out),
    visibility 0s;
}

& [data-state=hidden] {
  width: 0;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
  transform: scale(0.78);
  visibility: hidden;
  transition:
    width var(--duration-base) var(--ease-out),
    opacity var(--duration-fast) ease,
    transform var(--duration-base) var(--ease-out),
    visibility 0s;
}

& [data-part=themeToggle] {
  display: grid;
  width: var(--header-theme-button-size);
  height: var(--header-theme-button-size);
  flex: 0 0 auto;
  place-items: center;
  border: var(--border-width) solid var(--color-hairline);
  border-radius: var(--radius-pill);
  background: var(--surface);
  color: var(--color-ink);
  box-shadow: var(--shadow-sm);
  backdrop-filter: blur(var(--header-theme-blur));
  cursor: pointer;
  transition:
    color var(--duration-fast) ease,
    background-color var(--duration-fast) ease,
    border-color var(--duration-fast) ease,
    transform var(--duration-fast) var(--ease-out);
}

& [data-part=themeToggle]:hover {
  border-color: var(--color-hairline-strong);
  background: var(--surface-hover);
  transform: translateY(calc(-1 * var(--header-hover-lift)));
}

& [data-part=themeToggle]:focus-visible {
  outline: var(--header-focus-outline) solid var(--nav-focus);
  outline-offset: var(--header-focus-offset);
}

& [data-part=themeToggle] svg {
  width: var(--header-theme-icon-size);
  height: var(--header-theme-icon-size);
}

@media (max-width: ${BREAKPOINTS.md}) {
  & {
    --header-top: var(--header-fixed-top);
    --header-spacer: var(--header-spacer-height);
  }
}
`
