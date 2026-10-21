import styled from 'styled-components'
import { Link } from 'react-router'
import { BREAKPOINTS } from '@/common/styles/breakpoints'

export const ShowcaseCardStyles = styled(Link)`& {
  display: block;
  height: 100%;
  color: inherit;
  text-decoration: none;
}

& [data-part=card] {
  position: relative;
  height: 100%;
  padding: 0;
  border: var(--border-width) solid var(--color-hairline);
  border-radius: var(--radius-panel);
  background: var(--surface-raised);
  transition:
    border-color var(--duration-fast) var(--ease-out),
    transform var(--duration-fast) var(--ease-out),
    box-shadow var(--duration-fast) var(--ease-out);
}

&:hover [data-part=card],&:focus-visible [data-part=card] {
  border-color: var(--color-hairline-strong);
  box-shadow: var(--shadow-sm);
  transform: translateY(-2px);
}

&:focus-visible {
  border-radius: var(--radius-panel);
  outline: var(--border-width) solid var(--color-focus);
  outline-offset: var(--space-xs);
}

& [data-part=content] {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  padding: var(--space-lg);
}

& [data-part=meta] {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-sm);
}

& [data-part=number] {
  color: var(--color-text-muted);
  font-size: var(--font-size-caption);
  font-variant-numeric: tabular-nums;
}

& [data-part=copy] {
  padding-right: var(--space-xl);
}

& [data-part=title] {
  margin: 0;
  color: var(--onix-hero-text-primary);
  font-size: var(--font-size-card-title);
  line-height: var(--line-height-tight);
}

& [data-part=description] {
  margin: var(--space-sm) 0 0;
  color: var(--color-text-muted);
  line-height: var(--line-height-body);
}

& [data-part=arrow] {
  position: absolute;
  right: var(--space-lg);
  bottom: var(--space-lg);
  width: var(--font-size-title);
  height: var(--font-size-title);
  color: var(--color-ink);
  transition: color var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out);
}

&:hover [data-part=arrow],&:focus-visible [data-part=arrow] {
  color: var(--color-accent-hover);
  transform: translate(2px, -2px);
}

@media (max-width: ${BREAKPOINTS.sm}) {
  & [data-part=content] {
    padding: var(--space-md);
  }

  & [data-part=arrow] {
    right: var(--space-md);
    bottom: var(--space-md);
  }
}
`
