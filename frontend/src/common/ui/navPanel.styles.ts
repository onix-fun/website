import styled, { css } from 'styled-components'
import { Position } from './layout'

/**
 * Surface of the nav capsule. The translucent fill is clipped to the padding
 * box while the brand's gradient stroke fills the border box, so the hairline
 * follows the pill's radius — something `border-image` cannot do. Elevation
 * comes from the caller as `--nav-shadow-panel`.
 */
const capsuleSurface = css`
  & {
    border: var(--border-width) solid transparent;
    background-image: linear-gradient(var(--surface), var(--surface)), var(--nav-stroke);
    background-origin: border-box;
    background-clip: padding-box, border-box;
    box-shadow: var(--nav-shadow-panel);
  }
`

/** Desktop capsule and the mobile burger anchor. */
export const NavPanelSurface = styled.div`
  ${capsuleSurface}
`

/** Mobile dropdown panel (fixed, stacked items). */
export const NavPanelDropdown = styled(Position)`
  ${capsuleSurface}
`
