import styled from 'styled-components'
import { BREAKPOINTS } from '@onix/ui-kit'

export const CookieNoticeStyles = styled.aside`& {
  position: fixed;
  z-index: var(--layer-cookie-notice);
  inset-inline: var(--page-inline);
  bottom: var(--space-md);
  pointer-events: none;
}

& [data-part=panel] {
  display: flex;
  max-width: var(--page-max-width);
  align-items: center;
  justify-content: space-between;
  gap: var(--space-lg);
  margin-inline: auto;
  border: var(--border-width) solid var(--color-hairline-strong);
  border-radius: var(--radius-panel);
  background: var(--surface-raised);
  padding: var(--space-md) var(--space-lg);
  box-shadow: var(--shadow-md);
  pointer-events: auto;
}

& p {
  max-width: 78ch;
  margin: 0;
  color: var(--onix-hero-text-primary);
  font-size: 0.875rem;
  line-height: var(--line-height-body);
}

& a {
  color: var(--onix-hero-text-primary);
  text-decoration-color: var(--color-accent-hover);
  text-underline-offset: 0.2em;
}

& a:focus-visible {
  border-radius: var(--radius-sm);
  outline: var(--border-width) solid var(--color-focus);
  outline-offset: var(--space-xs);
}

& [data-part=accept] {
  min-height: 2.75rem;
  border-radius: var(--radius-lg);
  padding-inline: var(--space-lg);
}

@media (max-width: ${BREAKPOINTS.sm}) {
  & {
    inset-inline: var(--space-sm);
    bottom: var(--space-sm);
  }

  & [data-part=panel] {
    align-items: stretch;
    flex-direction: column;
    gap: var(--space-md);
    border-radius: var(--radius-lg);
    padding: var(--space-md);
  }

  & [data-part=accept] {
    width: 100%;
  }
}
`
