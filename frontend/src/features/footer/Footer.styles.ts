import styled from 'styled-components'
import { BREAKPOINTS } from '@/common/styles/breakpoints'

export const FooterStyles = styled.footer`& {
  margin-top: auto;
  padding-block: var(--space-2xl) var(--space-lg);
  background: color-mix(in srgb, var(--surface-raised) 72%, transparent);
}

& [data-part=inner] {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

& [data-part=separator] {
  background: var(--onix-hero-divider);
}

& [data-part=top] {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr) auto;
  align-items: center;
  gap: var(--space-xl);
  padding-block: var(--space-md);
}

& [data-part=brand] {
  --footer-logo-height: var(--space-xl);

  display: flex;
  align-items: center;
  gap: var(--space-md);
}

& [data-part=brand] p,& [data-part=bottom] p {
  margin: 0;
}

& [data-part=brand] p {
  color: var(--color-text-muted);
  font-size: var(--font-size-caption);
  line-height: var(--line-height-body);
}

& [data-part=links] {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md) var(--space-lg);
  margin: 0;
  padding: 0;
  list-style: none;
}

& [data-part=links] a,& [data-part=contact],& [data-part=bottom] a {
  color: var(--onix-hero-text-primary);
  text-decoration: none;
  transition: color var(--duration-fast) var(--ease-out);
}

& [data-part=links] a:hover,& [data-part=contact]:hover,& [data-part=bottom] a:hover {
  color: var(--color-accent-hover);
}

& [data-part=contact] {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  font-weight: 600;
  white-space: nowrap;
}

& [data-part=contact] svg {
  width: var(--font-size-title);
  height: var(--font-size-title);
}

& [data-part=bottom] {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  color: var(--color-text-muted);
  font-size: var(--font-size-caption);
}

& [data-part=links] a:focus-visible,& [data-part=contact]:focus-visible,& [data-part=bottom] a:focus-visible {
  border-radius: var(--radius-sm);
  outline: var(--border-width) solid var(--color-focus);
  outline-offset: var(--space-xs);
}

@media (max-width: ${BREAKPOINTS.lg}) {
  & [data-part=top] {
    grid-template-columns: 1fr auto;
  }

  & [data-part=top] nav {
    grid-row: 2;
  }

  & [data-part=contact] {
    grid-column: 2;
    grid-row: 1;
  }
}

@media (max-width: ${BREAKPOINTS.sm}) {
  & {
    padding-block: var(--space-xl) var(--space-md);
  }

  & [data-part=top] {
    grid-template-columns: 1fr;
    gap: var(--space-lg);
  }

  & [data-part=top] nav,& [data-part=contact] {
    grid-column: auto;
    grid-row: auto;
  }

  & [data-part=links] {
    gap: var(--space-sm) var(--space-lg);
  }

  & [data-part=bottom] {
    align-items: flex-start;
    flex-direction: column;
  }
}
`
